"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Eye, Heart, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type TimeRange = "7d" | "30d" | "90d";

interface PerformanceTrendsChartProps {
  organizationId: Id<"organizations">;
  campaignId?: Id<"campaigns">; // Optional campaign filter
  showCampaignSelector?: boolean; // Show campaign dropdown
}

export function PerformanceTrendsChart({
  organizationId,
  campaignId: initialCampaignId,
  showCampaignSelector = false,
}: PerformanceTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [selectedCampaignId, setSelectedCampaignId] = useState<Id<"campaigns"> | undefined>(initialCampaignId);

  // Fetch campaigns for dropdown
  const campaigns = useQuery(
    api.campaigns.listCampaigns,
    showCampaignSelector ? { organizationId } : "skip"
  );

  const trends = useQuery(api.analytics.getDashboardTrends, {
    organizationId,
    timeRange,
    campaignId: selectedCampaignId,
  });

  const selectedCampaign = campaigns?.find((c) => c._id === selectedCampaignId);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format numbers for display
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-[rgba(20,20,20,0.95)] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white/60 text-sm mb-2">
          {label ? formatDate(label) : ""}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/70 capitalize">
              {entry.dataKey === "avgEngagementRate"
                ? "Engagement Rate"
                : entry.dataKey}
              :
            </span>
            <span className="text-white font-medium">
              {entry.dataKey === "roi" || entry.dataKey === "avgEngagementRate"
                ? `${entry.value.toFixed(1)}%`
                : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Loading skeleton
  if (trends === undefined) {
    return <ChartSkeleton />;
  }

  // Empty state
  if (trends.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-white/40 border border-white/5 rounded-lg bg-white/[0.01]">
        <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No performance data available</p>
        <p className="text-xs mt-1">Data will appear once videos have metrics</p>
      </div>
    );
  }

  // Calculate totals for summary
  const totalViews = trends.reduce((sum, t) => sum + t.views, 0);
  const totalEngagement = trends.reduce((sum, t) => sum + t.engagement, 0);
  const avgROI =
    trends.length > 0
      ? trends.reduce((sum, t) => sum + t.roi, 0) / trends.length
      : 0;

  return (
    <div className="space-y-4">
      {/* Header with time range selector and campaign filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-white/60">Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-white/60">Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs text-white/60">ROI %</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Campaign selector */}
          {showCampaignSelector && campaigns && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
                >
                  {selectedCampaign ? selectedCampaign.name : "All Campaigns"}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#141414] border-white/10"
              >
                <DropdownMenuItem
                  className="text-white/70 hover:text-white focus:bg-white/10"
                  onClick={() => setSelectedCampaignId(undefined)}
                >
                  All Campaigns
                </DropdownMenuItem>
                {campaigns.map((campaign) => (
                  <DropdownMenuItem
                    key={campaign._id}
                    className={cn(
                      "text-white/70 hover:text-white focus:bg-white/10",
                      selectedCampaignId === campaign._id && "bg-white/5"
                    )}
                    onClick={() => setSelectedCampaignId(campaign._id)}
                  >
                    {campaign.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
            {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  timeRange === range
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white/50 hover:text-white/70"
                )}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
          <Eye className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-white/50">Total Views</p>
            <p className="text-sm font-semibold text-white">
              {formatNumber(totalViews)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
          <Heart className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-white/50">Engagement</p>
            <p className="text-sm font-semibold text-white">
              {formatNumber(totalEngagement)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-white/50">Avg ROI</p>
            <p className="text-sm font-semibold text-white">
              {avgROI.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trends}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickFormatter={formatNumber}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#viewsGradient)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#engagementGradient)"
              animationDuration={1000}
              animationBegin={200}
            />
            <Area
              type="monotone"
              dataKey="roi"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#roiGradient)"
              animationDuration={1000}
              animationBegin={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-16 bg-white/5" />
          <Skeleton className="h-4 w-20 bg-white/5" />
          <Skeleton className="h-4 w-14 bg-white/5" />
        </div>
        <Skeleton className="h-8 w-40 bg-white/5" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-2 rounded-lg bg-white/[0.02]">
            <Skeleton className="h-3 w-16 mb-1 bg-white/5" />
            <Skeleton className="h-5 w-12 bg-white/5" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-56 flex items-end gap-1 px-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-white/5 rounded-t animate-pulse"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
