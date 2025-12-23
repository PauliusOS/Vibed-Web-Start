"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  [key: string]: string | number;
}

interface BarConfig {
  dataKey: string;
  color: string;
  name: string;
  stackId?: string;
}

interface AdvancedBarChartProps {
  data: DataPoint[];
  bars: BarConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  stacked?: boolean;
  onBarClick?: (data: any) => void;
  className?: string;
}

export function AdvancedBarChart({
  data,
  bars,
  xAxisKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  animate = true,
  stacked = false,
  onBarClick,
  className = "",
}: AdvancedBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hiddenBars, setHiddenBars] = useState<Set<string>>(new Set());

  const toggleBar = (dataKey: string) => {
    const newHidden = new Set(hiddenBars);
    if (newHidden.has(dataKey)) {
      newHidden.delete(dataKey);
    } else {
      newHidden.add(dataKey);
    }
    setHiddenBars(newHidden);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/[0.1] rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
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
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenBars.has(entry.dataKey);
          return (
            <button
              key={index}
              onClick={() => toggleBar(entry.dataKey)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                isHidden
                  ? "opacity-40 bg-white/[0.02]"
                  : "opacity-100 bg-white/[0.05] hover:bg-white/[0.08]"
              }`}
            >
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white text-sm">{entry.value}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
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
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toLocaleString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}

          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId={stacked ? (bar.stackId || "stack") : undefined}
              hide={hiddenBars.has(bar.dataKey)}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
              onClick={onBarClick}
              onMouseEnter={() => setHoveredBar(bar.dataKey)}
              onMouseLeave={() => setHoveredBar(null)}
              radius={[4, 4, 0, 0]}
              className={onBarClick ? "cursor-pointer" : ""}
            >
              {!stacked &&
                data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={bar.color}
                    opacity={
                      hoveredBar === null || hoveredBar === bar.dataKey
                        ? 1
                        : 0.5
                    }
                  />
                ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
