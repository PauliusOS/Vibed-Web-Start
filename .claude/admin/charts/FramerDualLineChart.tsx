"use client";

import { useMemo } from "react";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataPoint = Record<string, any> & { date: string };

interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
}

interface FramerDualLineChartProps {
  data: DataPoint[];
  lines: [LineConfig, LineConfig];
  height?: number;
  className?: string;
  showGrid?: boolean;
  showYAxis?: boolean;
  formatValue?: (value: number) => string;
  formatXAxis?: (value: string) => string;
}

/**
 * Custom Tooltip styled like Framer Analytics
 */
const FramerTooltip = ({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
  formatValue?: (value: number) => string;
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
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-white/60">{entry.name}:</span>
            <span className="text-sm font-medium text-white">
              {formatValue
                ? formatValue(entry.value)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * FramerDualLineChart - A beautiful dual-line area chart matching Framer's aesthetic
 *
 * Features:
 * - Two smooth curved lines (cyan and blue by default)
 * - Gradient fills under each line that fade to transparent
 * - Very subtle dotted horizontal grid lines
 * - Clean minimal axis styling
 * - Responsive sizing
 * - Smooth animations
 */
export function FramerDualLineChart({
  data,
  lines,
  height = 320,
  className,
  showGrid = true,
  showYAxis = true,
  formatValue = (v) => v.toLocaleString(),
  formatXAxis,
}: FramerDualLineChartProps) {
  // Generate unique IDs for gradients
  const gradientId1 = useMemo(
    () => `framer-gradient-${lines[0].dataKey}-${Math.random().toString(36).substr(2, 9)}`,
    [lines]
  );
  const gradientId2 = useMemo(
    () => `framer-gradient-${lines[1].dataKey}-${Math.random().toString(36).substr(2, 9)}`,
    [lines]
  );

  // Format data for display
  const formattedData = useMemo(() => {
    if (!formatXAxis) return data;
    return data.map((item) => ({
      ...item,
      displayDate: formatXAxis(item.date),
    }));
  }, [data, formatXAxis]);

  const xAxisKey = formatXAxis ? "displayDate" : "date";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", className)}
    >
      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 pl-2">
        {lines.map((line) => (
          <div key={line.dataKey} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="text-xs text-white/50 font-normal">
              {line.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: showYAxis ? 0 : -30, bottom: 20 }}
          >
            {/* Gradient Definitions */}
            <defs>
              {/* Line 1 Gradient - Cyan by default */}
              <linearGradient id={gradientId1} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lines[0].color} stopOpacity={0.25} />
                <stop offset="50%" stopColor={lines[0].color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={lines[0].color} stopOpacity={0} />
              </linearGradient>

              {/* Line 2 Gradient - Purple by default */}
              <linearGradient id={gradientId2} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lines[1].color} stopOpacity={0.25} />
                <stop offset="50%" stopColor={lines[1].color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={lines[1].color} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid Lines - Very subtle dotted horizontal lines */}
            {showGrid && (
              <CartesianGrid
                strokeDasharray="2 6"
                vertical={false}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth={1}
              />
            )}

            {/* X Axis - Clean minimal styling */}
            <XAxis
              dataKey={xAxisKey}
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

            {/* Y Axis - Optional, minimal styling */}
            {showYAxis && (
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
            )}

            {/* Tooltip */}
            <Tooltip
              content={<FramerTooltip formatValue={formatValue} />}
              cursor={{
                stroke: "rgba(255, 255, 255, 0.1)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            {/* Area 1 - Rendered first (behind) */}
            <Area
              type="monotone"
              dataKey={lines[0].dataKey}
              name={lines[0].label}
              stroke={lines[0].color}
              strokeWidth={2}
              fill={`url(#${gradientId1})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: lines[0].color,
                stroke: "#000",
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            {/* Area 2 - Rendered second (front) */}
            <Area
              type="monotone"
              dataKey={lines[1].dataKey}
              name={lines[1].label}
              stroke={lines[1].color}
              strokeWidth={2}
              fill={`url(#${gradientId2})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: lines[1].color,
                stroke: "#000",
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/**
 * Pre-configured chart with Framer's default cyan and blue colors
 */
interface FramerAnalyticsChartProps {
  data: DataPoint[];
  primaryKey: string;
  primaryLabel: string;
  secondaryKey: string;
  secondaryLabel: string;
  height?: number;
  className?: string;
  formatValue?: (value: number) => string;
}

export function FramerAnalyticsChart({
  data,
  primaryKey,
  primaryLabel,
  secondaryKey,
  secondaryLabel,
  height = 320,
  className,
  formatValue,
}: FramerAnalyticsChartProps) {
  const lines: [LineConfig, LineConfig] = [
    { dataKey: primaryKey, label: primaryLabel, color: "#38bdf8" }, // Cyan
    { dataKey: secondaryKey, label: secondaryLabel, color: "#3b82f6" }, // Blue
  ];

  return (
    <FramerDualLineChart
      data={data}
      lines={lines}
      height={height}
      className={className}
      formatValue={formatValue}
      formatXAxis={(date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }}
    />
  );
}
