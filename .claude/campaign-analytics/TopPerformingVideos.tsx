"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  Play,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Flame,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

interface TopPerformingVideosProps {
  campaignId: Id<"campaigns">;
}

type SortMetric = "views" | "likes" | "comments" | "engagement";

export function TopPerformingVideos({ campaignId }: TopPerformingVideosProps) {
  const [sortBy, setSortBy] = useState<SortMetric>("views");
  const [limit, setLimit] = useState<number>(10);

  // Fetch creator analytics (includes posts)
  const creatorAnalytics = useQuery(api.analytics.getCampaignCreatorAnalytics, {
    campaignId,
    days: 90,
  });

  const isLoading = creatorAnalytics === undefined;

  // Build video data with creator info
  const videosData = useMemo(() => {
    if (!creatorAnalytics) return [];

    const creatorMap = new Map(
      creatorAnalytics.creators.map((c) => [c.id, c])
    );

    const videos = creatorAnalytics.posts.map((post) => {
      const creator = creatorMap.get(post.creatorId);
      return {
        ...post,
        creatorName: creator?.name || "Unknown",
        creatorUsername: creator?.username || "",
        creatorProfilePicture: creator?.profilePicture || "",
        creatorColor: creator?.color || "#3B82F6",
        engagement: post.likes + post.comments,
        engagementRate:
          post.views > 0 ? ((post.likes + post.comments) / post.views) * 100 : 0,
      };
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
  }, [creatorAnalytics, sortBy, limit]);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 bg-white/10" />
            <Skeleton className="h-9 w-24 bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (videosData.length === 0) {
    return (
      <GlassPanel className="p-12 text-center">
        <Video className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Videos Yet
        </h3>
        <p className="text-[13px] text-white/50">
          Video performance data will appear here once videos are added to the
          campaign.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-white">
            Top Performing Videos
          </h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            {creatorAnalytics?.posts.length || 0} total
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortMetric)}
          >
            <SelectTrigger className="w-36 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="views" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Most Views
                </div>
              </SelectItem>
              <SelectItem value="likes" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3" /> Most Likes
                </div>
              </SelectItem>
              <SelectItem value="comments" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3 h-3" /> Most Comments
                </div>
              </SelectItem>
              <SelectItem value="engagement" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Highest Engagement
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={limit.toString()}
            onValueChange={(v) => setLimit(parseInt(v))}
          >
            <SelectTrigger className="w-24 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="5" className="text-white text-[13px]">
                Top 5
              </SelectItem>
              <SelectItem value="10" className="text-white text-[13px]">
                Top 10
              </SelectItem>
              <SelectItem value="20" className="text-white text-[13px]">
                Top 20
              </SelectItem>
              <SelectItem value="50" className="text-white text-[13px]">
                Top 50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videosData.map((video, index) => (
          <motion.div
            key={video.videoId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassPanel className="p-4 hover:border-white/20 transition-all group">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-28 h-40 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={video.creatorProfilePicture}
                        alt={video.creatorName}
                      />
                      <AvatarFallback
                        className="text-[10px]"
                        style={{ backgroundColor: video.creatorColor }}
                      >
                        {video.creatorName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium text-white truncate">
                      {video.creatorName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] ${
                        video.platform === "instagram"
                          ? "border-pink-500/30 text-pink-400"
                          : "border-white/20 text-white/60"
                      }`}
                    >
                      {video.platform}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-white/50 line-clamp-2 mb-3">
                    {video.description || "No description"}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mt-auto">
                    <div
                      className={`p-2 rounded-lg ${
                        sortBy === "views" ? "bg-blue-600/20" : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3 text-white/40" />
                        <span className="text-[10px] text-white/40">Views</span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "views" ? "text-blue-500" : "text-white"
                        }`}
                      >
                        {formatNumber(video.views)}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        sortBy === "likes" ? "bg-blue-400/20" : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Heart className="w-3 h-3 text-white/40" />
                        <span className="text-[10px] text-white/40">Likes</span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "likes" ? "text-blue-400" : "text-white"
                        }`}
                      >
                        {formatNumber(video.likes)}
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        sortBy === "comments" ? "bg-blue-300/20" : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <MessageCircle className="w-3 h-3 text-white/40" />
                        <span className="text-[10px] text-white/40">
                          Comments
                        </span>
                      </div>
                      <p
                        className={`text-[14px] font-semibold ${
                          sortBy === "comments" ? "text-blue-300" : "text-white"
                        }`}
                      >
                        {formatNumber(video.comments)}
                      </p>
                    </div>
                  </div>

                  {/* Posted Date & Engagement Rate */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-white/40">
                      Posted {formatDate(video.postedAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp
                        className={`w-3 h-3 ${
                          video.engagementRate >= 5
                            ? "text-emerald-400"
                            : "text-white/40"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          video.engagementRate >= 5
                            ? "text-emerald-400"
                            : "text-white/50"
                        }`}
                      >
                        {video.engagementRate.toFixed(2)}% engagement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
