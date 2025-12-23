"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "highlight" | "accent";
}

export function MetricCard({
  label,
  value,
  subValue,
  icon,
  trend,
  isLoading = false,
  className,
  size = "md",
  variant = "default",
}: MetricCardProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const valueSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const variantClasses = {
    default: "bg-[#141414] border-white/[0.08]",
    highlight: "bg-gradient-to-br from-[#1a1a2e] to-[#141414] border-blue-500/20",
    accent: "bg-gradient-to-br from-blue-500/10 to-[#141414] border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative group rounded-xl border overflow-hidden",
        "hover:border-white/[0.15] transition-all duration-300",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header with label and icon */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
            {label}
          </p>
          {icon && (
            <div className="text-white/30 group-hover:text-blue-400/60 transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        {isLoading ? (
          <Skeleton className="h-8 w-20 bg-white/10" />
        ) : (
          <motion.p
            className={cn(
              "font-semibold text-white tracking-tight",
              valueSizes[size]
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.p>
        )}

        {/* Sub value and trend */}
        <div className="flex items-center gap-2 mt-1.5">
          {subValue && (
            <p className="text-[12px] text-white/40">{subValue}</p>
          )}
          {trend && (
            <span
              className={cn(
                "text-[11px] font-medium px-1.5 py-0.5 rounded",
                trend.isPositive
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-red-400 bg-red-400/10"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Large hero metric for dashboard
export function HeroMetric({
  label,
  value,
  subValue,
  icon,
  isLoading = false,
  className,
}: Omit<MetricCardProps, "size" | "variant">) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative group rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-[#1a1a2e] via-[#141420] to-[#0a0a0a]",
        "border border-blue-500/20 p-8",
        className
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-x" />

      {/* Glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12px] uppercase tracking-wider text-white/50 font-medium">
            {label}
          </p>
          {icon && (
            <div className="text-blue-400/60">{icon}</div>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-12 w-32 bg-white/10" />
        ) : (
          <p className="text-5xl font-bold text-white tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        )}

        {subValue && (
          <p className="text-[13px] text-white/40 mt-2">{subValue}</p>
        )}
      </div>
    </motion.div>
  );
}
