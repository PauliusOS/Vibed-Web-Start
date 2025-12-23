"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_LIVE_COLORS,
  FRAMER_TYPOGRAPHY,
} from "./constants/colors";
import { formatNumber, formatCompactNumber } from "./utils/formatters";

interface MetricItem {
  label: string;
  value: number | string;
  isLive?: boolean;
  suffix?: string;
  prefix?: string;
  compact?: boolean;
}

interface FramerMetricsProps {
  metrics: MetricItem[];
  className?: string;
  animate?: boolean;
}

/**
 * FramerMetrics - Horizontal metrics row matching Framer's style
 *
 * Features:
 * - Live indicator with pulsing green dot
 * - Inter font with exact Framer weights
 * - Animated number transitions
 */
export function FramerMetrics({
  metrics,
  className,
  animate = true,
}: FramerMetricsProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-wrap items-start justify-between gap-4 sm:gap-6", className)}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col gap-1"
        >
          {/* Label with optional live indicator */}
          <div className="flex items-center gap-2">
            {metric.isLive && (
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "rgba(25, 125, 255, 0.5)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "rgb(25, 125, 255)" }}
                />
              </span>
            )}
            <span
              className="text-xs font-medium"
              style={{
                color: FRAMER_TEXT_COLORS.primary,
                fontFamily: FRAMER_TYPOGRAPHY.body,
                fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                fontSize: FRAMER_TYPOGRAPHY.sizes.label,
              }}
            >
              {metric.label}
            </span>
          </div>

          {/* Value */}
          <span
            className="font-semibold"
            style={{
              color: FRAMER_TEXT_COLORS.primary,
              fontFamily: FRAMER_TYPOGRAPHY.body,
              fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
              fontSize: FRAMER_TYPOGRAPHY.sizes.h6,
            }}
          >
            {metric.prefix}
            {typeof metric.value === "number"
              ? metric.compact
                ? formatCompactNumber(metric.value)
                : formatNumber(metric.value)
              : metric.value}
            {metric.suffix}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Single metric card for grid layouts
 */
interface FramerMetricCardProps {
  label: string;
  value: number | string;
  isLive?: boolean;
  suffix?: string;
  prefix?: string;
  compact?: boolean;
  className?: string;
  delay?: number;
}

export function FramerMetricCard({
  label,
  value,
  isLive,
  suffix,
  prefix,
  compact,
  className,
  delay = 0,
}: FramerMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "flex flex-col gap-1 p-4 rounded-lg border",
        className
      )}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Label with optional live indicator */}
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: FRAMER_LIVE_COLORS.pulse }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: FRAMER_LIVE_COLORS.dot }}
            />
          </span>
        )}
        <span
          className="text-xs font-medium"
          style={{
            color: FRAMER_TEXT_COLORS.secondary,
            fontFamily: FRAMER_TYPOGRAPHY.body,
            fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
            fontSize: FRAMER_TYPOGRAPHY.sizes.label,
          }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <span
        className="font-semibold"
        style={{
          color: FRAMER_TEXT_COLORS.primary,
          fontFamily: FRAMER_TYPOGRAPHY.body,
          fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
          fontSize: FRAMER_TYPOGRAPHY.sizes.h6,
        }}
      >
        {prefix}
        {typeof value === "number"
          ? compact
            ? formatCompactNumber(value)
            : formatNumber(value)
          : value}
        {suffix}
      </span>
    </motion.div>
  );
}

export default FramerMetrics;
