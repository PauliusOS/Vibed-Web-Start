"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus, BarChart3, Video, Eye, Heart } from "lucide-react";
import { FramerDualLineChart } from "@/components/admin/charts";
import { cn } from "@/lib/utils";

interface GlassCampaignInsightsProps {
  analytics: {
    campaign: {
      name: string;
      status: "draft" | "active" | "paused" | "completed" | "archived";
    };
    totals: {
      videos: number;
      views: number;
      engagement: number;
      avgEngagementRate: number;
    };
    performanceTrend: "up" | "down" | "stable";
  } | null;
  trends?: Array<{
    timestamp: number;
    views: number;
    engagement: number;
    engagementRate: number;
  }>;
  videoPerformance?: {
    topPerformers: Array<{
      videoId: string;
      creatorUsername: string;
      platform: "instagram" | "tiktok";
      videoUrl?: string;
      views: number;
      engagement: number;
      engagementRate: number;
    }>;
    bottomPerformers: Array<{
      videoId: string;
      creatorUsername: string;
      platform: "instagram" | "tiktok";
      videoUrl?: string;
      views: number;
      engagement: number;
      engagementRate: number;
    }>;
  };
}


function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-white/40" />;
};

export function GlassCampaignInsights({
  analytics,
  trends,
  videoPerformance,
}: GlassCampaignInsightsProps) {
  if (!analytics) {
    return (
      <div className="p-12 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-center text-white/50">No analytics data available yet</p>
      </div>
    );
  }

  const chartData = trends?.map((t) => ({
    ...t,
    displayDate: formatDate(t.timestamp),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-sky-400" />
            <span className="text-xs text-white/50">Total Videos</span>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totals.videos}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-white/50">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(analytics.totals.views)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-blue-300" />
            <span className="text-xs text-white/50">Total Engagement</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(analytics.totals.engagement)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-white/50">Avg. Engagement</span>
            </div>
            <TrendIcon trend={analytics.performanceTrend} />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totals.avgEngagementRate.toFixed(2)}%</p>
        </motion.div>
      </div>

      {/* Performance Trends Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">Performance Trends</h3>
            <p className="text-sm text-white/50">Campaign performance over the last 30 days</p>
          </div>

          <FramerDualLineChart
            data={chartData.map(d => ({ ...d, date: d.displayDate }))}
            lines={[
              { dataKey: "views", label: "Views", color: "#38bdf8" },
              { dataKey: "engagement", label: "Engagement", color: "#3b82f6" },
            ]}
            height={280}
            formatValue={(value) => formatNumber(value)}
          />
        </motion.div>
      )}

      {/* Video Performance Grid */}
      {videoPerformance && videoPerformance.topPerformers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Top Performing Videos</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoPerformance.topPerformers.slice(0, 6).map((video, index) => (
              <motion.div
                key={video.videoId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      video.platform === "instagram"
                        ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30"
                        : "bg-black/50 text-white border border-white/20"
                    )}
                  >
                    {video.platform === "instagram" ? "Instagram" : "TikTok"}
                  </span>
                  <span className="text-xs text-white/40">#{index + 1}</span>
                </div>

                <p className="text-sm text-white/70 mb-3 truncate">
                  @{video.creatorUsername}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-semibold text-white">{formatNumber(video.views)}</p>
                    <p className="text-xs text-white/40">Views</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{formatNumber(video.engagement)}</p>
                    <p className="text-xs text-white/40">Engagement</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-400">{video.engagementRate.toFixed(1)}%</p>
                    <p className="text-xs text-white/40">Rate</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
