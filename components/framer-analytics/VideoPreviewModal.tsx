"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Play, Heart, MessageCircle, Eye, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "./constants/colors";
import type { Creator } from "./CreatorAvatarRow";

interface VideoPost {
  creatorId: string;
  videoId: string;
  postedAt: number;
  thumbnailUrl: string;
  videoUrl: string;
  platform: "instagram" | "tiktok";
  views: number;
  likes: number;
  comments: number;
  description: string;
}

interface VideoPreviewModalProps {
  post: VideoPost | null;
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * VideoPreviewModal - Modal to preview creator videos
 *
 * Features:
 * - Video thumbnail with play overlay
 * - Creator info with profile picture
 * - Video metrics (views, likes, comments)
 * - Link to open in platform
 */
export function VideoPreviewModal({
  post,
  creator,
  open,
  onOpenChange,
}: VideoPreviewModalProps) {
  if (!post || !creator) return null;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border-0 p-0 overflow-hidden"
        style={{
          backgroundColor: "rgb(18, 18, 18)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-3">
            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <div
                className="rounded-full p-0.5"
                style={{
                  background: `linear-gradient(135deg, ${creator.color}, ${creator.color}80)`,
                }}
              >
                <Avatar className="w-10 h-10 border-2 border-black">
                  <AvatarImage src={creator.profilePicture} alt={creator.name} />
                  <AvatarFallback style={{ backgroundColor: creator.color }}>
                    {creator.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: FRAMER_TEXT_COLORS.primary }}
                >
                  {creator.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: FRAMER_TEXT_COLORS.secondary }}
                >
                  @{creator.username} · {formatDate(post.postedAt)}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Video Thumbnail */}
          <div className="relative aspect-[9/16] max-h-[400px] rounded-lg overflow-hidden bg-black">
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: creator.color + "20" }}
              >
                <Play size={48} style={{ color: creator.color }} />
              </div>
            )}

            {/* Play Overlay */}
            <a
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: creator.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={28} className="text-white ml-1" fill="white" />
              </motion.div>
            </a>

            {/* Platform Badge */}
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: FRAMER_TEXT_COLORS.primary,
              }}
            >
              {post.platform === "tiktok" ? "TikTok" : "Instagram"}
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center justify-around py-3 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Eye size={16} style={{ color: FRAMER_TEXT_COLORS.secondary }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: FRAMER_TEXT_COLORS.primary }}
                >
                  {formatNumber(post.views)}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                Views
              </span>
            </div>

            <div
              className="w-px h-8"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Heart size={16} style={{ color: "#ef4444" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: FRAMER_TEXT_COLORS.primary }}
                >
                  {formatNumber(post.likes)}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                Likes
              </span>
            </div>

            <div
              className="w-px h-8"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <MessageCircle size={16} style={{ color: "#3b82f6" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: FRAMER_TEXT_COLORS.primary }}
                >
                  {formatNumber(post.comments)}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                Comments
              </span>
            </div>
          </div>

          {/* Description */}
          {post.description && (
            <p
              className="text-sm line-clamp-3"
              style={{ color: FRAMER_TEXT_COLORS.secondary }}
            >
              {post.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              asChild
              style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: FRAMER_TEXT_COLORS.primary,
              }}
            >
              <a href={post.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" />
                Open in {post.platform === "tiktok" ? "TikTok" : "Instagram"}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VideoPreviewModal;


