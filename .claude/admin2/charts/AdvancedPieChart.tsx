"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface AdvancedPieChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentage?: boolean;
  animate?: boolean;
  onSegmentClick?: (data: DataPoint) => void;
  className?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#14b8a6", // teal
];

export function AdvancedPieChart({
  data,
  height = 400,
  innerRadius = 0,
  outerRadius = 120,
  showLegend = true,
  showLabels = true,
  showPercentage = true,
  animate = true,
  onSegmentClick,
  className = "",
}: AdvancedPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for percentages
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // Assign colors if not provided
  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    color: entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="drop-shadow-lg"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
          opacity={0.3}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="white"
          className="text-base font-semibold"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.8)"
          className="text-sm"
        >
          {value.toLocaleString()}
        </text>
        {showPercentage && (
          <text
            x={cx}
            y={cy + 30}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.6)"
            className="text-xs"
          >
            {`${(percent * 100).toFixed(1)}%`}
          </text>
        )}
      </g>
    );
  };

  const renderLabel = (entry: any) => {
    const percent = (entry.value / total) * 100;
    if (percent < 5) return null; // Hide labels for small slices

    return showPercentage
      ? `${entry.name} (${percent.toFixed(1)}%)`
      : entry.name;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = (data.value / total) * 100;

      return (
        <div className="bg-black/90 backdrop-blur-lg border border-white/[0.1] rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-white font-medium">{data.name}</span>
          </div>
          <div className="text-white/80 text-sm">
            Value: {data.value.toLocaleString()}
          </div>
          <div className="text-white/60 text-xs">
            {percent.toFixed(2)}% of total
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {payload.map((entry: any, index: number) => {
          const percent = (entry.payload.value / total) * 100;
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-all cursor-pointer"
              onClick={() => {
                if (onSegmentClick) {
                  onSegmentClick(entry.payload);
                }
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex flex-col">
                <span className="text-white text-sm">{entry.value}</span>
                <span className="text-white/60 text-xs">
                  {entry.payload.value.toLocaleString()} ({percent.toFixed(1)}
                  %)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleClick = (data: any, index: number) => {
    if (onSegmentClick) {
      onSegmentClick(data);
    }
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            activeIndex={activeIndex !== null ? activeIndex : undefined}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={handleClick}
            label={showLabels ? renderLabel : false}
            labelLine={
              showLabels
                ? { stroke: "rgba(255, 255, 255, 0.3)", strokeWidth: 1 }
                : false
            }
            animationDuration={animate ? 800 : 0}
            animationEasing="ease-out"
            className={onSegmentClick ? "cursor-pointer" : ""}
          >
            {dataWithColors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
