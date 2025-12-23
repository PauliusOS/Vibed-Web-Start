"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowMetricCard } from "./GlowMetricCard";

interface MetricItem {
  label: string;
  value: string | number;
  isLive?: boolean;
  suffix?: string;
  metricKey?: string;
  icon?: LucideIcon;
  glowColor?: "blue" | "cyan" | "purple" | "green";
}

interface FramerMetricsRowProps {
  metrics: MetricItem[];
  variant?: "default" | "glow";
  glowIntensity?: "low" | "medium" | "high";
  animateValues?: boolean;
  className?: string;
}

/**
 * FramerMetricsRow - A clean horizontal metrics row inspired by Framer Analytics
 *
 * Features:
 * - Clean dark theme with pure black background
 * - Minimal spacing and typography
 * - Live indicator dots for real-time metrics
 * - Smooth entrance animations
 */
export function FramerMetricsRow({
  metrics,
  variant = "default",
  glowIntensity = "medium",
  animateValues = true,
  className,
}: FramerMetricsRowProps) {
  // Glow variant - use GlowMetricCard components
  if (variant === "glow") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6",
          className
        )}
      >
        {metrics.map((metric, index) => (
          <GlowMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            suffix={metric.suffix}
            icon={metric.icon}
            glowColor={metric.glowColor}
            glowIntensity={glowIntensity}
            isLive={metric.isLive}
            delay={index * 0.08}
            animateValue={animateValues}
          />
        ))}
      </div>
    );
  }

  // Default variant - original implementation
  return (
    <div
      className={cn(
        "flex items-center gap-12 lg:gap-16 py-4",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col gap-1 min-w-fit"
        >
          {/* Label with optional live indicator */}
          <div className="flex items-center gap-2">
            {metric.isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
            <span className="text-sm text-white/40 font-medium tracking-wide">
              {metric.label}
            </span>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl lg:text-4xl font-semibold text-white tracking-tighter leading-none">
              {typeof metric.value === "number"
                ? metric.value.toLocaleString()
                : metric.value}
            </span>
            {metric.suffix && (
              <span className="text-sm text-white/40 font-normal ml-0.5">
                {metric.suffix}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * FramerMetricCard - A single metric card variant for grid layouts
 */
interface FramerMetricCardProps {
  label: string;
  value: string | number;
  isLive?: boolean;
  suffix?: string;
  className?: string;
  delay?: number;
}

export function FramerMetricCard({
  label,
  value,
  isLive,
  suffix,
  className,
  delay = 0,
}: FramerMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "flex flex-col gap-1 p-4 rounded-xl",
        "bg-white/[0.02] border border-white/[0.06]",
        "hover:bg-white/[0.04] hover:border-white/[0.08]",
        "transition-all duration-300",
        className
      )}
    >
      {/* Label with optional live indicator */}
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
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
