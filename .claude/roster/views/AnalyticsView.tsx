"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Video, Users, Award } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface AnalyticsViewProps {
  rosterId: Id<"creatorRosters"> | "all";
  organizationId: Id<"organizations">;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function AnalyticsView({ rosterId, organizationId }: AnalyticsViewProps) {
  // Get roster analytics
  const analytics =
    rosterId !== "all"
      ? useQuery(api.rosterAnalytics.getRosterAnalytics, { rosterId })
      : null;

  // Get top performers
  const topPerformers =
    rosterId !== "all"
      ? useQuery(api.rosterAnalytics.getTopPerformers, { rosterId, limit: 5 })
      : null;

  const isLoading = analytics === undefined || topPerformers === undefined;

  if (rosterId === "all") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-white/60">
            Select a specific roster to view analytics
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  const metrics = analytics?.roster?.performanceMetrics;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Total Views</p>
              <Eye className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics ? formatNumber(metrics.totalViews) : "0"}
            </p>
            <p className="text-xs text-white/40 mt-1">Across all creators</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Avg Engagement</p>
              <TrendingUp className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics ? metrics.avgEngagement.toFixed(1) + "%" : "0%"}
            </p>
            <p className="text-xs text-white/40 mt-1">Roster average</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Total Videos</p>
              <Video className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-bold text-white">
              {metrics?.totalVideos || 0}
            </p>
            <p className="text-xs text-white/40 mt-1">Content pieces</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50 font-medium">Creators</p>
              <Users className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-2xl font-bold text-white">
              {analytics?.creators?.length || 0}
            </p>
            <p className="text-xs text-white/40 mt-1">In roster</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Leaderboard */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!topPerformers || topPerformers.length === 0 ? (
            <p className="text-white/50 text-center py-8">
              No performance data available yet
            </p>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((creator, index) => (
                <div
                  key={creator.creatorId}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10 ring-2 ring-white/10">
                    <AvatarImage src={creator.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
                      {creator.displayName?.[0] || creator.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {creator.displayName || creator.username}
                    </h4>
                    <p className="text-xs text-white/50 truncate">@{creator.username}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {formatNumber(creator.totalViews)}
                      </div>
                      <div className="text-white/40 text-xs">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">{creator.totalVideos}</div>
                      <div className="text-white/40 text-xs">Videos</div>
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs hidden sm:inline-flex",
                      creator.platform === "tiktok"
                        ? "border-white/20 text-white/70"
                        : "border-pink-500/30 text-pink-400"
                    )}
                  >
                    {creator.platform}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Creators Performance */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Creator Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {!analytics?.creators || analytics.creators.length === 0 ? (
            <p className="text-white/50 text-center py-8">No creators in this roster</p>
          ) : (
            <div className="space-y-3">
              {analytics.creators.map((creator) => (
                <div
                  key={creator!.creatorId}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <Avatar className="h-12 w-12 ring-2 ring-white/10">
                    <AvatarImage src={creator!.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {creator!.displayName?.[0] || creator!.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {creator!.displayName || creator!.username}
                    </h4>
                    <p className="text-xs text-white/50">
                      {formatNumber(creator!.followerCount)} followers
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {formatNumber(creator!.totalViews)}
                      </div>
                      <div className="text-white/40 text-xs">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {creator!.avgEngagement.toFixed(1)}%
                      </div>
                      <div className="text-white/40 text-xs">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {creator!.totalVideos}
                      </div>
                      <div className="text-white/40 text-xs">Videos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
