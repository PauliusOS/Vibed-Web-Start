"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { CREATOR_COLORS } from "../constants/colors";
import { VideoPreviewModal } from "../VideoPreviewModal";
import type { Creator } from "../CreatorAvatarRow";

// Sample creators
const SAMPLE_CREATORS = [
  {
    id: "creator_1",
    name: "Sarah Johnson",
    username: "sarahjcreates",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[0],
  },
  {
    id: "creator_2",
    name: "Mike Chen",
    username: "mikechenlife",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[1],
  },
  {
    id: "creator_3",
    name: "Emma Wilson",
    username: "emmawilson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[2],
  },
  {
    id: "creator_4",
    name: "Alex Rivera",
    username: "alexrivera_",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[3],
  },
  {
    id: "creator_5",
    name: "Olivia Martinez",
    username: "oliviamartinez",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    platform: "tiktok" as const,
    color: CREATOR_COLORS[4],
  },
  {
    id: "creator_6",
    name: "James Park",
    username: "jamespark_",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    platform: "instagram" as const,
    color: CREATOR_COLORS[5],
  },
];

// Seeded random for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

type SortMetric = "views" | "likes" | "comments" | "engagement";

// Fixed base timestamp for consistent dates
const FIXED_NOW = new Date("2024-12-13T00:00:00Z").getTime();

export function TopPerformingVideosDemo() {
  const [sortBy, setSortBy] = useState<SortMetric>("views");
  const [limit, setLimit] = useState<number>(10);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Generate sample video data
  const videosData = useMemo(() => {
    const videos: Array<{
      videoId: string;
      creatorId: string;
      creatorName: string;
      creatorUsername: string;
      creatorProfilePicture: string;
      creatorColor: string;
      platform: "instagram" | "tiktok";
      thumbnailUrl: string;
      videoUrl: string;
      views: number;
      likes: number;
      comments: number;
      engagement: number;
      engagementRate: number;
      postedAt: number;
      description: string;
    }> = [];

    SAMPLE_CREATORS.forEach((creator, creatorIndex) => {
      const postCount = 3;
      for (let p = 0; p < postCount; p++) {
        const seed = creatorIndex * 10 + p;
        const daysAgo = 3 + Math.floor(seededRandom(seed) * 25);
        const baseViews = 100000 + seededRandom(seed + 1) * 500000;
        const likes = Math.round(baseViews * (0.02 + seededRandom(seed + 2) * 0.08));
        const comments = Math.round(likes * (0.05 + seededRandom(seed + 3) * 0.15));
        
        videos.push({
          videoId: `video_${creator.id}_${p}`,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorUsername: creator.username,
          creatorProfilePicture: creator.profilePicture,
          creatorColor: creator.color,
          platform: creator.platform,
          thumbnailUrl: `https://picsum.photos/seed/${creatorIndex}${p}/400/600`,
          videoUrl: creator.platform === "tiktok"
            ? "https://www.tiktok.com/@tiktok/video/7000000000000000000"
            : "https://www.instagram.com/reel/ABC123/",
          views: Math.round(baseViews),
          likes,
          comments,
          engagement: likes + comments,
          engagementRate: ((likes + comments) / baseViews) * 100,
          postedAt: FIXED_NOW - daysAgo * 24 * 60 * 60 * 1000,
          description: `Amazing content from ${creator.name}! 🔥 #viral #fyp`,
        });
      }
    });

    // Sort based on selected metric
    videos.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "engagement":
          return b.engagement - a.engagement;
        default:
          return b.views - a.views;
      }
    });

    return videos.slice(0, limit);
  }, [sortBy, limit]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-3">
      {/* Compact Controls */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-[11px] text-white/40 mr-auto">{videosData.length} videos</span>
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortMetric)}
        >
          <SelectTrigger className="w-32 h-8 bg-white/[0.03] border-white/[0.08] text-white/70 text-[12px] hover:bg-white/[0.05] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
            <SelectItem value="views" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3 text-white/50" /> Views
              </div>
            </SelectItem>
            <SelectItem value="likes" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-white/50" /> Likes
              </div>
            </SelectItem>
            <SelectItem value="comments" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-white/50" /> Comments
              </div>
            </SelectItem>
            <SelectItem value="engagement" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-white/50" /> Engagement
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={limit.toString()}
          onValueChange={(v) => setLimit(parseInt(v))}
        >
          <SelectTrigger className="w-20 h-8 bg-white/[0.03] border-white/[0.08] text-white/70 text-[12px] hover:bg-white/[0.05] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
            <SelectItem value="5" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              Top 5
            </SelectItem>
            <SelectItem value="10" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              Top 10
            </SelectItem>
            <SelectItem value="20" className="text-white/80 text-[12px] focus:bg-white/[0.05] focus:text-white">
              Top 20
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {videosData.map((video, index) => (
          <motion.div
            key={video.videoId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.06)",
            }}
            whileHover={{
              boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 12px -2px rgba(59, 130, 246, 0.15)",
            }}
            transition={{ 
              duration: 0.25, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: index * 0.02,
            }}
            className="p-3 rounded-xl bg-white/[0.02] cursor-pointer group">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div 
                  className="relative w-28 h-40 rounded-lg overflow-hidden bg-white/[0.03] flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedVideoId(video.videoId);
                    setModalOpen(true);
                  }}
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 border border-white/[0.1] flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[11px] font-semibold text-white/90">
                      {index + 1}
                    </span>
                  </div>
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6 border border-white/[0.08]">
                      <AvatarImage
                        src={video.creatorProfilePicture}
                        alt={video.creatorName}
                      />
                      <AvatarFallback
                        className="text-[10px] bg-white/[0.05] text-white/60"
                      >
                        {video.creatorName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium text-white/90 truncate">
                      {video.creatorName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] border-white/[0.08] bg-white/[0.02] text-white/50 font-normal"
                    >
                      {video.platform}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-white/40 line-clamp-2 mb-3">
                    {video.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        sortBy === "views" 
                          ? "bg-cyan-500/10 border border-cyan-500/20" 
                          : "bg-white/[0.03] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] text-white/30">Views</span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "views" ? "text-cyan-400" : "text-white/90"
                        }`}
                      >
                        {formatNumber(video.views)}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        sortBy === "likes" 
                          ? "bg-cyan-500/10 border border-cyan-500/20" 
                          : "bg-white/[0.03] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Heart className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] text-white/30">Likes</span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "likes" ? "text-cyan-400" : "text-white/90"
                        }`}
                      >
                        {formatNumber(video.likes)}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        sortBy === "comments" 
                          ? "bg-cyan-500/10 border border-cyan-500/20" 
                          : "bg-white/[0.03] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <MessageCircle className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] text-white/30">
                          Comments
                        </span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "comments" ? "text-cyan-400" : "text-white/90"
                        }`}
                      >
                        {formatNumber(video.comments)}
                      </p>
                    </div>
                  </div>

                  {/* Posted Date & Engagement Rate */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-white/30">
                      Posted {formatDate(video.postedAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp
                        className={`w-3 h-3 ${
                          video.engagementRate >= 5
                            ? "text-emerald-400"
                            : "text-white/30"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          video.engagementRate >= 5
                            ? "text-emerald-400"
                            : "text-white/40"
                        }`}
                      >
                        {video.engagementRate.toFixed(2)}% engagement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        post={
          selectedVideoId
            ? (() => {
                const video = videosData.find((v) => v.videoId === selectedVideoId);
                if (!video) return null;
                return {
                  creatorId: video.creatorId,
                  videoId: video.videoId,
                  postedAt: video.postedAt,
                  thumbnailUrl: video.thumbnailUrl,
                  videoUrl: video.videoUrl,
                  platform: video.platform,
                  views: video.views,
                  likes: video.likes,
                  comments: video.comments,
                  description: video.description,
                };
              })()
            : null
        }
        creator={
          selectedVideoId
            ? (() => {
                const video = videosData.find((v) => v.videoId === selectedVideoId);
                if (!video) return null;
                const creator = SAMPLE_CREATORS.find((c) => c.id === video.creatorId);
                if (!creator) return null;
                return {
                  id: creator.id,
                  name: creator.name,
                  username: creator.username,
                  profilePicture: creator.profilePicture,
                  platform: creator.platform,
                  color: creator.color,
                } as Creator;
              })()
            : null
        }
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
