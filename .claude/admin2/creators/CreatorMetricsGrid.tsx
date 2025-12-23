"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Video,
  Eye,
  Heart,
  TrendingUp,
  Percent,
  BarChart3,
  DollarSign,
} from "lucide-react";

interface CreatorMetrics {
  totalCreators: number;
  activeCreators: number;
  totalVideos: number;
  pendingVideos: number;
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalPayments: number;
}

interface CreatorMetricsGridProps {
  data: CreatorMetrics | undefined;
  isLoading?: boolean;
}

export function CreatorMetricsGrid({ data, isLoading }: CreatorMetricsGridProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <GlassPanel key={i} className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </GlassPanel>
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const metrics = [
    {
      label: "Total Creators",
      value: data.totalCreators.toString(),
      subValue: `${data.activeCreators} active`,
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Videos",
      value: data.totalVideos.toString(),
      subValue: `${data.pendingVideos} pending`,
      icon: Video,
      color: "blue",
    },
    {
      label: "Total Views",
      value: formatValue(data.totalViews),
      icon: Eye,
      color: "indigo",
    },
    {
      label: "Total Engagement",
      value: formatValue(data.totalEngagement),
      icon: Heart,
      color: "pink",
    },
    {
      label: "Avg Engagement Rate",
      value: `${data.avgEngagementRate.toFixed(2)}%`,
      icon: Percent,
      color: "emerald",
    },
    {
      label: "Total Payments",
      value: `$${formatValue(data.totalPayments)}`,
      icon: DollarSign,
      color: "amber",
    },
    {
      label: "Avg Views/Creator",
      value: formatValue(
        data.totalCreators > 0 ? data.totalViews / data.totalCreators : 0
      ),
      icon: TrendingUp,
      color: "cyan",
    },
    {
      label: "Avg Videos/Creator",
      value: (data.totalCreators > 0
        ? data.totalVideos / data.totalCreators
        : 0
      ).toFixed(1),
      icon: BarChart3,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <GlassPanel key={i} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/60">{metric.label}</p>
              <p className={`text-2xl font-bold text-${metric.color}-400 mt-1`}>
                {metric.value}
              </p>
              {metric.subValue && (
                <p className="text-xs text-white/40 mt-1">{metric.subValue}</p>
              )}
            </div>
            <metric.icon className={`w-6 h-6 text-${metric.color}-400/50`} />
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
