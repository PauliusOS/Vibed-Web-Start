"use client";

import { motion } from "motion/react";
import { Trophy, TrendingUp, TrendingDown, Minus, Eye, Heart, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountAnimation } from "@/hooks/useCountAnimation";

interface GlassPerformanceHighlightsProps {
  highlights: {
    totalViews: number;
    totalEngagement: number;
    topCreator?: {
      username: string;
      views: number;
    };
    bestVideo?: {
      creatorUsername: string;
      views: number;
      engagementRate: number;
    };
    trend: "up" | "down" | "stable";
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { value: animatedValue } = useCountAnimation(value, { duration: 1500 });
  return <>{formatNumber(Math.round(animatedValue))}{suffix}</>;
}

export function GlassPerformanceHighlights({ highlights }: GlassPerformanceHighlightsProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "Performing above average",
    },
    down: {
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "Needs attention",
    },
    stable: {
      icon: Minus,
      color: "text-white/50",
      bg: "bg-white/[0.04]",
      border: "border-white/[0.08]",
      label: "Steady performance",
    },
  };

  const trend = trendConfig[highlights.trend];
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Hover glow - Blue theme */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

      <div className="relative rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-all overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Trophy className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Campaign Highlights</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Overall Performance */}
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className={cn("flex items-center gap-2 mb-3", trend.color)}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{trend.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-2xl font-bold text-white">
                    <AnimatedNumber value={highlights.totalViews} />
                  </span>
                </div>
                <p className="text-xs text-white/50">Total Views</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-blue-300" />
                  <span className="text-2xl font-bold text-white">
                    <AnimatedNumber value={highlights.totalEngagement} />
                  </span>
                </div>
                <p className="text-xs text-white/50">Total Engagement</p>
              </div>
            </div>
          </div>

          {/* Top Creator */}
          {highlights.topCreator && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="p-4 rounded-lg bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-medium text-white">Top Creator</span>
              </div>
              <p className="text-lg font-bold text-white mb-1">
                @{highlights.topCreator.username}
              </p>
              <p className="text-sm text-white/50">
                {formatNumber(highlights.topCreator.views)} views
              </p>
            </motion.div>
          )}

          {/* Best Video */}
          {highlights.bestVideo && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Best Performing Video</span>
              </div>
              <p className="text-sm text-white/70 mb-2">
                by {highlights.bestVideo.creatorUsername}
              </p>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-white/70">
                  {formatNumber(highlights.bestVideo.views)} views
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {highlights.bestVideo.engagementRate.toFixed(2)}% engagement
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
