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

interface CreatorTrendData {
  date: string;
  views: number;
  engagement: number;
  videoCount: number;
}

interface CreatorPerformanceChartProps {
  data: CreatorTrendData[] | undefined;
  isLoading?: boolean;
}

type TimeRange = "7d" | "30d" | "90d";

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

export function CreatorPerformanceChart({
  data,
  isLoading,
}: CreatorPerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  if (isLoading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </GlassPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Creator Performance Trends</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No performance data available
        </div>
      </GlassPanel>
    );
  }

  // Filter data by time range
  const filterDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const filteredData = data.slice(-filterDays);

  const totalViews = filteredData.reduce((sum, d) => sum + d.views, 0);
  const totalEngagement = filteredData.reduce((sum, d) => sum + d.engagement, 0);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Creator Performance Trends</h3>
          <p className="text-sm text-white/60 mt-1">
            {formatValue(totalViews)} views • {formatValue(totalEngagement)} engagements
          </p>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              size="sm"
              variant={timeRange === range.value ? "secondary" : "ghost"}
              className={
                timeRange === range.value
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="creatorViewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="creatorEngagementGradient" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: number, name: string) => [
                formatValue(value),
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
              fill="url(#creatorViewsGradient)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#creatorEngagementGradient)"
              animationDuration={1000}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
