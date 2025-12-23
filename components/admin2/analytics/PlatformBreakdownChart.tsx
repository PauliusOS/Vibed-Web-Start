"use client";

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
import { Instagram } from "lucide-react";

interface PlatformData {
  instagram: {
    videoCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalEngagement: number;
    avgEngagementRate: number;
    percentage: number;
    viewsPercentage: number;
  };
  tiktok: {
    videoCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalEngagement: number;
    avgEngagementRate: number;
    percentage: number;
    viewsPercentage: number;
  };
  totals: {
    videos: number;
    views: number;
    engagement: number;
  };
}

interface PlatformBreakdownChartProps {
  data: PlatformData | undefined;
  isLoading?: boolean;
}

const PLATFORM_COLORS = {
  instagram: "#E1306C",
  tiktok: "#FFFFFF",
};

export function PlatformBreakdownChart({
  data,
  isLoading,
}: PlatformBreakdownChartProps) {
  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
          <div className="flex-1 space-y-4 ml-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </GlassPanel>
    );
  }

  if (!data || data.totals.videos === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Platform Breakdown</h3>
        <div className="h-[250px] flex items-center justify-center text-white/40">
          No platform data available yet
        </div>
      </GlassPanel>
    );
  }

  const chartData = [
    {
      name: "Instagram",
      value: data.instagram.videoCount,
      views: data.instagram.totalViews,
      engagement: data.instagram.totalEngagement,
      avgRate: data.instagram.avgEngagementRate,
      percentage: data.instagram.percentage,
      color: PLATFORM_COLORS.instagram,
    },
    {
      name: "TikTok",
      value: data.tiktok.videoCount,
      views: data.tiktok.totalViews,
      engagement: data.tiktok.totalEngagement,
      avgRate: data.tiktok.avgEngagementRate,
      percentage: data.tiktok.percentage,
      color: PLATFORM_COLORS.tiktok,
    },
  ].filter((p) => p.value > 0);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <GlassPanel className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Platform Breakdown</h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="h-[250px] w-[250px] flex-shrink-0">
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
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(0,0,0,0.2)"
                  />
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
                  const d = payload[0].payload;
                  return (
                    <div className="bg-black/90 border border-white/10 rounded-lg p-3">
                      <p className="text-white font-semibold mb-2">{d.name}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-white/80">
                          <span className="text-white/40">Videos:</span> {d.value}
                        </p>
                        <p className="text-white/80">
                          <span className="text-white/40">Views:</span>{" "}
                          {formatValue(d.views)}
                        </p>
                        <p className="text-white/80">
                          <span className="text-white/40">Engagement:</span>{" "}
                          {formatValue(d.engagement)}
                        </p>
                        <p className="text-white/80">
                          <span className="text-white/40">Avg Rate:</span>{" "}
                          {d.avgRate.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Details */}
        <div className="flex-1 space-y-4 w-full">
          {/* Instagram Card */}
          <div className="bg-gradient-to-r from-[#E1306C]/20 to-transparent rounded-xl p-4 border border-[#E1306C]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#E1306C] flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Instagram</h4>
                <p className="text-xs text-white/60">
                  {data.instagram.percentage.toFixed(1)}% of videos
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/40">Videos</p>
                <p className="text-lg font-semibold text-white">
                  {data.instagram.videoCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Views</p>
                <p className="text-lg font-semibold text-white">
                  {formatValue(data.instagram.totalViews)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Avg Rate</p>
                <p className="text-lg font-semibold text-white">
                  {data.instagram.avgEngagementRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* TikTok Card */}
          <div className="bg-gradient-to-r from-white/10 to-transparent rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-black border border-white/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold">TikTok</h4>
                <p className="text-xs text-white/60">
                  {data.tiktok.percentage.toFixed(1)}% of videos
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/40">Videos</p>
                <p className="text-lg font-semibold text-white">
                  {data.tiktok.videoCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Views</p>
                <p className="text-lg font-semibold text-white">
                  {formatValue(data.tiktok.totalViews)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Avg Rate</p>
                <p className="text-lg font-semibold text-white">
                  {data.tiktok.avgEngagementRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Total Videos</p>
          <p className="text-xl font-bold text-white">{data.totals.videos}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Total Views</p>
          <p className="text-xl font-bold text-white">{formatValue(data.totals.views)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Total Engagement</p>
          <p className="text-xl font-bold text-white">{formatValue(data.totals.engagement)}</p>
        </div>
      </div>
    </GlassPanel>
  );
}
