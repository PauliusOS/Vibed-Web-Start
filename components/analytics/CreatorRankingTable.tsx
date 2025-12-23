"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorRanking {
  creatorId: string;
  username: string;
  platform?: "instagram" | "tiktok";
  videoCount: number;
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  campaignCount: number;
}

interface CreatorRankingTableProps {
  rankings: CreatorRanking[];
  title?: string;
  showCampaignCount?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function CreatorRankingTable({
  rankings,
  title = "Top Creators",
  showCampaignCount = true,
}: CreatorRankingTableProps) {
  if (rankings.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No creator data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((creator, index) => (
            <div
              key={creator.creatorId}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{creator.username}</p>
                    {creator.platform && (
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {creator.platform}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Video className="h-3.5 w-3.5 text-muted-foreground" />
                    {creator.videoCount}
                  </div>
                  <p className="text-xs text-muted-foreground">videos</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatNumber(creator.totalViews)}
                  </div>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    {creator.avgEngagementRate.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">avg rate</p>
                </div>

                {showCampaignCount && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{creator.campaignCount}</p>
                    <p className="text-xs text-muted-foreground">campaigns</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
