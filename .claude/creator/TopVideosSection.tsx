"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Video, Eye, Heart, MessageCircle, Share2, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopVideo {
  _id: string;
  platform: "instagram" | "tiktok";
  videoUrl?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  campaignName?: string;
  status: string;
}

interface TopVideosSectionProps {
  videos?: TopVideo[] | null;
}

function VideoCardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded-full bg-white/[0.06]" />
          <div className="h-4 w-24 rounded bg-white/[0.06]" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 rounded bg-white/[0.06]" />
          <div className="h-8 w-20 rounded bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 rounded-lg bg-white/[0.06]" />
          <div className="h-14 rounded-lg bg-white/[0.06]" />
          <div className="h-14 rounded-lg bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export function TopVideosSection({ videos }: TopVideosSectionProps) {
  if (videos === undefined) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Top Performing Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Top Performing Videos</h2>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
          <p className="text-sm text-white/50 max-w-sm">
            Submit your first video to start tracking performance and see your top performers here.
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Top Performing Videos</h2>
        <span className="text-xs text-white/40">
          Showing top {videos.length} by views
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all space-y-4">
              {/* Hover glow - Blue theme */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

              <div className="relative">
                {/* Header with platform badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      video.platform === "instagram"
                        ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30"
                        : "bg-black/50 text-white border border-white/20"
                    )}
                  >
                    {video.platform === "instagram" ? "Instagram" : "TikTok"}
                  </span>
                  {video.campaignName && (
                    <span className="text-xs text-white/40 truncate max-w-[120px]">
                      {video.campaignName}
                    </span>
                  )}
                </div>

                {/* View count */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Views</span>
                  </div>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {formatNumber(video.views)}
                  </p>
                </div>

                {/* Engagement metrics - Blue theme */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.02]">
                    <Heart className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-white">
                      {formatNumber(video.likes)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.02]">
                    <MessageCircle className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-medium text-white">
                      {formatNumber(video.comments)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.02]">
                    <Share2 className="h-4 w-4 text-blue-300" />
                    <span className="text-xs font-medium text-white">
                      {formatNumber(video.shares)}
                    </span>
                  </div>
                </div>

                {/* Engagement rate badge - Keep semantic green for good rates */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                      video.engagementRate > 5
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : video.engagementRate > 2
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-white/[0.04] text-white/50 border-white/[0.08]"
                    )}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {video.engagementRate.toFixed(1)}%
                  </span>

                  {video.videoUrl && (
                    <Link
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
