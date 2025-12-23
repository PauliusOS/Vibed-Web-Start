"use client";

import { motion } from "motion/react";
import { Video, ExternalLink, Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface VideoPreview {
  _id: string;
  url?: string;
  platform: string;
  creatorId?: string;
  views?: number;
  likes?: number;
  comments?: number;
  engagementRate?: number;
}

interface RecentVideosPreviewProps {
  videos: VideoPreview[];
}

export function RecentVideosPreview({ videos }: RecentVideosPreviewProps) {
  const recentVideos = videos.slice(0, 5);

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-12 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center"
      >
        <Video className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
        <p className="text-sm text-white/50">Videos will appear here once creators submit content</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Videos</h2>
        <Link
          href="/client/videos"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentVideos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
          >
            {/* Hover glow */}
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

            <div className="relative">
              {/* Platform Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {video.platform}
                </span>
                {video.url && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Creator */}
              <p className="text-sm text-white/70 mb-3">@{video.creatorId}</p>

              {/* Metrics */}
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{video.views?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{video.likes?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{video.comments?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
