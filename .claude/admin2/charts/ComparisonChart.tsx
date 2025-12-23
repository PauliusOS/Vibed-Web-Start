"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  [key: string]: string | number;
}

interface ComparisonData {
  current: DataPoint[];
  previous: DataPoint[];
}

interface ComparisonChartProps {
  data: ComparisonData;
  currentLabel?: string;
  previousLabel?: string;
  xAxisKey: string;
  dataKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showComparison?: boolean;
  animate?: boolean;
  className?: string;
}

export function ComparisonChart({
  data,
  currentLabel = "Current Period",
  previousLabel = "Previous Period",
  xAxisKey,
  dataKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  showComparison = true,
  animate = true,
  className = "",
}: ComparisonChartProps) {
  // Calculate total for both periods
  const currentTotal = data.current.reduce(
    (sum, item) => sum + (Number(item[dataKey]) || 0),
    0
  );
  const previousTotal = data.previous.reduce(
    (sum, item) => sum + (Number(item[dataKey]) || 0),
    0
  );

  // Calculate percentage change
  const percentChange =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

  const isPositive = percentChange > 0;
  const isNeutral = percentChange === 0;

  // Merge data for dual-line display
  const mergedData = data.current.map((currentItem, index) => {
    const previousItem = data.previous[index] || {};
    return {
      [xAxisKey]: currentItem[xAxisKey],
      current: currentItem[dataKey],
      previous: previousItem[dataKey] || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload.find((p: any) => p.dataKey === "current");
      const previous = payload.find((p: any) => p.dataKey === "previous");

      const currentVal = current?.value || 0;
      const previousVal = previous?.value || 0;
      const diff = currentVal - previousVal;
      const diffPercent =
        previousVal > 0 ? ((diff / previousVal) * 100).toFixed(1) : "N/A";

      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/[0.1] rounded-lg p-3 shadow-xl min-w-[200px]">
          <p className="text-white font-medium mb-2">{label}</p>

          {current && (
            <div className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-white/80 text-sm">{currentLabel}:</span>
              </div>
              <span className="text-white font-semibold text-sm">
                {currentVal.toLocaleString()}
              </span>
            </div>
          )}

          {previous && (
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-white/80 text-sm">
                  {previousLabel}:
                </span>
              </div>
              <span className="text-white font-semibold text-sm">
                {previousVal.toLocaleString()}
              </span>
            </div>
          )}

          {current && previous && (
            <div className="pt-2 border-t border-white/[0.1]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Change:</span>
                <span
                  className={`font-semibold ${
                    diff > 0
                      ? "text-green-400"
                      : diff < 0
                        ? "text-red-400"
                        : "text-white/60"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toLocaleString()} ({diffPercent}%)
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {showComparison && (
        <motion.div
          initial={animate ? { opacity: 0, y: -10 } : {}}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-white text-sm">{currentLabel}</span>
              <span className="text-white font-semibold">
                {currentTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-white text-sm">{previousLabel}</span>
              <span className="text-white font-semibold">
                {previousTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isPositive
                ? "bg-green-500/10 border border-green-500/20"
                : isNeutral
                  ? "bg-white/[0.05] border border-white/[0.06]"
                  : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : isNeutral ? (
              <Minus className="w-4 h-4 text-white/60" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`font-semibold ${
                isPositive
                  ? "text-green-400"
                  : isNeutral
                    ? "text-white/60"
                    : "text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentChange.toFixed(1)}%
            </span>
            <span className="text-white/60 text-sm">vs previous</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : {}}
        animate={animate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={mergedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.06)"
                vertical={false}
              />
            )}

            <XAxis
              dataKey={xAxisKey}
              stroke="rgba(255, 255, 255, 0.4)"
              tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
            />

            <YAxis
              stroke="rgba(255, 255, 255, 0.4)"
              tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
              tickFormatter={(value) => {
                if (value >= 1000000)
                  return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                return value.toLocaleString();
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) =>
                  value === "current" ? currentLabel : previousLabel
                }
                iconType="line"
              />
            )}

            <Line
              type="monotone"
              dataKey="current"
              name={currentLabel}
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7, fill: "#3b82f6" }}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
            />

            <Line
              type="monotone"
              dataKey="previous"
              name={previousLabel}
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#8b5cf6", r: 4 }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
