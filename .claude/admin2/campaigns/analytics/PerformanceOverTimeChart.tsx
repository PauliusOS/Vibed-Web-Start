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

interface DataPoint {
  timestamp: number;
  views: number;
  engagement: number;
  engagementRate?: number;
}

interface PerformanceOverTimeChartProps {
  data: DataPoint[] | undefined;
  isLoading?: boolean;
}

const TIME_RANGES = [
  { label: "7D", value: 7 },
  { label: "14D", value: 14 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "All", value: 0 },
] as const;

export function PerformanceOverTimeChart({
  data,
  isLoading,
}: PerformanceOverTimeChartProps) {
  const [timeRange, setTimeRange] = useState<number>(30);

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No performance data available yet
        </div>
      </GlassPanel>
    );
  }

  // Filter data based on time range
  const now = Date.now();
  const filteredData = timeRange === 0
    ? data
    : data.filter((d) => d.timestamp > now - timeRange * 24 * 60 * 60 * 1000);

  // Format data for chart
  const chartData = filteredData.map((d) => ({
    date: new Date(d.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    views: d.views,
    engagement: d.engagement,
    engagementRate: d.engagementRate || 0,
  }));

  // Calculate trend
  const midpoint = Math.floor(chartData.length / 2);
  const firstHalf = chartData.slice(0, midpoint);
  const secondHalf = chartData.slice(midpoint);

  const firstHalfViews = firstHalf.reduce((sum, d) => sum + d.views, 0);
  const secondHalfViews = secondHalf.reduce((sum, d) => sum + d.views, 0);
  const trend = firstHalfViews > 0
    ? ((secondHalfViews - firstHalfViews) / firstHalfViews) * 100
    : 0;

  // Totals
  const totalViews = chartData.reduce((sum, d) => sum + d.views, 0);
  const totalEngagement = chartData.reduce((sum, d) => sum + d.engagement, 0);

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Over Time</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-white/60">
              {totalViews.toLocaleString()} views
            </span>
            <span className="text-sm text-white/60">
              {totalEngagement.toLocaleString()} engagements
            </span>
            <span className={`flex items-center gap-1 text-sm ${
              trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-white/60"
            }`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> :
               trend < 0 ? <TrendingDown className="w-4 h-4" /> :
               <Minus className="w-4 h-4" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              size="sm"
              variant={timeRange === range.value ? "secondary" : "ghost"}
              className={timeRange === range.value
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "text-white/60 hover:text-white hover:bg-white/10"
              }
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
              }}
              labelStyle={{ color: "white", fontWeight: "bold", marginBottom: "8px" }}
              itemStyle={{ color: "rgba(255,255,255,0.8)" }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-white/60 text-sm">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#8b5cf6"
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
