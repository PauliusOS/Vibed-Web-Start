"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCountAnimation } from "@/hooks/useCountAnimation";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

interface GlassMetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  delay?: number;
  compact?: boolean;
}

export function GlassMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  delay = 0,
  compact = false,
}: GlassMetricCardProps) {
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const { value: animatedValue } = useCountAnimation(numericValue, { duration: 1500 });
  const displayValue = typeof value === "string" && value.includes("%")
    ? `${animatedValue.toFixed(2)}%`
    : formatNumber(Math.round(animatedValue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      {/* Hover glow - Blue theme */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

      <div className={cn(
        "relative rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all",
        compact ? "p-4" : "p-6"
      )}>
        <div className={cn("flex items-start justify-between", compact ? "mb-2" : "mb-4")}>
          <div className={cn("p-2.5 rounded-lg", iconColor.replace("text-", "bg-").replace("-400", "-500/10"))}>
            <Icon className={cn(compact ? "h-4 w-4" : "h-5 w-5", iconColor)} />
          </div>
        </div>
        <div>
          <p className={cn("font-bold text-white tracking-tight mb-1", compact ? "text-2xl" : "text-3xl")}>
            {displayValue}
          </p>
          <p className={cn("text-white/50", compact ? "text-xs" : "text-sm")}>{title}</p>
          <p className={cn("text-white/30 mt-1", compact ? "text-[10px]" : "text-xs")}>{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function MetricCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl bg-white/[0.02] border border-white/[0.06] animate-pulse",
      compact ? "p-4" : "p-6"
    )}>
      <div className={cn("flex items-start justify-between", compact ? "mb-2" : "mb-4")}>
        <div className={cn("rounded-lg bg-white/[0.06]", compact ? "h-8 w-8" : "h-10 w-10")} />
      </div>
      <div className="space-y-2">
        <div className={cn("rounded bg-white/[0.06]", compact ? "h-6 w-20" : "h-8 w-24")} />
        <div className={cn("rounded bg-white/[0.06]", compact ? "h-3 w-24" : "h-4 w-32")} />
        <div className={cn("rounded bg-white/[0.06]", compact ? "h-2 w-16" : "h-3 w-20")} />
      </div>
    </div>
  );
}
