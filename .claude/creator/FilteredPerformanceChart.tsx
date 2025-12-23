"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

type DataPoint = { date: string } & Record<string, string | number>;

type MetricType = "followers" | "engagementRate" | "views" | "earnings" | "rpm";

interface MetricConfig {
  key: MetricType;
  label: string;
  color: string;
  format?: (value: number) => string;
}

const METRICS: Record<MetricType, MetricConfig> = {
  followers: {
    key: "followers",
    label: "Followers",
    color: "#38bdf8", // cyan
    format: (v) => {
      if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
      return v.toLocaleString();
    },
  },
  engagementRate: {
    key: "engagementRate",
    label: "Engagement Rate",
    color: "#3b82f6", // blue
    format: (v) => `${v.toFixed(1)}%`,
  },
  views: {
    key: "views",
    label: "Total Views",
    color: "#8b5cf6", // purple
    format: (v) => {
      if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
      return v.toLocaleString();
    },
  },
  earnings: {
    key: "earnings",
    label: "Earnings",
    color: "#10b981", // green
    format: (v) => `$${v.toLocaleString()}`,
  },
  rpm: {
    key: "rpm",
    label: "RPM",
    color: "#f59e0b", // amber
    format: (v) => `$${v.toFixed(2)}`,
  },
};

interface FilteredPerformanceChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
  defaultMetrics?: MetricType[];
}

/**
 * Custom Tooltip styled like Framer Analytics
 */
const FramerTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/[0.08] bg-black/90 backdrop-blur-xl p-3 shadow-2xl"
    >
      <p className="text-xs text-white/50 mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const metric = Object.values(METRICS).find(
            (m) => m.key === entry.dataKey
          );
          const formatter = metric?.format || ((v: number) => v.toLocaleString());

          return (
            <div key={index} className="flex items-center gap-2.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-white/60">{entry.name}:</span>
              <span className="text-sm font-medium text-white">
                {formatter(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

/**
 * FilteredPerformanceChart - Enhanced chart with checkbox-based metric filtering
 *
 * Features:
 * - Checkbox sidebar for metric selection
 * - Support for 1-4 metrics simultaneously
 * - Smooth curved lines with gradient fills
 * - Clean minimal design matching Framer's aesthetic
 * - Responsive and animated
 */
export function FilteredPerformanceChart({
  data,
  height = 320,
  className,
  defaultMetrics = ["followers", "engagementRate", "rpm"],
}: FilteredPerformanceChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(defaultMetrics);

  // Update selected metrics when defaultMetrics changes
  useEffect(() => {
    if (defaultMetrics.length > 0) {
      setSelectedMetrics(defaultMetrics);
    }
  }, [defaultMetrics]);

  // Format data for display
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  // Generate unique gradient IDs for each selected metric
  const gradientIds = useMemo(() => {
    return selectedMetrics.reduce((acc, metricKey) => {
      acc[metricKey] = `gradient-${metricKey}-${Math.random().toString(36).substr(2, 9)}`;
      return acc;
    }, {} as Record<MetricType, string>);
  }, [selectedMetrics]);

  const toggleMetric = (metricKey: MetricType) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricKey)) {
        // Don't allow removing the last metric
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== metricKey);
      } else {
        // Don't allow more than 4 metrics
        if (prev.length >= 4) return prev;
        return [...prev, metricKey];
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", className)}
    >
      {/* Metric Filter Checkboxes */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {Object.values(METRICS).map((metric) => {
          const isSelected = selectedMetrics.includes(metric.key);
          return (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                "border",
                isSelected
                  ? "bg-white/[0.08] border-white/[0.12]"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.08]"
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-200",
                  isSelected ? "bg-white/10" : "bg-transparent"
                )}
                style={{
                  borderColor: isSelected ? metric.color : "rgba(255, 255, 255, 0.2)",
                }}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: metric.color }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <span className="text-sm text-white/70 font-medium">
                {metric.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
                {/* Gradient Definitions */}
                <defs>
                  {selectedMetrics.map((metricKey) => {
                    const metric = METRICS[metricKey];
                    const gradientId = gradientIds[metricKey];
                    return (
                      <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={metric.color} stopOpacity={0.25} />
                        <stop offset="50%" stopColor={metric.color} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                </defs>

                {/* Grid Lines */}
                <CartesianGrid
                  strokeDasharray="2 6"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth={1}
                />

                {/* X Axis */}
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255, 255, 255, 0.35)",
                    fontSize: 11,
                    fontWeight: 400,
                  }}
                  dy={12}
                  tickMargin={8}
                />

                {/* Y Axis */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255, 255, 255, 0.35)",
                    fontSize: 11,
                    fontWeight: 400,
                  }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                  width={45}
                  dx={-8}
                />

                {/* Tooltip */}
                <Tooltip
                  content={<FramerTooltip />}
                  cursor={{
                    stroke: "rgba(255, 255, 255, 0.1)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                {/* Dynamic Area Charts for Selected Metrics */}
                {selectedMetrics.map((metricKey, index) => {
                  const metric = METRICS[metricKey];
                  const gradientId = gradientIds[metricKey];

                  return (
                    <Area
                      key={metricKey}
                      type="monotone"
                      dataKey={metric.key}
                      name={metric.label}
                      stroke={metric.color}
                      strokeWidth={2}
                      fill={`url(#${gradientId})`}
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: metric.color,
                        stroke: "#000",
                        strokeWidth: 2,
                      }}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      animationBegin={index * 200}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
    </motion.div>
  );
}
