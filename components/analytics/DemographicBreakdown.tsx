"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Instagram, Music2 } from "lucide-react";

interface DemographicInsights {
  totalReach: number;
  creatorCount: number;
  platformDistribution: {
    instagram: number;
    tiktok: number;
  };
}

interface DemographicBreakdownProps {
  insights: DemographicInsights;
  title?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function DemographicBreakdown({
  insights,
  title = "Audience Insights",
}: DemographicBreakdownProps) {
  const total = insights.platformDistribution.instagram + insights.platformDistribution.tiktok;
  const instagramPercent = total > 0 ? (insights.platformDistribution.instagram / total) * 100 : 0;
  const tiktokPercent = total > 0 ? (insights.platformDistribution.tiktok / total) * 100 : 0;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Reach */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Potential Reach</p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(insights.totalReach)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Creators</p>
            <p className="text-lg font-semibold text-foreground">{insights.creatorCount}</p>
          </div>
        </div>

        {/* Platform Distribution */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Platform Distribution</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm text-foreground">Instagram</span>
                </div>
                <Badge variant="outline">{insights.platformDistribution.instagram} creators</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all"
                  style={{ width: `${instagramPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {instagramPercent.toFixed(1)}%
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-foreground">TikTok</span>
                </div>
                <Badge variant="outline">{insights.platformDistribution.tiktok} creators</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                  style={{ width: `${tiktokPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {tiktokPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Future Demographics Placeholder */}
        <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Enhanced Demographics Coming Soon
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Age ranges, gender split, geographic distribution, and more audience insights will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
