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
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface VideoData {
  videoId: string;
  creatorUsername: string;
  platform: "instagram" | "tiktok";
  views: number;
  engagement: number;
  engagementRate: number;
  videoUrl?: string;
}

interface VideoComparisonChartProps {
  data: {
    topPerformers: VideoData[];
    bottomPerformers: VideoData[];
    all: VideoData[];
  } | undefined;
  isLoading?: boolean;
  campaignId: string;
}

type SortBy = "views" | "engagement" | "engagementRate";

export function VideoComparisonChart({
  data,
  isLoading,
  campaignId,
}: VideoComparisonChartProps) {
  const [sortBy, setSortBy] = useState<SortBy>("views");
  const [showAll, setShowAll] = useState(false);

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

  if (!data || data.all.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Video Performance</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No videos to compare yet
        </div>
      </GlassPanel>
    );
  }

  // Sort and limit data
  const sortedVideos = [...data.all]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, showAll ? 20 : 10);

  // Format data for chart
  const chartData = sortedVideos.map((video) => ({
    name: video.creatorUsername.length > 12
      ? video.creatorUsername.slice(0, 12) + "..."
      : video.creatorUsername,
    value: sortBy === "engagementRate" ? video.engagementRate : video[sortBy],
    platform: video.platform,
    videoId: video.videoId,
    fullName: video.creatorUsername,
    views: video.views,
    engagement: video.engagement,
    engagementRate: video.engagementRate,
  }));

  const getBarColor = (platform: string) => {
    return platform === "instagram" ? "#E1306C" : "#000000";
  };

  const formatValue = (value: number) => {
    if (sortBy === "engagementRate") return `${value.toFixed(2)}%`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Video Performance</h3>
          <p className="text-sm text-white/60 mt-1">
            {data.all.length} videos total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["views", "engagement", "engagementRate"] as SortBy[]).map((sort) => (
              <Button
                key={sort}
                size="sm"
                variant={sortBy === sort ? "secondary" : "ghost"}
                className={sortBy === sort
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => setSortBy(sort)}
              >
                {sort === "engagementRate" ? "Rate" : sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            ))}
          </div>
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
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
              }}
              labelStyle={{ color: "white", fontWeight: "bold", marginBottom: "8px" }}
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-black/90 border border-white/10 rounded-lg p-3">
                    <p className="text-white font-semibold mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-white/80">
                        <span className="text-white/40">Views:</span> {data.views.toLocaleString()}
                      </p>
                      <p className="text-white/80">
                        <span className="text-white/40">Engagement:</span> {data.engagement.toLocaleString()}
                      </p>
                      <p className="text-white/80">
                        <span className="text-white/40">Rate:</span> {data.engagementRate.toFixed(2)}%
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-2 ${data.platform === "instagram" ? "border-pink-500 text-pink-400" : "border-white text-white"}`}
                      >
                        {data.platform}
                      </Badge>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.platform)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.all.length > 10 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `Show All ${data.all.length} Videos`}
          </Button>
        </div>
      )}

      {/* Platform Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#E1306C]" />
          <span className="text-sm text-white/60">Instagram</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-black border border-white/20" />
          <span className="text-sm text-white/60">TikTok</span>
        </div>
      </div>
    </GlassPanel>
  );
}
