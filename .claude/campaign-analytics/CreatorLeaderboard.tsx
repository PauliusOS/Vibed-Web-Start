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
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Heart,
  MessageCircle,
  Video,
  Crown,
} from "lucide-react";
import { motion } from "motion/react";

// Platform icons
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

// Blue gradient scale - darkest blue = best performance
const PERFORMANCE_BLUES = [
  '#2563EB', // #1 - Dark blue (best)
  '#3B82F6', // #2 - Blue
  '#38BDF8', // #3 - Sky blue
  '#60A5FA', // #4 - Light blue
  '#93C5FD', // #5 - Lighter blue
  '#BFDBFE', // #6+ - Lightest blue
];

const getPerformanceBlue = (rank: number): string => {
  const index = Math.min(rank - 1, PERFORMANCE_BLUES.length - 1);
  return PERFORMANCE_BLUES[Math.max(0, index)];
};

interface CreatorLeaderboardProps {
  campaignId: Id<"campaigns">;
}

type SortMetric = "views" | "engagement" | "engagementRate" | "videos";

export function CreatorLeaderboard({ campaignId }: CreatorLeaderboardProps) {
  const [sortBy, setSortBy] = useState<SortMetric>("views");
  const [timeRange, setTimeRange] = useState<number>(30);

  // Fetch creator analytics
  const creatorAnalytics = useQuery(api.analytics.getCampaignCreatorAnalytics, {
    campaignId,
    days: timeRange,
  });

  const isLoading = creatorAnalytics === undefined;

  // Aggregate creator data for leaderboard
  const leaderboardData = useMemo(() => {
    if (!creatorAnalytics) return [];

    const creatorStats = new Map<
      string,
      {
        id: string;
        name: string;
        username: string;
        profilePicture: string;
        platform: string;
        color: string;
        totalViews: number;
        totalEngagement: number;
        videoCount: number;
        engagementRate: number;
      }
    >();

    // Initialize with creator info
    creatorAnalytics.creators.forEach((creator) => {
      creatorStats.set(creator.id, {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        profilePicture: creator.profilePicture,
        platform: creator.platform,
        color: creator.color,
        totalViews: 0,
        totalEngagement: 0,
        videoCount: 0,
        engagementRate: 0,
      });
    });

    // Aggregate metrics
    creatorAnalytics.creatorMetrics.forEach((metric) => {
      const stats = creatorStats.get(metric.creatorId);
      if (stats) {
        stats.totalViews += metric.views;
        stats.totalEngagement += metric.engagement;
      }
    });

    // Count videos per creator
    creatorAnalytics.posts.forEach((post) => {
      const stats = creatorStats.get(post.creatorId);
      if (stats) {
        stats.videoCount += 1;
      }
    });

    // Calculate engagement rates
    creatorStats.forEach((stats) => {
      if (stats.totalViews > 0) {
        stats.engagementRate = (stats.totalEngagement / stats.totalViews) * 100;
      }
    });

    // Convert to array and sort
    const sortedData = Array.from(creatorStats.values()).sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.totalViews - a.totalViews;
        case "engagement":
          return b.totalEngagement - a.totalEngagement;
        case "engagementRate":
          return b.engagementRate - a.engagementRate;
        case "videos":
          return b.videoCount - a.videoCount;
        default:
          return b.totalViews - a.totalViews;
      }
    });

    return sortedData;
  }, [creatorAnalytics, sortBy]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-[13px] text-white/40">
            {rank}
          </span>
        );
    }
  };

  const getRankBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20";
      case 2:
        return "bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/20";
      case 3:
        return "bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/20";
      default:
        return "bg-white/[0.02] border-white/[0.06]";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 bg-white/10" />
            <Skeleton className="h-9 w-32 bg-white/10" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 bg-white/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <GlassPanel className="p-12 text-center">
        <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Creator Data Yet
        </h3>
        <p className="text-[13px] text-white/50">
          Creator performance data will appear here once videos start tracking.
        </p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">
            Creator Leaderboard
          </h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            {leaderboardData.length} creators
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={timeRange.toString()}
            onValueChange={(v) => setTimeRange(parseInt(v))}
          >
            <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="7" className="text-white text-[13px]">
                Last 7 days
              </SelectItem>
              <SelectItem value="14" className="text-white text-[13px]">
                Last 14 days
              </SelectItem>
              <SelectItem value="30" className="text-white text-[13px]">
                Last 30 days
              </SelectItem>
              <SelectItem value="90" className="text-white text-[13px]">
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortMetric)}
          >
            <SelectTrigger className="w-40 h-9 bg-white/5 border-white/10 text-white text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="views" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Views
                </div>
              </SelectItem>
              <SelectItem value="engagement" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3" /> Engagement
                </div>
              </SelectItem>
              <SelectItem
                value="engagementRate"
                className="text-white text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Eng. Rate
                </div>
              </SelectItem>
              <SelectItem value="videos" className="text-white text-[13px]">
                <div className="flex items-center gap-2">
                  <Video className="w-3 h-3" /> Videos
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer ${getRankBgClass(index + 1)}`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-black" style={{ ringColor: getPerformanceBlue(index + 1) }}>
                  <AvatarImage src={creator.profilePicture} alt={creator.name} />
                  <AvatarFallback
                    className="text-sm font-medium"
                    style={{ backgroundColor: getPerformanceBlue(index + 1) }}
                  >
                    {creator.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white truncate">
                    {creator.name}
                  </p>
                  <p className="text-[12px] text-white/50 truncate">
                    @{creator.username}
                  </p>
                </div>
                {creator.platform === "instagram" ? (
                  <InstagramIcon className="ml-2 h-4 w-4 text-white/50" />
                ) : (
                  <TikTokIcon className="ml-2 h-4 w-4 text-white/50" />
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center min-w-[80px]">
                  <p className="text-[11px] text-white/40 mb-1">Views</p>
                  <p
                    className={`text-[15px] font-semibold ${
                      sortBy === "views" ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {formatNumber(creator.totalViews)}
                  </p>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-[11px] text-white/40 mb-1">Engagement</p>
                  <p
                    className={`text-[15px] font-semibold ${
                      sortBy === "engagement" ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {formatNumber(creator.totalEngagement)}
                  </p>
                </div>
                <div className="text-center min-w-[70px]">
                  <p className="text-[11px] text-white/40 mb-1">Eng. Rate</p>
                  <p
                    className={`text-[15px] font-semibold ${
                      sortBy === "engagementRate"
                        ? "text-blue-400"
                        : creator.engagementRate >= 5
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >
                    {creator.engagementRate.toFixed(2)}%
                  </p>
                </div>
                <div className="text-center min-w-[60px]">
                  <p className="text-[11px] text-white/40 mb-1">Videos</p>
                  <p
                    className={`text-[15px] font-semibold ${
                      sortBy === "videos" ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {creator.videoCount}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-32">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getPerformanceBlue(index + 1) }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        sortBy === "views"
                          ? (creator.totalViews /
                              Math.max(...leaderboardData.map((c) => c.totalViews))) *
                            100
                          : sortBy === "engagement"
                          ? (creator.totalEngagement /
                              Math.max(
                                ...leaderboardData.map((c) => c.totalEngagement)
                              )) *
                            100
                          : sortBy === "engagementRate"
                          ? (creator.engagementRate /
                              Math.max(
                                ...leaderboardData.map((c) => c.engagementRate)
                              )) *
                            100
                          : (creator.videoCount /
                              Math.max(
                                ...leaderboardData.map((c) => c.videoCount)
                              )) *
                            100
                      }%`,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
