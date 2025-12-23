"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Eye,
  TrendingUp,
  CheckCircle,
  Instagram,
} from "lucide-react";

interface CreatorProfileCardProps {
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  followerCount: number;
  medianViews?: number;
  engagementRate?: number;
  platform?: "instagram" | "tiktok";
  isVerified?: boolean;
  totalViews?: number;
  videoCount?: number;
  campaignMedian?: number;
  onClick?: () => void;
  selected?: boolean;
}

export function CreatorProfileCard({
  username,
  displayName,
  profilePictureUrl,
  followerCount,
  medianViews,
  engagementRate,
  platform,
  isVerified,
  totalViews,
  videoCount,
  campaignMedian,
  onClick,
  selected,
}: CreatorProfileCardProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const PlatformIcon = platform === "instagram" ? Instagram : TikTokIcon;

  // Calculate performance vs campaign median
  const performanceVsCampaign =
    campaignMedian && medianViews
      ? ((medianViews - campaignMedian) / campaignMedian) * 100
      : null;

  return (
    <Card
      className={`bg-white/[0.02] border transition-all cursor-pointer ${
        selected
          ? "border-emerald-500/50 bg-emerald-500/5"
          : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="w-14 h-14 border-2 border-white/10">
              <AvatarImage src={profilePictureUrl} alt={username} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-lg">
                {username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            {platform && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black flex items-center justify-center border border-white/20">
                <PlatformIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Creator Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium truncate">
                {displayName || username}
              </span>
              {isVerified && (
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-white/50 truncate">@{username}</p>

            {/* Follower Count */}
            <div className="flex items-center gap-1 mt-2">
              <Users className="w-3.5 h-3.5 text-white/40" />
              <span className="text-sm text-white/70">
                {formatValue(followerCount)} followers
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
          {/* Median Views */}
          <div className="text-center">
            <p className="text-xs text-white/40 mb-1">Median Views</p>
            <p className="text-sm font-semibold text-emerald-400">
              {medianViews ? formatValue(medianViews) : "—"}
            </p>
          </div>

          {/* Engagement Rate */}
          <div className="text-center">
            <p className="text-xs text-white/40 mb-1">Engagement</p>
            <p className="text-sm font-semibold text-white">
              {engagementRate ? `${engagementRate.toFixed(1)}%` : "—"}
            </p>
          </div>

          {/* Total Views or Video Count */}
          <div className="text-center">
            <p className="text-xs text-white/40 mb-1">
              {totalViews !== undefined ? "Total Views" : "Videos"}
            </p>
            <p className="text-sm font-semibold text-white">
              {totalViews !== undefined
                ? formatValue(totalViews)
                : videoCount !== undefined
                  ? videoCount
                  : "—"}
            </p>
          </div>
        </div>

        {/* Campaign Performance Comparison */}
        {performanceVsCampaign !== null && (
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">vs Campaign Median</span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  performanceVsCampaign >= 0
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 mr-1 ${
                    performanceVsCampaign < 0 ? "rotate-180" : ""
                  }`}
                />
                {performanceVsCampaign >= 0 ? "+" : ""}
                {performanceVsCampaign.toFixed(0)}%
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// Grid of creator cards
interface CreatorProfileGridProps {
  creators: Array<{
    userId: string;
    username: string;
    displayName?: string;
    profilePictureUrl?: string;
    followerCount: number;
    medianViews7d?: number;
    engagementRate?: number;
    platform?: "instagram" | "tiktok";
    isVerified?: boolean;
  }>;
  campaignMedian?: number;
  selectedId?: string;
  onSelect?: (creatorId: string) => void;
}

export function CreatorProfileGrid({
  creators,
  campaignMedian,
  selectedId,
  onSelect,
}: CreatorProfileGridProps) {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto text-white/20 mb-4" />
        <p className="text-white/50">No creators found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {creators.map((creator) => (
        <CreatorProfileCard
          key={creator.userId}
          username={creator.username}
          displayName={creator.displayName}
          profilePictureUrl={creator.profilePictureUrl}
          followerCount={creator.followerCount}
          medianViews={creator.medianViews7d}
          engagementRate={creator.engagementRate}
          platform={creator.platform}
          isVerified={creator.isVerified}
          campaignMedian={campaignMedian}
          selected={selectedId === creator.userId}
          onClick={() => onSelect?.(creator.userId)}
        />
      ))}
    </div>
  );
}

// Compact horizontal card for lists
export function CreatorProfileRow({
  username,
  displayName,
  profilePictureUrl,
  followerCount,
  medianViews,
  platform,
  isVerified,
  rank,
  totalViews,
}: CreatorProfileCardProps & { rank?: number }) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-colors">
      {rank !== undefined && (
        <div className="w-6 text-center">
          <span
            className={`text-sm font-bold ${
              rank === 1
                ? "text-amber-400"
                : rank === 2
                  ? "text-slate-300"
                  : rank === 3
                    ? "text-amber-600"
                    : "text-white/40"
            }`}
          >
            #{rank}
          </span>
        </div>
      )}

      <Avatar className="w-10 h-10 border border-white/10">
        <AvatarImage src={profilePictureUrl} alt={username} />
        <AvatarFallback className="bg-purple-500/20 text-purple-400">
          {username?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium truncate">
            {displayName || username}
          </span>
          {isVerified && (
            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
          )}
        </div>
        <p className="text-xs text-white/50 truncate">
          {formatValue(followerCount)} followers
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-emerald-400">
          {totalViews ? formatValue(totalViews) : medianViews ? formatValue(medianViews) : "—"}
        </p>
        <p className="text-xs text-white/40">
          {totalViews ? "total views" : "median views"}
        </p>
      </div>
    </div>
  );
}

















