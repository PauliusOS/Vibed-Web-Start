"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, TrendingUp, ExternalLink, Trophy, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPerformance {
  videoId: string;
  creatorUsername: string;
  platform: "instagram" | "tiktok";
  videoUrl?: string;
  views: number;
  engagement: number;
  engagementRate: number;
}

interface VideoPerformanceGridProps {
  topPerformers: VideoPerformance[];
  bottomPerformers: VideoPerformance[];
  title?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

const platformColors = {
  instagram: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  tiktok: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

function VideoCard({ video, rank, isTop }: { video: VideoPerformance; rank: number; isTop: boolean }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
              isTop
                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isTop && rank === 1 && <Trophy className="h-4 w-4" />}
            {(!isTop || rank !== 1) && `#${rank}`}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{video.creatorUsername}</p>
            <Badge variant="outline" className={cn("text-xs mt-1", platformColors[video.platform])}>
              {video.platform}
            </Badge>
          </div>
        </div>
        {video.videoUrl && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1 text-sm font-medium text-foreground mb-0.5">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            {formatNumber(video.views)}
          </div>
          <p className="text-xs text-muted-foreground">views</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-sm font-medium text-foreground mb-0.5">
            <Heart className="h-3.5 w-3.5 text-muted-foreground" />
            {formatNumber(video.engagement)}
          </div>
          <p className="text-xs text-muted-foreground">engagement</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-sm font-medium text-foreground mb-0.5">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            {video.engagementRate.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">rate</p>
        </div>
      </div>
    </div>
  );
}

export function VideoPerformanceGrid({
  topPerformers,
  bottomPerformers,
  title = "Video Performance",
}: VideoPerformanceGridProps) {
  if (topPerformers.length === 0 && bottomPerformers.length === 0) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No video performance data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-lg">Top Performing Videos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topPerformers.map((video, index) => (
                <VideoCard key={video.videoId} video={video} rank={index + 1} isTop={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Performers */}
      {bottomPerformers.length > 0 && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-lg">Videos Needing Attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bottomPerformers.map((video, index) => (
                <VideoCard
                  key={video.videoId}
                  video={video}
                  rank={index + 1}
                  isTop={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
