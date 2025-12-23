"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FramerChart } from "./FramerChart";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
  FRAMER_CHART_COLORS,
} from "./constants/colors";
import { formatCompactNumber } from "./utils/formatters";
import type { DataPoint } from "./types";

export interface SummaryMetric {
  label: string;
  value: number | string;
  previousValue?: number | string;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  icon?: React.ReactNode;
}

export interface AnalyticsSummaryCardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  period?: string;
  /** Percentage change vs last period (e.g., 15 for "+15%") */
  periodChange?: number;
  metrics?: SummaryMetric[];
  chartData?: DataPoint[];
  showChart?: boolean;
  /** Highlight color theme */
  theme?: "blue" | "green" | "purple" | "orange";
}

const THEME_COLORS = {
  blue: {
    primary: "rgb(25, 125, 255)",
    bg: "rgba(25, 125, 255, 0.1)",
    border: "rgba(25, 125, 255, 0.2)",
    glow: "rgba(25, 125, 255, 0.15)",
  },
  green: {
    primary: "rgb(34, 197, 94)",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.2)",
    glow: "rgba(34, 197, 94, 0.15)",
  },
  purple: {
    primary: "rgb(168, 85, 247)",
    bg: "rgba(168, 85, 247, 0.1)",
    border: "rgba(168, 85, 247, 0.2)",
    glow: "rgba(168, 85, 247, 0.15)",
  },
  orange: {
    primary: "rgb(249, 115, 22)",
    bg: "rgba(249, 115, 22, 0.1)",
    border: "rgba(249, 115, 22, 0.2)",
    glow: "rgba(249, 115, 22, 0.15)",
  },
};

const gentleEase = [0.25, 0.1, 0.25, 1];

function calculateChange(current: number | string, previous: number | string | undefined): { value: number; direction: "up" | "down" | "neutral" } | null {
  if (previous === undefined) return null;
  const curr = typeof current === "number" ? current : parseFloat(current.replace(/[^0-9.-]/g, ""));
  const prev = typeof previous === "number" ? previous : parseFloat(previous.replace(/[^0-9.-]/g, ""));
  if (isNaN(curr) || isNaN(prev) || prev === 0) return null;
  const change = ((curr - prev) / prev) * 100;
  return {
    value: Math.abs(Math.round(change)),
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
}

/**
 * AnalyticsSummaryCard - Comprehensive analytics summary display
 * 
 * Features:
 * - Multiple metrics with change indicators
 * - Optional mini chart
 * - Theme color customization
 * - Period indicator
 */
export function AnalyticsSummaryCard({
  className,
  title = "Analytics Summary",
  subtitle,
  period = "Last 30 days",
  periodChange = 12,
  metrics = [],
  chartData,
  showChart = true,
  theme = "blue",
}: AnalyticsSummaryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const colors = THEME_COLORS[theme];

  // Default metrics if none provided
  const displayMetrics = metrics.length > 0 ? metrics : [
    { label: "Total Views", value: 2450000, previousValue: 2100000, compact: true },
    { label: "Engagement Rate", value: "4.8%", previousValue: "4.2%" },
    { label: "Avg. CPM", value: "$4.25", previousValue: "$4.50" },
    { label: "Total Spend", value: 45000, previousValue: 38000, prefix: "$", compact: true },
  ];

  // Calculate totals for hero stat
  const heroStat = useMemo(() => {
    const viewsMetric = displayMetrics.find(m => m.label.toLowerCase().includes("view"));
    if (viewsMetric && typeof viewsMetric.value === "number") {
      return {
        value: viewsMetric.value,
        change: calculateChange(viewsMetric.value, viewsMetric.previousValue),
      };
    }
    return null;
  }, [displayMetrics]);

  return (
    <motion.div
      className={cn(
        "relative border backdrop-blur-xl overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(145deg, rgba(10, 10, 14, 0.95) 0%, rgba(5, 8, 12, 0.92) 50%, rgba(8, 5, 14, 0.95) 100%)",
        borderColor: isHovered ? colors.border : `${colors.primary}20`,
        boxShadow: isHovered 
          ? `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}` 
          : `0 0 20px ${colors.glow}`,
        transition: "border-color 0.5s ease, box-shadow 0.6s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: gentleEase }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3
              className="font-semibold"
              style={{
                color: FRAMER_TEXT_COLORS.primary,
                fontFamily: FRAMER_TYPOGRAPHY.body,
                fontSize: "16px",
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm mt-0.5" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                {subtitle}
              </p>
            )}
          </div>
          {/* Period Badge */}
          <span
            className="px-2.5 py-1 text-xs font-medium rounded-full"
            style={{
              color: colors.primary,
              backgroundColor: colors.bg,
            }}
          >
            {period}
          </span>
        </div>
      </div>

      {/* Hero Stat */}
      {heroStat && (
        <div className="px-6 pb-4">
          <div className="flex items-end gap-3">
            <motion.span
              className="text-4xl font-bold tabular-nums"
              style={{ color: colors.primary }}
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatCompactNumber(heroStat.value)}
            </motion.span>
            {heroStat.change && (
              <span
                className="text-sm font-medium mb-1 flex items-center gap-0.5"
                style={{
                  color: heroStat.change.direction === "up" 
                    ? "rgb(34, 197, 94)" 
                    : heroStat.change.direction === "down" 
                    ? "rgb(239, 68, 68)" 
                    : FRAMER_TEXT_COLORS.muted,
                }}
              >
                {heroStat.change.direction === "up" && "↑"}
                {heroStat.change.direction === "down" && "↓"}
                {heroStat.change.value}%
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            Total Views
          </p>
        </div>
      )}

      {/* Mini Chart */}
      {showChart && chartData && chartData.length > 0 && (
        <div className="px-6 pb-4">
          <motion.div
            className="rounded-lg overflow-hidden p-3"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
            animate={{ opacity: isHovered ? 1 : 0.9 }}
          >
            <FramerChart
              data={chartData}
              height={100}
              showGrid={false}
              showYAxis={false}
              showXAxis={false}
            />
          </motion.div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {displayMetrics.slice(0, 4).map((metric, index) => {
            const change = calculateChange(metric.value, metric.previousValue);
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: gentleEase }}
                className="p-3 rounded-lg cursor-default"
                style={{
                  backgroundColor: hoveredMetric === index 
                    ? colors.bg 
                    : "rgba(255, 255, 255, 0.02)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: hoveredMetric === index 
                    ? colors.border 
                    : "transparent",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={() => setHoveredMetric(index)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {metric.icon && (
                    <span style={{ color: FRAMER_TEXT_COLORS.muted }}>
                      {metric.icon}
                    </span>
                  )}
                  <span
                    className="text-xs"
                    style={{ color: FRAMER_TEXT_COLORS.muted }}
                  >
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-lg font-semibold"
                    style={{
                      color: hoveredMetric === index ? colors.primary : FRAMER_TEXT_COLORS.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {metric.prefix}
                    {typeof metric.value === "number"
                      ? metric.compact
                        ? formatCompactNumber(metric.value)
                        : metric.value.toLocaleString()
                      : metric.value}
                    {metric.suffix}
                  </span>
                  {change && (
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: change.direction === "up" 
                          ? "rgb(34, 197, 94)" 
                          : change.direction === "down" 
                          ? "rgb(239, 68, 68)" 
                          : FRAMER_TEXT_COLORS.muted,
                      }}
                    >
                      {change.direction === "up" && "↑"}
                      {change.direction === "down" && "↓"}
                      {change.value}%
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer - Quick Stats */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{ 
          borderColor: "rgba(255, 255, 255, 0.06)",
          backgroundColor: "rgba(0, 0, 0, 0.2)"
        }}
      >
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgb(34, 197, 94)" }}
            />
            <span style={{ color: FRAMER_TEXT_COLORS.secondary }}>
              {periodChange >= 0 ? "+" : ""}{periodChange}% vs last period
            </span>
          </div>
        </div>
        <motion.button
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: colors.primary }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          View Full Report
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default AnalyticsSummaryCard;
