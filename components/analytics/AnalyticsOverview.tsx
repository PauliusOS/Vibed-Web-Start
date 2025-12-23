"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

interface AnalyticsOverviewProps {
  title?: string;
  metrics: {
    avgViews: number;
    engagement: number;
    comments: number;
    likes: number;
    saves: number;
    shares: number;
  };
  period?: {
    start: string;
    end: string;
  };
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function AnalyticsOverview({
  title = "All Platforms",
  metrics,
  period = { start: "Nov 17", end: "Dec 17" },
  className
}: AnalyticsOverviewProps) {
  const analyticsMetrics: AnalyticsMetric[] = [
    {
      label: "Avg Views",
      value: formatNumber(metrics.avgViews),
      icon: <Eye className="w-5 h-5" />,
      color: "text-blue-400",
    },
    {
      label: "Engagement",
      value: `${metrics.engagement.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      label: "Comments",
      value: formatNumber(metrics.comments),
      icon: <Share2 className="w-5 h-5" />,
      color: "text-purple-400",
    },
    {
      label: "Likes",
      value: formatNumber(metrics.likes),
      icon: <Heart className="w-5 h-5" />,
      color: "text-pink-400",
    },
    {
      label: "Saves",
      value: formatNumber(metrics.saves),
      icon: <Bookmark className="w-5 h-5" />,
      color: "text-yellow-400",
    },
    {
      label: "Shares",
      value: formatNumber(metrics.shares),
      icon: <Share2 className="w-5 h-5" />,
      color: "text-cyan-400",
    },
  ];

  return (
    <Card className={cn("bg-white/[0.03] border-white/10", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/50">
                  {period.start} — {period.end}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analyticsMetrics.map((metric, index) => (
            <div 
              key={index}
              className="flex flex-col gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className={cn("opacity-60 group-hover:opacity-100 transition-opacity", metric.color)}>
                  {metric.icon}
                </span>
                {metric.change !== undefined && (
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs px-1.5 py-0.5 h-5",
                      metric.change > 0 
                        ? "border-green-500/30 text-green-400 bg-green-500/10" 
                        : "border-red-500/30 text-red-400 bg-red-500/10"
                    )}
                  >
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </Badge>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-white/50 font-medium">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
