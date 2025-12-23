"use client";

import { useState } from "react";
import {
  Line,
  LineChart,
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
import { Activity } from "lucide-react";

interface EngagementDataPoint {
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
}

interface EngagementTrendsChartProps {
  data: EngagementDataPoint[] | undefined;
  isLoading?: boolean;
}

type MetricType = "all" | "likes" | "comments" | "shares" | "engagementRate";

const METRICS = [
  { key: "all" as MetricType, label: "All" },
  { key: "likes" as MetricType, label: "Likes" },
  { key: "comments" as MetricType, label: "Comments" },
  { key: "shares" as MetricType, label: "Shares" },
  { key: "engagementRate" as MetricType, label: "Rate" },
];

const METRIC_COLORS = {
  likes: "#ef4444",
  comments: "#3b82f6",
  shares: "#10b981",
  saves: "#f59e0b",
  engagementRate: "#8b5cf6",
};

export function EngagementTrendsChart({
  data,
  isLoading,
}: EngagementTrendsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("all");

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
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Trends</h3>
        <div className="h-[300px] flex items-center justify-center text-white/40">
          No engagement data available yet
        </div>
      </GlassPanel>
    );
  }

  // Format data for chart
  const chartData = data.map((d) => ({
    date: new Date(d.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    likes: d.likes,
    comments: d.comments,
    shares: d.shares,
    saves: d.saves,
    engagementRate: d.engagementRate,
  }));

  // Calculate totals
  const totals = {
    likes: data.reduce((sum, d) => sum + d.likes, 0),
    comments: data.reduce((sum, d) => sum + d.comments, 0),
    shares: data.reduce((sum, d) => sum + d.shares, 0),
    saves: data.reduce((sum, d) => sum + d.saves, 0),
  };

  const avgEngagementRate =
    data.reduce((sum, d) => sum + d.engagementRate, 0) / data.length;

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const visibleLines =
    selectedMetric === "all"
      ? ["likes", "comments", "shares", "engagementRate"]
      : [selectedMetric];

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Engagement Trends</h3>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
            <span>{formatValue(totals.likes)} likes</span>
            <span>{formatValue(totals.comments)} comments</span>
            <span>{formatValue(totals.shares)} shares</span>
            <span>{avgEngagementRate.toFixed(2)}% avg rate</span>
          </div>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {METRICS.map((metric) => (
            <Button
              key={metric.key}
              size="sm"
              variant={selectedMetric === metric.key ? "secondary" : "ghost"}
              className={
                selectedMetric === metric.key
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }
              onClick={() => setSelectedMetric(metric.key)}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
                if (selectedMetric === "engagementRate") return `${value}%`;
                return formatValue(value);
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
              formatter={(value: number, name: string) => {
                if (name === "engagementRate") {
                  return [`${value.toFixed(2)}%`, "Engagement Rate"];
                }
                return [value.toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-white/60 text-sm">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )}
            />
            {visibleLines.includes("likes") && (
              <Line
                type="monotone"
                dataKey="likes"
                stroke={METRIC_COLORS.likes}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            )}
            {visibleLines.includes("comments") && (
              <Line
                type="monotone"
                dataKey="comments"
                stroke={METRIC_COLORS.comments}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationBegin={100}
              />
            )}
            {visibleLines.includes("shares") && (
              <Line
                type="monotone"
                dataKey="shares"
                stroke={METRIC_COLORS.shares}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationBegin={200}
              />
            )}
            {visibleLines.includes("engagementRate") && (
              <Line
                type="monotone"
                dataKey="engagementRate"
                stroke={METRIC_COLORS.engagementRate}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationBegin={300}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Breakdown Summary */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-white/40">Likes</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatValue(totals.likes)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-white/40">Comments</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatValue(totals.comments)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-white/40">Shares</span>
          </div>
          <p className="text-lg font-semibold text-white">{formatValue(totals.shares)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs text-white/40">Avg Rate</span>
          </div>
          <p className="text-lg font-semibold text-white">{avgEngagementRate.toFixed(2)}%</p>
        </div>
      </div>
    </GlassPanel>
  );
}
