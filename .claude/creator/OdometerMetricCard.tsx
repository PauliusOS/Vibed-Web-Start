"use client";

import { memo } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OdometerMetricCardProps {
  label: string;
  value: number;
  format: "compact" | "currency" | "percentage" | "duration";
  icon?: LucideIcon;
  isLive?: boolean; // Shows pulsing indicator
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  isLoading?: boolean;
  delay?: number;
  className?: string;
}

function OdometerMetricCardSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 p-6 rounded-xl bg-black border border-white/[0.04] backdrop-blur-[20px]">
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-24 rounded bg-white/[0.06] animate-pulse" />
        {/* Icon skeleton */}
        <div className="h-4 w-4 rounded bg-white/[0.06] animate-pulse" />
      </div>
      <div className="h-9 w-20 rounded bg-white/[0.06] animate-pulse" />
    </div>
  );
}

export const OdometerMetricCard = memo(function OdometerMetricCard({
  label,
  value,
  format,
  icon: Icon,
  isLive = false,
  trend,
  trendValue,
  isLoading = false,
  delay = 0,
  className,
}: OdometerMetricCardProps) {
  if (isLoading) {
    return <OdometerMetricCardSkeleton />;
  }

  // Format configuration for NumberFlow
  const getFormatOptions = () => {
    switch (format) {
      case "compact":
        return {
          notation: "compact" as const,
          compactDisplay: "short" as const,
          maximumFractionDigits: 1,
        };
      case "currency":
        return {
          style: "currency" as const,
          currency: "USD",
          notation: "compact" as const,
          compactDisplay: "short" as const,
          maximumFractionDigits: 1,
        };
      case "percentage":
        return {
          style: "percent" as const,
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        };
      default:
        return {};
    }
  };

  // Convert percentage to decimal for NumberFlow (4.2% -> 0.042)
  const displayValue = format === "percentage" ? value / 100 : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative group",
        "flex flex-col gap-4 p-6",
        "bg-black border border-white/[0.04]",
        "backdrop-blur-[20px]",
        "hover:bg-white/[0.02] hover:border-white/[0.06]",
        "hover:-translate-y-1",
        "transition-all duration-300",
        className
      )}
    >
      {/* Shine effect on top edge (appears on hover) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Label and Icon Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/40 tracking-wide">{label}</span>

          {/* Live indicator (pulsing dot) */}
          {isLive && (
            <motion.div
              className="relative flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <div className="absolute h-2 w-2 rounded-full bg-blue-400/50 animate-ping" />
            </motion.div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <Icon className="h-4 w-4 text-blue-400/60 group-hover:text-blue-400 transition-colors" />
        )}
      </div>

      {/* Odometer Number */}
      <div className="flex items-baseline gap-2">
        <NumberFlow
          value={displayValue}
          format={getFormatOptions()}
          animated={true}
          className="text-4xl font-semibold text-white leading-none tracking-tighter"
          transformTiming={{
            duration: 800,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Trend indicator */}
        {trend && trendValue !== undefined && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              trend === "up" && "text-emerald-400 bg-emerald-400/10",
              trend === "down" && "text-red-400 bg-red-400/10",
              trend === "neutral" && "text-white/40 bg-white/5"
            )}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {Math.abs(trendValue).toFixed(1)}%
          </motion.span>
        )}
      </div>

      {/* Bottom glow effect (subtle) */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
});

OdometerMetricCard.displayName = "OdometerMetricCard";
