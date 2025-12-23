"use client";

import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/ui/tilt-card";
import { CountAnimation } from "@/components/ui/count-animation";
import { SparklineChart } from "./SparklineChart";
import Link from "next/link";

interface EnhancedMetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  sparklineData?: number[];
  colorScheme?: "cyan" | "blue" | "green" | "orange" | "red";
  href?: string;
  onClick?: () => void;
  delay?: number;
}

const colorConfig = {
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    sparkline: "#38bdf8",
    gradient: "from-cyan-500/5 to-transparent",
  },
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    glow: "shadow-blue-500/20",
    sparkline: "#3b82f6",
    gradient: "from-blue-500/5 to-transparent",
  },
  green: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    sparkline: "#10b981",
    gradient: "from-emerald-500/5 to-transparent",
  },
  orange: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    glow: "shadow-amber-500/20",
    sparkline: "#f59e0b",
    gradient: "from-amber-500/5 to-transparent",
  },
  red: {
    iconBg: "bg-red-500/10",
    iconText: "text-red-400",
    glow: "shadow-red-500/20",
    sparkline: "#ef4444",
    gradient: "from-red-500/5 to-transparent",
  },
};

export function EnhancedMetricCard({
  title,
  value,
  prefix = "",
  suffix = "",
  subtitle,
  icon: Icon,
  trend,
  sparklineData,
  colorScheme = "cyan",
  href,
  onClick,
  delay = 0,
}: EnhancedMetricCardProps) {
  const colors = colorConfig[colorScheme];
  const uniqueId = `sparkline-${title.toLowerCase().replace(/\s/g, "-")}`;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <TiltCard
        className={cn(
          "w-full cursor-pointer",
          href && "group"
        )}
        tiltAmount={8}
        scale={1.02}
        onClick={onClick}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300",
            "hover:shadow-lg hover:border-border/80",
            `hover:${colors.glow}`
          )}
        >
          {/* Subtle gradient background */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              colors.gradient
            )}
          />

          <div className="relative z-10">
            {/* Header row with icon and trend */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  colors.iconBg,
                  "group-hover:scale-110"
                )}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon className={cn("h-6 w-6", colors.iconText)} />
              </motion.div>

              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay * 0.1 + 0.3 }}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg",
                    trend.isPositive
                      ? "text-green-500 bg-green-500/10"
                      : "text-red-500 bg-red-500/10"
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </h3>

            {/* Value with count animation */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-bold tracking-tight truncate">
                  <CountAnimation
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    duration={1.5}
                    delay={delay * 0.1}
                  />
                </p>

                {subtitle && (
                  <p className="text-xs text-muted-foreground/70 mt-1.5 truncate">
                    {subtitle}
                  </p>
                )}

                {trend?.label && (
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {trend.label}
                  </p>
                )}
              </div>

              {/* Sparkline chart */}
              {sparklineData && sparklineData.length > 0 && (
                <div className="w-24 h-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <SparklineChart
                    data={sparklineData}
                    color={colors.sparkline}
                    gradientId={uniqueId}
                  />
                </div>
              )}
            </div>

            {/* Link indicator */}
            {href && (
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -5 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
