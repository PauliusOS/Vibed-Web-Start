import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface VideoCardProps {
  videoId: string;
  videoUrl: string;
  platform: "instagram" | "tiktok";
  creatorName?: string;
  status: "pending_approval" | "approved" | "rejected" | "tracking";
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagementRate?: number;
  thumbnailUrl?: string;
}

const statusConfig = {
  pending_approval: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500",
  },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-500" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-500" },
  tracking: { label: "Tracking", className: "bg-blue-500/10 text-blue-500" },
};

const platformConfig = {
  instagram: { label: "Instagram", className: "bg-purple-500/10 text-purple-500" },
  tiktok: { label: "TikTok", className: "bg-cyan-500/10 text-cyan-500" },
};

export function VideoCard({
  videoUrl,
  platform,
  creatorName,
  status,
  views = 0,
  likes = 0,
  comments = 0,
  shares = 0,
  engagementRate = 0,
  thumbnailUrl,
}: VideoCardProps) {
  const statusStyle = statusConfig[status];
  const platformStyle = platformConfig[platform];

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-all overflow-hidden">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-black/50">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt="Video thumbnail"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            <span className="text-4xl">
              {platform === "instagram" ? "📸" : "🎵"}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={cn("text-xs", platformStyle.className)}>
            {platformStyle.label}
          </Badge>
          <Badge className={cn("text-xs", statusStyle.className)}>
            {statusStyle.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Creator Name */}
        {creatorName && (
          <div className="text-sm text-white/80 font-medium truncate">
            @{creatorName}
          </div>
        )}

        {/* Metrics Grid */}
        {status === "tracking" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-white/60" />
              <div className="flex flex-col">
                <span className="text-xs text-white/60">Views</span>
                <span className="text-sm font-bold text-white font-mono">
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-white/60" />
              <div className="flex flex-col">
                <span className="text-xs text-white/60">Likes</span>
                <span className="text-sm font-bold text-white font-mono">
                  {likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-white/60" />
              <div className="flex flex-col">
                <span className="text-xs text-white/60">Comments</span>
                <span className="text-sm font-bold text-white font-mono">
                  {comments >= 1000
                    ? `${(comments / 1000).toFixed(1)}K`
                    : comments}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-white/60" />
              <div className="flex flex-col">
                <span className="text-xs text-white/60">Shares</span>
                <span className="text-sm font-bold text-white font-mono">
                  {shares >= 1000 ? `${(shares / 1000).toFixed(1)}K` : shares}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Rate */}
        {status === "tracking" && engagementRate > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Engagement Rate</span>
              <span className="text-sm font-bold text-green-500 font-mono">
                {engagementRate.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        {/* Video URL Link */}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/40 hover:text-white/60 transition-colors truncate block"
        >
          View on {platformStyle.label}
        </a>
      </CardContent>
    </Card>
  );
}
