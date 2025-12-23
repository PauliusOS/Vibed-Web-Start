"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InteractiveMetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  indicatorColor: string;
  isActive?: boolean;
  onToggle?: () => void;
  isLive?: boolean;
  delay?: number;
  className?: string;
}

/**
 * InteractiveMetricCard - Clean Framer-style metric card with toggleable chart visibility
 *
 * Features:
 * - Minimal design matching Framer Analytics aesthetic
 * - Colored indicator dot that matches chart line color
 * - Click to toggle metric visibility in associated chart
 * - Optional pulsing animation for live metrics
 * - Dimmed appearance when inactive
 */
export function InteractiveMetricCard({
  label,
  value,
  suffix,
  indicatorColor,
  isActive = true,
  onToggle,
  isLive = false,
  delay = 0,
  className,
}: InteractiveMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onToggle}
      className={cn(
        "flex flex-col gap-1 p-4 rounded-xl select-none",
        "bg-white/[0.02] border border-white/[0.06]",
        "hover:bg-white/[0.04] hover:border-white/[0.10]",
        "transition-all duration-300",
        onToggle && "cursor-pointer",
        !isActive && "opacity-40",
        className
      )}
    >
      {/* Label with indicator dot */}
      <div className="flex items-center gap-2">
        {/* Indicator dot */}
        <span className="relative flex h-2.5 w-2.5">
          {isLive && isActive ? (
            <>
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: indicatorColor }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: indicatorColor }}
              />
            </>
          ) : (
            <span
              className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5 transition-opacity duration-300",
                !isActive && "opacity-40"
              )}
              style={{ backgroundColor: indicatorColor }}
            />
          )}
        </span>
        <span className="text-xs text-white/40 font-normal tracking-wide">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {suffix && (
          <span className="text-sm text-white/40 font-normal ml-0.5">
            {suffix}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Pre-defined color constants for metric cards - Blue-only theme
 * Following Framer Analytics style
 */
export const METRIC_COLORS = {
  sky: "#38bdf8",      // sky-400 - Lightest blue
  light: "#60a5fa",    // blue-400 - Light blue
  primary: "#3b82f6",  // blue-500 - Primary blue
  standard: "#2563eb", // blue-600 - Standard blue
  dark: "#1d4ed8",     // blue-700 - Dark blue
  deep: "#1e40af",     // blue-800 - Deepest blue
  // Legacy mappings for backwards compatibility
  cyan: "#38bdf8",
  blue: "#3b82f6",
  emerald: "#3b82f6",  // Map to primary blue
  amber: "#60a5fa",    // Map to light blue
  red: "#ef4444",      // Keep for semantic error states
} as const;
