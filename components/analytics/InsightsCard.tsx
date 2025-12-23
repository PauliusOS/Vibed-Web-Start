"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, DollarSign, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  suffix?: string;
  color?: string;
}

interface InsightsCardProps {
  title?: string;
  dateRange?: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    cpm: number;
    roster: number;
    videos: number;
  };
  trend?: {
    views?: { value: number; direction: "up" | "down" };
    engagement?: { value: number; direction: "up" | "down" };
  };
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function calculateEngagement(likes: number, comments: number, views: number): number {
  if (views === 0) return 0;
  return ((likes + comments) / views) * 100;
}

export function InsightsCard({ 
  title = "Insights", 
  dateRange = "Last 30 days",
  metrics,
  trend,
  className 
}: InsightsCardProps) {
  const engagementRate = calculateEngagement(metrics.likes, metrics.comments, metrics.views);

  const metricItems: Metric[] = [
    {
      label: "Views",
      value: formatNumber(metrics.views),
      icon: <Eye className="w-4 h-4" />,
      trend: trend?.views,
      color: "text-blue-400",
    },
    {
      label: "Likes",
      value: formatNumber(metrics.likes),
      icon: <Heart className="w-4 h-4" />,
      color: "text-pink-400",
    },
    {
      label: "Comments",
      value: formatNumber(metrics.comments),
      icon: <MessageCircle className="w-4 h-4" />,
      color: "text-cyan-400",
    },
    {
      label: "CPM",
      value: `$${metrics.cpm.toFixed(2)}`,
      icon: <DollarSign className="w-4 h-4" />,
      color: "text-green-400",
    },
    {
      label: "Roster",
      value: metrics.roster,
      icon: <Users className="w-4 h-4" />,
      color: "text-purple-400",
    },
    {
      label: "Videos",
      value: metrics.videos,
      icon: <Video className="w-4 h-4" />,
      color: "text-orange-400",
    },
  ];

  return (
    <Card 
      className={cn(
        "relative border backdrop-blur-xl",
        "bg-black/70 border-[rgba(0,110,255,0.15)]",
        "shadow-[0_0_20px_rgba(25,125,255,0.08),0_0_40px_rgba(25,125,255,0.04)]",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg font-semibold">{title}</CardTitle>
            <p className="text-white/50 text-sm mt-1">{dateRange}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
            >
              Avg Views {formatNumber(metrics.views)}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Engagement</span>
              <Badge 
                variant="outline"
                className={cn(
                  "border-white/20",
                  trend?.engagement?.direction === "up" ? "text-green-400 bg-green-500/10" : "text-white/70"
                )}
              >
                {engagementRate.toFixed(1)}%
                {trend?.engagement && (
                  <span className="ml-1">
                    {trend.engagement.direction === "up" ? "↑" : "↓"} {trend.engagement.value}%
                  </span>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricItems.map((metric, index) => (
            <div 
              key={index}
              className="flex flex-col gap-2 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className={cn("opacity-60", metric.color)}>
                  {metric.icon}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-white text-2xl font-bold">
                  {metric.value}
                </span>
                {metric.trend && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.trend.direction === "up" ? "text-green-400" : "text-red-400"
                  )}>
                    {metric.trend.direction === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {metric.trend.value}%
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
