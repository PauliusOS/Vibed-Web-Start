"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Eye, Heart, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignPerformanceCardProps {
  campaign: {
    name: string;
    status: "draft" | "active" | "paused" | "completed" | "archived";
  };
  totals: {
    videos: number;
    views: number;
    engagement: number;
    avgEngagementRate: number;
  };
  performanceTrend: "up" | "down" | "stable";
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  active: { label: "Active", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
};

const trendConfig = {
  up: { icon: TrendingUp, color: "text-green-600 dark:text-green-400", label: "Trending up" },
  down: { icon: TrendingDown, color: "text-red-600 dark:text-red-400", label: "Trending down" },
  stable: { icon: Minus, color: "text-muted-foreground", label: "Stable" },
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function CampaignPerformanceCard({
  campaign,
  totals,
  performanceTrend,
}: CampaignPerformanceCardProps) {
  const statusStyle = statusConfig[campaign.status];
  const trendStyle = trendConfig[performanceTrend];
  const TrendIcon = trendStyle.icon;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("text-xs", statusStyle.className)}>
                {statusStyle.label}
              </Badge>
              <div className={cn("flex items-center gap-1 text-xs", trendStyle.color)}>
                <TrendIcon className="h-3 w-3" />
                <span>{trendStyle.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totals.videos}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(totals.views)}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(totals.engagement)}</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totals.avgEngagementRate.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Avg Rate</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
