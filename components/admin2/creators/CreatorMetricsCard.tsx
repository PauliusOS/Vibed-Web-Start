"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ChevronRight, Users, FileText, Eye, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CreatorMetricsCardProps {
  organizationId: Id<"organizations">;
  rosterId?: Id<"creatorRosters">;
  campaignId?: Id<"campaigns">;
  days?: number;
  showViewReportLink?: boolean;
  reportLinkHref?: string;
}

export function CreatorMetricsCard({
  organizationId,
  rosterId,
  campaignId,
  days = 30,
  showViewReportLink = true,
  reportLinkHref = "/admin2/creators/analytics",
}: CreatorMetricsCardProps) {
  const analytics = useQuery(api.creatorRosters.getRosterAnalytics, {
    organizationId,
    rosterId,
    campaignId,
    days,
  });

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "↑" : "↓";
    return `${sign}${Math.abs(value).toFixed(0)}%`;
  };

  if (!analytics) {
    return (
      <Card className="bg-[#0a0a0a] border-[#1a1a1a] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
          <Skeleton className="h-[180px] w-full" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, medians, changes, trendData, topCreators } = analytics;

  // Calculate comparison to previous period
  const periodComparisonPercent = changes.viewsChangePercent;

  // Get time period label
  const periodLabel = days === 7 ? "This week" : days === 30 ? "This month" : `Last ${days} days`;

  // Chart data - format for display
  const chartData = trendData.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // Metrics grid data
  const metrics = [
    {
      label: "Active Creators",
      value: summary.activeCreators.toString(),
      change: changes.creatorsChangePercent,
      icon: Users,
    },
    {
      label: "Total Posts",
      value: summary.totalPosts.toString(),
      change: changes.postsChangePercent,
      icon: FileText,
    },
    {
      label: "Avg. Views/Post",
      value: formatValue(medians.avgViewsPerPost),
      change: changes.viewsChangePercent,
      icon: Eye,
    },
    {
      label: "Completion Rate",
      value: `${summary.completionRate.toFixed(0)}%`,
      change: 6, // Placeholder - would need historical data
      icon: CheckCircle2,
    },
  ];

  return (
    <Card className="bg-[#0a0a0a] border-[#1a1a1a] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Creator Metrics</h3>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-3"
          >
            {periodLabel}
          </Badge>
        </div>
        <p className="text-sm text-white/50">Active Roster Performance</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Metric */}
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-emerald-400">
              {formatValue(summary.totalViews)}
            </span>
            <span
              className={`text-sm font-medium ${
                changes.viewsChangePercent >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {formatPercent(changes.viewsChangePercent)}
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">Total Views</p>
        </div>

        {/* Area Chart */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="formattedDate"
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatValue(value)}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "white", fontSize: 12 }}
                formatter={(value: number) => [formatValue(value), "Views"]}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#viewsGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
            >
              <p className="text-xs text-white/50">{metric.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold text-white">
                  {metric.value}
                </span>
                <span
                  className={`text-xs font-medium ${
                    metric.change >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatPercent(metric.change)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Creators Preview */}
        {topCreators && topCreators.length > 0 && (
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Top Performers
              </span>
              <div className="flex -space-x-2">
                {topCreators.slice(0, 4).map((creator, index) => (
                  <Avatar
                    key={creator.creatorId}
                    className="w-7 h-7 border-2 border-[#0a0a0a]"
                    style={{ zIndex: topCreators.length - index }}
                  >
                    <AvatarImage src={creator.profilePictureUrl} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                      {creator.username?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {topCreators.length > 4 && (
                  <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#0a0a0a] flex items-center justify-center">
                    <span className="text-[10px] text-white/60">
                      +{topCreators.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                periodComparisonPercent >= 0 ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span className="text-sm text-white/60">
              {periodComparisonPercent >= 0 ? "+" : ""}
              {periodComparisonPercent.toFixed(0)}% vs last period
            </span>
          </div>
          {showViewReportLink && (
            <Link
              href={reportLinkHref}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View Full Report
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for sidebars or smaller spaces
export function CreatorMetricsCompact({
  organizationId,
  rosterId,
  days = 30,
}: {
  organizationId: Id<"organizations">;
  rosterId?: Id<"creatorRosters">;
  days?: number;
}) {
  const analytics = useQuery(api.creatorRosters.getRosterAnalytics, {
    organizationId,
    rosterId,
    days,
  });

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  if (!analytics) {
    return (
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-20" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  const { summary, medians, topCreators } = analytics;

  return (
    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Roster Performance</span>
        <div className="flex -space-x-1">
          {topCreators.slice(0, 3).map((creator, index) => (
            <Avatar
              key={creator.creatorId}
              className="w-5 h-5 border border-[#0a0a0a]"
              style={{ zIndex: topCreators.length - index }}
            >
              <AvatarImage src={creator.profilePictureUrl} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-[8px]">
                {creator.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      <div className="text-2xl font-bold text-emerald-400">
        {formatValue(summary.totalViews)}
        <span className="text-sm text-white/50 font-normal ml-2">views</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-white/50">
        <span>{summary.activeCreators} creators</span>
        <span>•</span>
        <span>{summary.totalPosts} posts</span>
        <span>•</span>
        <span>{formatValue(summary.totalFollowers)} followers</span>
      </div>

      {/* Median stats */}
      <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-white/40">Median Views</span>
          <p className="text-white font-medium">
            {formatValue(medians.overallMedianViews)}
          </p>
        </div>
        <div>
          <span className="text-white/40">Creator Median</span>
          <p className="text-white font-medium">
            {formatValue(medians.creatorMedianViews)}
          </p>
        </div>
      </div>
    </div>
  );
}

















