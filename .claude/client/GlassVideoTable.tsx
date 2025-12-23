"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Share2, ExternalLink, TrendingUp, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface Video {
  _id: Id<"videos">;
  platform: "instagram" | "tiktok";
  videoUrl?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  status: string;
  creatorUsername?: string;
  createdAt?: number;
}

interface GlassVideoTableProps {
  videos: Video[];
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusConfig = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  tracking: { label: "Tracking", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

export function GlassVideoTable({ videos }: GlassVideoTableProps) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {videos.map((video, index) => {
              const status = statusConfig[video.status as keyof typeof statusConfig] || statusConfig.pending;

              return (
                <motion.tr
                  key={video._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        video.platform === "instagram"
                          ? "bg-gradient-to-br from-pink-500/20 to-rose-500/20"
                          : "bg-black/50 border border-white/20"
                      )}>
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            video.platform === "instagram"
                              ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300"
                              : "bg-black/50 text-white"
                          )}
                        >
                          {video.platform === "instagram" ? "Instagram" : "TikTok"}
                        </span>
                        {video.createdAt && (
                          <p className="text-xs text-white/40 mt-1">
                            {formatDate(video.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">
                      @{video.creatorUsername || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {formatNumber(video.views)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs text-white/70">{formatNumber(video.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-xs text-white/70">{formatNumber(video.comments)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs text-white/70">{formatNumber(video.shares)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        video.engagementRate > 5
                          ? "bg-emerald-500/10 text-emerald-400"
                          : video.engagementRate > 2
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-white/[0.04] text-white/50"
                      )}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {video.engagementRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      status.bg, status.border, status.color
                    )}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
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
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-white/[0.04]">
        {videos.map((video, index) => {
          const status = statusConfig[video.status as keyof typeof statusConfig] || statusConfig.pending;

          return (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      video.platform === "instagram"
                        ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300"
                        : "bg-black/50 text-white border border-white/20"
                    )}
                  >
                    {video.platform === "instagram" ? "Instagram" : "TikTok"}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                    status.bg, status.border, status.color
                  )}>
                    {status.label}
                  </span>
                </div>
                {video.videoUrl && (
                  <Link
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <p className="text-sm text-white mb-3">@{video.creatorUsername || "Unknown"}</p>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                  <Eye className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{formatNumber(video.views)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                  <Heart className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{formatNumber(video.likes)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                  <MessageCircle className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{formatNumber(video.comments)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{video.engagementRate.toFixed(1)}%</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
