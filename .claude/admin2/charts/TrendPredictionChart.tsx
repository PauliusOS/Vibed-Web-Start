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
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { motion } from "motion/react";
import { TrendingUp, AlertCircle } from "lucide-react";

interface DataPoint {
  [key: string]: string | number;
}

interface PredictionPoint extends DataPoint {
  isPrediction?: boolean;
  confidence?: {
    low: number;
    high: number;
  };
}

interface TrendPredictionChartProps {
  historicalData: DataPoint[];
  predictionData: PredictionPoint[];
  xAxisKey: string;
  dataKey: string;
  predictionLabel?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showConfidenceInterval?: boolean;
  animate?: boolean;
  className?: string;
}

export function TrendPredictionChart({
  historicalData,
  predictionData,
  xAxisKey,
  dataKey,
  predictionLabel = "Forecast",
  height = 400,
  showGrid = true,
  showLegend = true,
  showConfidenceInterval = true,
  animate = true,
  className = "",
}: TrendPredictionChartProps) {
  // Merge historical and prediction data
  const mergedData = [
    ...historicalData.map((d) => ({ ...d, isPrediction: false })),
    ...predictionData.map((d) => ({ ...d, isPrediction: true })),
  ];

  // Calculate trend direction
  const lastHistorical =
    historicalData[historicalData.length - 1]?.[dataKey] || 0;
  const lastPrediction =
    predictionData[predictionData.length - 1]?.[dataKey] || 0;
  const trendChange =
    typeof lastHistorical === "number" && typeof lastPrediction === "number"
      ? ((lastPrediction - lastHistorical) / lastHistorical) * 100
      : 0;
  const isPositiveTrend = trendChange > 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isPrediction = dataPoint.isPrediction;

      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/[0.1] rounded-lg p-3 shadow-xl min-w-[180px]">
          <p className="text-white font-medium mb-2">{label}</p>

          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-white/80 text-sm">
              {isPrediction ? predictionLabel : "Actual"}:
            </span>
            <span className="text-white font-semibold text-sm">
              {typeof dataPoint[dataKey] === "number"
                ? dataPoint[dataKey].toLocaleString()
                : dataPoint[dataKey]}
            </span>
          </div>

          {isPrediction && dataPoint.confidence && showConfidenceInterval && (
            <div className="mt-2 pt-2 border-t border-white/[0.1]">
              <div className="text-xs text-white/60 mb-1">
                Confidence Interval:
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Range:</span>
                <span className="text-white">
                  {dataPoint.confidence.low.toLocaleString()} -{" "}
                  {dataPoint.confidence.high.toLocaleString()}
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
      <motion.div
        initial={animate ? { opacity: 0, y: -10 } : {}}
        animate={animate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05]">
            <TrendingUp
              className={`w-4 h-4 ${isPositiveTrend ? "text-green-400" : "text-red-400"}`}
            />
            <span className="text-white text-sm">Predicted Trend:</span>
            <span
              className={`font-semibold ${isPositiveTrend ? "text-green-400" : "text-red-400"}`}
            >
              {isPositiveTrend ? "+" : ""}
              {trendChange.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <AlertCircle className="w-4 h-4" />
          <span>Forecast based on historical trends</span>
        </div>
      </motion.div>

      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : {}}
        animate={animate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
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
                iconType="line"
              />
            )}

            {/* Confidence interval area */}
            {showConfidenceInterval && (
              <Area
                type="monotone"
                dataKey={(data: any) =>
                  data.isPrediction && data.confidence
                    ? [data.confidence.low, data.confidence.high]
                    : null
                }
                fill="#8b5cf6"
                fillOpacity={0.1}
                stroke="none"
                animationDuration={animate ? 1000 : 0}
              />
            )}

            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey={(data: any) => (!data.isPrediction ? data[dataKey] : null)}
              name="Historical"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7, fill: "#3b82f6" }}
              connectNulls={false}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
            />

            {/* Prediction line */}
            <Line
              type="monotone"
              dataKey={(data: any) => (data.isPrediction ? data[dataKey] : null)}
              name={predictionLabel}
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "#8b5cf6" }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
              connectNulls={false}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
            />

            {/* Dividing line between historical and prediction */}
            <ReferenceLine
              x={historicalData[historicalData.length - 1]?.[xAxisKey]}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {showConfidenceInterval && (
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-400" />
              <span className="text-white/60">Historical Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-purple-400" />
              <span className="text-white/60">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-purple-400/20 border border-purple-400/30 rounded" />
              <span className="text-white/60">Confidence Interval</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
