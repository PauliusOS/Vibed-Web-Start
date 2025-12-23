"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  [key: string]: string | number;
}

interface AxisConfig {
  dataKey: string;
  name: string;
  color: string;
  yAxisId: "left" | "right";
  type?: "line" | "bar";
  strokeWidth?: number;
}

interface MultiAxisChartProps {
  data: DataPoint[];
  series: AxisConfig[];
  xAxisKey: string;
  leftAxisLabel?: string;
  rightAxisLabel?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  className?: string;
}

export function MultiAxisChart({
  data,
  series,
  xAxisKey,
  leftAxisLabel,
  rightAxisLabel,
  height = 400,
  showGrid = true,
  showLegend = true,
  animate = true,
  className = "",
}: MultiAxisChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/[0.1] rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80">{entry.name}:</span>
              <span className="text-white font-semibold">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.05]"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm">{entry.value}</span>
            <span className="text-white/40 text-xs ml-1">
              ({entry.payload.yAxisId === "left" ? leftAxisLabel || "Left" : rightAxisLabel || "Right"})
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
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

          {/* Left Y Axis */}
          <YAxis
            yAxisId="left"
            stroke="rgba(255, 255, 255, 0.4)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
            tickFormatter={formatYAxis}
            label={
              leftAxisLabel
                ? {
                    value: leftAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 },
                  }
                : undefined
            }
          />

          {/* Right Y Axis */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="rgba(255, 255, 255, 0.4)"
            tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
            tickFormatter={formatYAxis}
            label={
              rightAxisLabel
                ? {
                    value: rightAxisLabel,
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "rgba(255, 255, 255, 0.6)", fontSize: 12 },
                  }
                : undefined
            }
          />

          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}

          {/* Render series based on type */}
          {series.map((config) => {
            if (config.type === "bar") {
              return (
                <Bar
                  key={config.dataKey}
                  dataKey={config.dataKey}
                  name={config.name}
                  fill={config.color}
                  yAxisId={config.yAxisId}
                  animationDuration={animate ? 1000 : 0}
                  animationEasing="ease-in-out"
                  radius={[4, 4, 0, 0]}
                />
              );
            }

            return (
              <Line
                key={config.dataKey}
                type="monotone"
                dataKey={config.dataKey}
                name={config.name}
                stroke={config.color}
                strokeWidth={config.strokeWidth || 2}
                yAxisId={config.yAxisId}
                dot={{ fill: config.color, r: 4 }}
                activeDot={{ r: 6, fill: config.color }}
                animationDuration={animate ? 1000 : 0}
                animationEasing="ease-in-out"
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
