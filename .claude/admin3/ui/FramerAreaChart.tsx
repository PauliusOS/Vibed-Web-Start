"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TimeRange = "7d" | "30d" | "90d";

interface FramerAreaChartProps {
  organizationId: Id<"organizations">;
  campaignId?: Id<"campaigns">;
}

export function FramerAreaChart({
  organizationId,
  campaignId,
}: FramerAreaChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const trends = useQuery(api.analytics.getDashboardTrends, {
    organizationId,
    timeRange,
    campaignId,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (!active || !payload?.[0]) return null;

    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white/50 text-xs mb-1">
          {label ? formatDate(label) : ""}
        </p>
        <p className="text-white font-semibold">
          {formatNumber(payload[0].value)} views
        </p>
      </div>
    );
  };

  if (trends === undefined) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-48 bg-white/5" />
        </div>
        <div className="h-64 flex items-end gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-white/5 rounded-t"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-white/30">
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Time range selector */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === range
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trends}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="framerBlueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="transparent"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              dy={10}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              tickFormatter={formatNumber}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#framerBlueGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
