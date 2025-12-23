"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Eye, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PerformanceHighlightsProps {
  highlights: {
    totalViews: number;
    totalEngagement: number;
    topCreator?: {
      username: string;
      views: number;
    };
    bestVideo?: {
      creatorUsername: string;
      views: number;
      engagementRate: number;
    };
    trend: "up" | "down" | "stable";
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function PerformanceHighlights({ highlights }: PerformanceHighlightsProps) {
  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    stable: "text-muted-foreground",
  };

  const trendLabels = {
    up: "Performing above average",
    down: "Needs attention",
    stable: "Steady performance",
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Campaign Highlights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Performance */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className={`flex items-center gap-2 mb-3 ${trendColors[highlights.trend]}`}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{trendLabels[highlights.trend]}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">
                  {formatNumber(highlights.totalViews)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">
                  {formatNumber(highlights.totalEngagement)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Engagement</p>
            </div>
          </div>
        </div>

        {/* Top Performer */}
        {highlights.topCreator && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-foreground">Top Creator</span>
            </div>
            <p className="text-lg font-bold text-foreground mb-1">
              {highlights.topCreator.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(highlights.topCreator.views)} views
            </p>
          </div>
        )}

        {/* Best Video */}
        {highlights.bestVideo && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">Best Performing Video</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              by {highlights.bestVideo.creatorUsername}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-xs">
                {formatNumber(highlights.bestVideo.views)} views
              </Badge>
              <Badge variant="outline" className="text-xs">
                {highlights.bestVideo.engagementRate.toFixed(2)}% engagement
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
