"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendDataPoint {
  date: string;
  views: number;
  engagement: number;
  roi: number;
  avgEngagementRate: number;
}

interface PerformanceTrendsChartProps {
  data: TrendDataPoint[] | undefined;
  comparison?: {
    viewsChange: number;
    engagementChange: number;
    trend: "up" | "down" | "stable";
  };
  isLoading?: boolean;
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
  timeRange?: "7d" | "30d" | "90d";
}

type MetricType = "all" | "views" | "engagement" | "roi";

const METRICS = [
  { key: "all" as MetricType, label: "All" },
  { key: "views" as MetricType, label: "Views" },
  { key: "engagement" as MetricType, label: "Engagement" },
  { key: "roi" as MetricType, label: "ROI" },
];

const TIME_RANGES = [
  { value: "7d" as const, label: "7D" },
  { value: "30d" as const, label: "30D" },
  { value: "90d" as const, label: "90D" },
];

export function PerformanceTrendsChart({
  data,
  comparison,
  isLoading,
  onTimeRangeChange,
  timeRange = "30d",
}: PerformanceTrendsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("all");

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Skeleton className="h-[350px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
        <div className="h-[350px] flex items-center justify-center text-white/40">
          No performance data available yet
        </div>
      </GlassPanel>
    );
  }

  // Calculate totals
  const totalViews = data.reduce((sum, d) => sum + d.views, 0);
  const totalEngagement = data.reduce((sum, d) => sum + d.engagement, 0);
  const avgROI = data.reduce((sum, d) => sum + d.roi, 0) / data.length;

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  const visibleMetrics =
    selectedMetric === "all"
      ? ["views", "engagement", "roi"]
      : [selectedMetric];

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Trends</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-white/60">
              {formatValue(totalViews)} views
            </span>
            <span className="text-sm text-white/60">
              {formatValue(totalEngagement)} engagements
            </span>
            {comparison && (
              <span
                className={`flex items-center gap-1 text-sm ${
                  comparison.trend === "up"
                    ? "text-emerald-400"
                    : comparison.trend === "down"
                    ? "text-red-400"
                    : "text-white/60"
                }`}
              >
                {comparison.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : comparison.trend === "down" ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                {Math.abs(comparison.viewsChange).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                size="sm"
                variant={timeRange === range.value ? "secondary" : "ghost"}
                className={
                  timeRange === range.value
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => onTimeRangeChange?.(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {METRICS.map((metric) => (
              <Button
                key={metric.key}
                size="sm"
                variant={selectedMetric === metric.key ? "secondary" : "ghost"}
                className={
                  selectedMetric === metric.key
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => setSelectedMetric(metric.key)}
              >
                {metric.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="viewsGradientOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engagementGradientOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="roiGradientOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
              }}
              labelStyle={{ color: "white", fontWeight: "bold", marginBottom: "8px" }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              }
              formatter={(value: number, name: string) => {
                if (name === "roi") return [`${value.toFixed(1)}%`, "ROI"];
                return [formatValue(value), name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-white/60 text-sm">
                  {value === "roi" ? "ROI" : value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            {visibleMetrics.includes("views") && (
              <Area
                type="monotone"
                dataKey="views"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#viewsGradientOverview)"
                animationDuration={1000}
              />
            )}
            {visibleMetrics.includes("engagement") && (
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#engagementGradientOverview)"
                animationDuration={1000}
                animationBegin={200}
              />
            )}
            {visibleMetrics.includes("roi") && (
              <Area
                type="monotone"
                dataKey="roi"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#roiGradientOverview)"
                animationDuration={1000}
                animationBegin={400}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-white/40">Total Views</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatValue(totalViews)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-white/40">Total Engagement</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatValue(totalEngagement)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs text-white/40">Average ROI</span>
          </div>
          <p className="text-lg font-semibold text-white">{avgROI.toFixed(1)}%</p>
        </div>
      </div>
    </GlassPanel>
  );
}
