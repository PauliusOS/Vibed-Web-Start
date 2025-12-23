"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, TrendingUp, Video, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsData {
  totalVideos: number;
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalLikes?: number;
  totalComments?: number;
  totalShares?: number;
  videosWithMetrics?: number;
}

interface MetricsOverviewProps {
  metrics?: MetricsData;
  budget?: number;
  activeCreators?: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Icon className="h-5 w-5 text-white/60" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white/60 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsOverview({ metrics, budget, activeCreators }: MetricsOverviewProps) {
  if (metrics === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Videos",
      value: metrics.totalVideos,
      subtitle: "Approved & tracking",
      icon: Video,
    },
    {
      title: "Total Views",
      value: formatNumber(metrics.totalViews),
      subtitle: "Across all videos",
      icon: Eye,
    },
    {
      title: "Total Engagement",
      value: formatNumber(metrics.totalEngagement),
      subtitle: "Likes + Comments + Shares",
      icon: Heart,
    },
    {
      title: "Avg. Engagement Rate",
      value: `${metrics.avgEngagementRate.toFixed(2)}%`,
      subtitle: "Across all videos",
      icon: TrendingUp,
    },
  ];

  // Add budget stat if provided
  if (budget !== undefined) {
    stats.push({
      title: "Campaign Budget",
      value: `$${budget.toLocaleString()}`,
      subtitle: "Total allocated",
      icon: DollarSign,
    });
  }

  // Add active creators stat if provided
  if (activeCreators !== undefined) {
    stats.push({
      title: "Active Creators",
      value: activeCreators,
      subtitle: "Assigned to campaign",
      icon: Users,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <MetricCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
