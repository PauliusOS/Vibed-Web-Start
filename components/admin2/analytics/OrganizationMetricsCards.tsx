"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  BarChart3,
  Users,
  Video,
  Eye,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsData {
  campaigns: {
    total: number;
    active: number;
    completed: number;
    draft: number;
  };
  creators: {
    total: number;
  };
  videos: {
    total: number;
    pending: number;
  };
  metrics: {
    totalViews: number;
    totalEngagement: number;
    avgEngagementRate: number;
    roi: number;
  };
  financial: {
    totalBudget: number;
    totalSpend: number;
    remaining: number;
  };
}

interface OrganizationMetricsCardsProps {
  data?: MetricsData;
  isLoading?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

function formatCurrency(num: number): string {
  if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return "$" + (num / 1000).toFixed(1) + "K";
  }
  return "$" + num.toLocaleString();
}

export function OrganizationMetricsCards({
  data,
  isLoading,
}: OrganizationMetricsCardsProps) {
  if (isLoading || !data) {
    return <MetricsCardsSkeleton />;
  }

  const metrics = [
    {
      label: "Total Campaigns",
      value: data.campaigns.total.toString(),
      subtitle: `${data.campaigns.active} active, ${data.campaigns.completed} completed`,
      icon: BarChart3,
      color: "blue",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Active Creators",
      value: data.creators.total.toString(),
      subtitle: "across all campaigns",
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      label: "Total Videos",
      value: data.videos.total.toString(),
      subtitle: `${data.videos.pending} pending approval`,
      icon: Video,
      color: "amber",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      label: "Total Views",
      value: formatNumber(data.metrics.totalViews),
      subtitle: `${formatNumber(data.metrics.totalEngagement)} engagement`,
      icon: Eye,
      color: "cyan",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      label: "Avg. Engagement Rate",
      value: `${data.metrics.avgEngagementRate.toFixed(2)}%`,
      subtitle: "across all videos",
      icon: Heart,
      color: "pink",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-400",
    },
    {
      label: "Total Spend",
      value: formatCurrency(data.financial.totalSpend),
      subtitle: `${formatCurrency(data.financial.remaining)} remaining`,
      icon: DollarSign,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <GlassPanel className="p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2 rounded-lg ${metric.bgColor}`}
              >
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-white/60 mt-1">{metric.label}</p>
              <p className="text-xs text-white/40 mt-1">{metric.subtitle}</p>
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}

function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <GlassPanel key={i} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-9 w-9 rounded-lg bg-white/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-20 bg-white/5" />
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-3 w-28 bg-white/5" />
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
