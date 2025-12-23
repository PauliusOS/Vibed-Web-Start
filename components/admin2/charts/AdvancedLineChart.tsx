"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
  strokeWidth?: number;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisKey: string;
  height?: number;
  showBrush?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  className?: string;
}

export function AdvancedLineChart({
  data,
  lines,
  xAxisKey,
  height = 400,
  showBrush = true,
  showGrid = true,
  showLegend = true,
  animate = true,
  className = "",
}: AdvancedLineChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const toggleLine = (dataKey: string) => {
    const newHidden = new Set(hiddenLines);
    if (newHidden.has(dataKey)) {
      newHidden.delete(dataKey);
    } else {
      newHidden.add(dataKey);
    }
    setHiddenLines(newHidden);
  };

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
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenLines.has(entry.dataKey);
          return (
            <button
              key={index}
              onClick={() => toggleLine(entry.dataKey)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                isHidden
                  ? "opacity-40 bg-white/[0.02]"
                  : "opacity-100 bg-white/[0.05] hover:bg-white/[0.08]"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
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
        <LineChart
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

          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6, fill: line.color }}
              hide={hiddenLines.has(line.dataKey)}
              animationDuration={animate ? 1000 : 0}
              animationEasing="ease-in-out"
            />
          ))}

          {showBrush && (
            <Brush
              dataKey={xAxisKey}
              height={30}
              stroke="rgba(255, 255, 255, 0.2)"
              fill="rgba(255, 255, 255, 0.02)"
              travellerWidth={10}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
