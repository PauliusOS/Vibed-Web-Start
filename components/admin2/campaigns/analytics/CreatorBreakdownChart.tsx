"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PieChart as PieIcon, TableIcon } from "lucide-react";

interface CreatorData {
  creatorId?: string;
  username?: string;
  platform?: string;
  views: number;
  engagement: number;
  engagementRate: number;
  videoCount?: number;
}

interface CreatorBreakdownChartProps {
  data: CreatorData[] | undefined;
  isLoading?: boolean;
}

const COLORS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export function CreatorBreakdownChart({
  data,
  isLoading,
}: CreatorBreakdownChartProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Creator Contribution</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No creator data available
        </div>
      </GlassPanel>
    );
  }

  // Aggregate by creator (filter out items without creatorId)
  const creatorMap = new Map<string, CreatorData & { totalViews: number }>();
  data.forEach((item) => {
    if (!item.creatorId) return; // Skip items without a creator
    const existing = creatorMap.get(item.creatorId);
    if (existing) {
      existing.totalViews += item.views;
      existing.views += item.views;
      existing.engagement += item.engagement;
      existing.videoCount = (existing.videoCount || 0) + 1;
    } else {
      creatorMap.set(item.creatorId, {
        ...item,
        totalViews: item.views,
        videoCount: 1,
      });
    }
  });

  const aggregatedData = Array.from(creatorMap.values())
    .sort((a, b) => b.totalViews - a.totalViews);

  const totalViews = aggregatedData.reduce((sum, c) => sum + c.totalViews, 0);

  // Pie chart data
  const chartData = aggregatedData.slice(0, 8).map((creator, index) => ({
    name: creator.username || "Unknown",
    value: creator.totalViews,
    percentage: totalViews > 0 ? (creator.totalViews / totalViews) * 100 : 0,
    color: COLORS[index % COLORS.length],
    ...creator,
  }));

  // Add "Others" if more than 8 creators
  if (aggregatedData.length > 8) {
    const othersViews = aggregatedData
      .slice(8)
      .reduce((sum, c) => sum + c.totalViews, 0);
    chartData.push({
      name: "Others",
      value: othersViews,
      percentage: totalViews > 0 ? (othersViews / totalViews) * 100 : 0,
      color: "#6b7280",
      creatorId: "others",
      views: othersViews,
      engagement: 0,
      engagementRate: 0,
      totalViews: othersViews,
    });
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Creator Contribution</h3>
          <p className="text-sm text-white/60 mt-1">
            {aggregatedData.length} creators • {formatViews(totalViews)} total views
          </p>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <Button
            size="sm"
            variant={view === "chart" ? "secondary" : "ghost"}
            className={view === "chart"
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-white/60 hover:text-white hover:bg-white/10"
            }
            onClick={() => setView("chart")}
          >
            <PieIcon className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={view === "table" ? "secondary" : "ghost"}
            className={view === "table"
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-white/60 hover:text-white hover:bg-white/10"
            }
            onClick={() => setView("table")}
          >
            <TableIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-black/90 border border-white/10 rounded-lg p-3">
                      <p className="text-white font-semibold mb-2">{data.name}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-white/80">
                          <span className="text-white/40">Views:</span> {formatViews(data.value)}
                        </p>
                        <p className="text-white/80">
                          <span className="text-white/40">Share:</span> {data.percentage.toFixed(1)}%
                        </p>
                        {data.videoCount && (
                          <p className="text-white/80">
                            <span className="text-white/40">Videos:</span> {data.videoCount}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span className="text-white/60 text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Creator</TableHead>
                <TableHead className="text-white/60 text-right">Videos</TableHead>
                <TableHead className="text-white/60 text-right">Views</TableHead>
                <TableHead className="text-white/60 text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregatedData.map((creator, index) => (
                <TableRow key={creator.creatorId} className="border-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className="text-xs"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {(creator.username || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white">
                        {creator.username || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-white/80">
                    {creator.videoCount || 1}
                  </TableCell>
                  <TableCell className="text-right text-white/80">
                    {formatViews(creator.totalViews)}
                  </TableCell>
                  <TableCell className="text-right text-white/80">
                    {totalViews > 0
                      ? ((creator.totalViews / totalViews) * 100).toFixed(1)
                      : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </GlassPanel>
  );
}
