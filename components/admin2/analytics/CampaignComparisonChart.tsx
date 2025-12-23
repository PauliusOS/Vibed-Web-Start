"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  budget: number;
  videoCount: number;
  views: number;
  engagement: number;
  avgEngagementRate: number;
  roi: number;
}

interface CampaignComparisonChartProps {
  data: CampaignData[] | undefined;
  isLoading?: boolean;
}

type SortBy = "views" | "engagement" | "roi";

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

export function CampaignComparisonChart({
  data,
  isLoading,
}: CampaignComparisonChartProps) {
  const [sortBy, setSortBy] = useState<SortBy>("views");

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Campaign Comparison</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No campaigns to compare yet
        </div>
      </GlassPanel>
    );
  }

  // Sort data by selected metric
  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 8);

  // Prepare chart data
  const chartData = sortedData.map((campaign, index) => ({
    name: campaign.name.length > 15 ? campaign.name.slice(0, 15) + "..." : campaign.name,
    fullName: campaign.name,
    value: campaign[sortBy],
    views: campaign.views,
    engagement: campaign.engagement,
    roi: campaign.roi,
    status: campaign.status,
    color: COLORS[index % COLORS.length],
    id: campaign.id,
  }));

  const formatValue = (value: number) => {
    if (sortBy === "roi") return `${value.toFixed(1)}%`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Campaign Comparison</h3>
          <p className="text-sm text-white/60 mt-1">{data.length} campaigns</p>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(["views", "engagement", "roi"] as SortBy[]).map((sort) => (
            <Button
              key={sort}
              size="sm"
              variant={sortBy === sort ? "secondary" : "ghost"}
              className={
                sortBy === sort
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
              onClick={() => setSortBy(sort)}
            >
              {sort === "roi" ? "ROI" : sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis
              type="number"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatValue(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              width={120}
            />
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
                    <p className="text-white font-semibold mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-white/80">
                        <span className="text-white/40">Views:</span>{" "}
                        {data.views.toLocaleString()}
                      </p>
                      <p className="text-white/80">
                        <span className="text-white/40">Engagement:</span>{" "}
                        {data.engagement.toLocaleString()}
                      </p>
                      <p className="text-white/80">
                        <span className="text-white/40">ROI:</span> {data.roi.toFixed(1)}%
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-2 ${
                          data.status === "active"
                            ? "border-emerald-500 text-emerald-400"
                            : data.status === "completed"
                            ? "border-blue-500 text-blue-400"
                            : "border-white/30 text-white/60"
                        }`}
                      >
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* View All Link */}
      <div className="flex justify-center mt-4 pt-4 border-t border-white/10">
        <Link href="/admin2/campaigns">
          <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
            View All Campaigns
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}
