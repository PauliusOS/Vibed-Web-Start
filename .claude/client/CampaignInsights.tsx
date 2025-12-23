"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignPerformanceCard } from "@/components/analytics/CampaignPerformanceCard";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { VideoPerformanceGrid } from "@/components/analytics/VideoPerformanceGrid";

interface CampaignInsightsProps {
  analytics: {
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
  } | null;
  trends?: Array<{
    timestamp: number;
    views: number;
    engagement: number;
    engagementRate: number;
  }>;
  videoPerformance?: {
    topPerformers: Array<{
      videoId: string;
      creatorUsername: string;
      platform: "instagram" | "tiktok";
      videoUrl?: string;
      views: number;
      engagement: number;
      engagementRate: number;
    }>;
    bottomPerformers: Array<{
      videoId: string;
      creatorUsername: string;
      platform: "instagram" | "tiktok";
      videoUrl?: string;
      views: number;
      engagement: number;
      engagementRate: number;
    }>;
  };
}

export function CampaignInsights({
  analytics,
  trends,
  videoPerformance,
}: CampaignInsightsProps) {
  if (!analytics) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No analytics data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <CampaignPerformanceCard
        campaign={analytics.campaign}
        totals={analytics.totals}
        performanceTrend={analytics.performanceTrend}
      />

      {/* Performance Trends */}
      {trends && trends.length > 0 && (
        <EngagementChart
          data={trends}
          title="Campaign Performance (Last 30 Days)"
          showEngagementRate={true}
        />
      )}

      {/* Video Performance */}
      {videoPerformance && (
        <VideoPerformanceGrid
          topPerformers={videoPerformance.topPerformers}
          bottomPerformers={videoPerformance.bottomPerformers}
          title="Video Performance"
        />
      )}
    </div>
  );
}
