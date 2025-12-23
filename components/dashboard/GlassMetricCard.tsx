"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SparklineProps {
  data: number[];
  color?: "sky" | "light" | "blue" | "dark" | "cyan" | "emerald" | "amber"; // Blue-only theme with legacy support
  height?: number;
}

const Sparkline = ({ data, color = "blue", height = 40 }: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const colorClasses = {
    // Blue-only theme colors
    sky: "bg-sky-400/40 hover:bg-sky-400/60",
    light: "bg-blue-400/40 hover:bg-blue-400/60",
    blue: "bg-blue-500/40 hover:bg-blue-500/60",
    dark: "bg-blue-600/40 hover:bg-blue-600/60",
    // Legacy mappings
    cyan: "bg-sky-400/40 hover:bg-sky-400/60",
    emerald: "bg-blue-500/40 hover:bg-blue-500/60",
    amber: "bg-blue-400/40 hover:bg-blue-400/60",
  };

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: `${height}px` }}
    >
      {data.map((value, index) => {
        const normalizedHeight = ((value - min) / range) * 100;
        const barHeight = Math.max(normalizedHeight, 10); // Minimum 10% height

        return (
          <motion.div
            key={index}
            className={cn(
              "flex-1 rounded-t-sm transition-colors duration-200",
              colorClasses[color]
            )}
            initial={{ height: 0 }}
            animate={{ height: `${barHeight}%` }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
};

interface GlassMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  iconColor?: "sky" | "light" | "blue" | "dark" | "cyan" | "emerald" | "amber" | "default";
  sparklineData?: number[];
  sparklineColor?: "sky" | "light" | "blue" | "dark" | "cyan" | "emerald" | "amber";
  className?: string;
  delay?: number;
}

const iconColorClasses = {
  // Blue-only theme colors
  sky: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  light: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  dark: "bg-blue-600/10 text-blue-500 border-blue-600/20",
  // Legacy mappings (map to blue variants)
  cyan: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  emerald: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  amber: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  default: "bg-white/[0.04] text-white/60 border-white/[0.06]",
};

const GlassMetricCard = React.forwardRef<HTMLDivElement, GlassMetricCardProps>(
  (
    {
      title,
      value,
      change,
      icon,
      iconColor = "default",
      sparklineData,
      sparklineColor = "cyan",
      className,
      delay = 0,
    },
    ref
  ) => {
    const trendIcon = {
      increase: <TrendingUp className="h-3 w-3" />,
      decrease: <TrendingDown className="h-3 w-3" />,
      neutral: <Minus className="h-3 w-3" />,
    };

    const trendColor = {
      increase: "text-emerald-400",
      decrease: "text-red-400",
      neutral: "text-white/40",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-metric-card group",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Top shine line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm text-white/50 font-medium truncate">
              {title}
            </p>

            {/* Value */}
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {value}
              </span>
            </motion.div>

            {/* Change indicator */}
            {change && (
              <motion.div
                className={cn(
                  "flex items-center gap-1 mt-2",
                  trendColor[change.type]
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.2 }}
              >
                {trendIcon[change.type]}
                <span className="text-xs font-medium">
                  {change.value > 0 ? "+" : ""}
                  {change.value}%
                </span>
                {change.label && (
                  <span className="text-xs text-white/40 ml-1">
                    {change.label}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Icon or Sparkline */}
          <div className="flex-shrink-0 ml-4">
            {sparklineData && sparklineData.length > 0 ? (
              <div className="w-20">
                <Sparkline
                  data={sparklineData}
                  color={sparklineColor}
                  height={40}
                />
              </div>
            ) : icon ? (
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg border",
                  iconColorClasses[iconColor]
                )}
              >
                {icon}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  }
);

GlassMetricCard.displayName = "GlassMetricCard";

// Skeleton loader for GlassMetricCard
const GlassMetricCardSkeleton = () => (
  <div className="glass-metric-card">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 w-24 glass-skeleton rounded" />
        <div className="h-8 w-32 glass-skeleton rounded mt-2" />
        <div className="h-3 w-16 glass-skeleton rounded mt-2" />
      </div>
      <div className="h-10 w-20 glass-skeleton rounded" />
    </div>
  </div>
);

export { GlassMetricCard, GlassMetricCardSkeleton, Sparkline };
