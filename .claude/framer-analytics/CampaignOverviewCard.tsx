"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { FramerChart } from "./FramerChart";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
  FRAMER_CHART_COLORS,
} from "./constants/colors";
import { formatCompactNumber } from "./utils/formatters";
import type { DataPoint } from "./types";

export type CampaignStatus = "active" | "paused" | "completed" | "draft";

export interface CampaignMetric {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

export interface CampaignOverviewCardProps {
  /** Campaign name */
  name: string;
  /** Campaign status */
  status?: CampaignStatus;
  /** Campaign description or tagline */
  description?: string;
  /** Start date */
  startDate?: Date | string;
  /** End date */
  endDate?: Date | string;
  /** Campaign metrics to display */
  metrics?: CampaignMetric[];
  /** Chart data for mini performance chart */
  chartData?: DataPoint[];
  /** Show chart */
  showChart?: boolean;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Number of creators */
  creatorCount?: number;
  /** Number of posts/videos */
  postCount?: number;
  /** Budget info */
  budget?: {
    spent: number;
    total: number;
  };
  /** Additional className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bgColor: string; hoverBgColor: string }> = {
  active: {
    label: "Active",
    color: "rgb(34, 197, 94)",
    bgColor: "rgba(34, 197, 94, 0.15)",
    hoverBgColor: "rgba(34, 197, 94, 0.25)",
  },
  paused: {
    label: "Paused",
    color: "rgb(251, 191, 36)",
    bgColor: "rgba(251, 191, 36, 0.15)",
    hoverBgColor: "rgba(251, 191, 36, 0.25)",
  },
  completed: {
    label: "Completed",
    color: "rgb(99, 102, 241)",
    bgColor: "rgba(99, 102, 241, 0.15)",
    hoverBgColor: "rgba(99, 102, 241, 0.25)",
  },
  draft: {
    label: "Draft",
    color: "rgb(156, 163, 175)",
    bgColor: "rgba(156, 163, 175, 0.15)",
    hoverBgColor: "rgba(156, 163, 175, 0.25)",
  },
};

// Smooth easing curves
const smoothEase = [0.4, 0, 0.2, 1]; // Material Design standard easing
const gentleEase = [0.25, 0.1, 0.25, 1]; // Gentle ease in-out
const softSpring = { type: "spring", stiffness: 100, damping: 20, mass: 0.8 };

/**
 * CampaignOverviewCard - Interactive campaign summary card in Framer Analytics style
 *
 * Features:
 * - Smooth hover animations and transitions
 * - Interactive metric cards with hover states
 * - Animated progress bar with glow effect
 * - Status badge with pulse animation
 * - Chart reveal on hover
 */
export function CampaignOverviewCard({
  name,
  status = "active",
  description,
  startDate,
  endDate,
  metrics = [],
  chartData,
  showChart = true,
  progress,
  creatorCount,
  postCount,
  budget,
  className,
  onClick,
}: CampaignOverviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const statusConfig = STATUS_CONFIG[status];

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Default metrics if none provided
  const displayMetrics = metrics.length > 0 ? metrics : [
    { label: "Views", value: 0, compact: true },
    { label: "Engagement", value: "0%" },
    { label: "CPM", value: "$0.00" },
  ];

  const budgetPercentage = budget ? (budget.spent / budget.total) * 100 : progress || 0;

  return (
    <motion.div
      className={cn(
        "relative border backdrop-blur-xl cursor-pointer group",
        className
      )}
      style={{
        background: isHovered
          ? "linear-gradient(145deg, rgba(15, 15, 20, 0.95) 0%, rgba(8, 12, 18, 0.92) 50%, rgba(12, 8, 20, 0.95) 100%)"
          : "linear-gradient(145deg, rgba(10, 10, 14, 0.9) 0%, rgba(5, 8, 12, 0.88) 50%, rgba(8, 5, 14, 0.9) 100%)",
        borderColor: isHovered ? "rgba(25, 125, 255, 0.25)" : "rgba(25, 125, 255, 0.12)",
        boxShadow: isHovered 
          ? "0 0 40px rgba(25, 125, 255, 0.12), 0 0 80px rgba(25, 125, 255, 0.06), 0 25px 50px rgba(0, 0, 0, 0.35)" 
          : "0 0 20px rgba(25, 125, 255, 0.06), 0 0 40px rgba(25, 125, 255, 0.03)",
        transition: "border-color 0.5s ease, box-shadow 0.6s ease, background 0.6s ease",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      whileHover={{ 
        scale: 1.015,
        y: -4,
      }}
      transition={{ 
        duration: 0.7, 
        ease: gentleEase,
        scale: { duration: 0.5, ease: smoothEase },
        y: { duration: 0.5, ease: smoothEase },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredMetric(null);
      }}
      onClick={onClick}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: gentleEase }}
        style={{
          background: "linear-gradient(135deg, rgba(25, 125, 255, 0.04) 0%, transparent 50%, rgba(173, 133, 255, 0.04) 100%)",
        }}
      />

      <div className="relative p-6 space-y-5">
        {/* Header: Title + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <motion.h3
              className="font-semibold truncate"
              style={{
                fontFamily: FRAMER_TYPOGRAPHY.body,
                fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                fontSize: "16px",
              }}
              animate={{ 
                color: isHovered ? FRAMER_CHART_COLORS.primaryLine : FRAMER_TEXT_COLORS.primary 
              }}
              transition={{ duration: 0.4, ease: gentleEase }}
            >
              {name}
            </motion.h3>
            {description && (
              <motion.p
                className="text-sm mt-1 line-clamp-2"
                animate={{ 
                  opacity: isHovered ? 0.9 : 0.7,
                  color: FRAMER_TEXT_COLORS.secondary
                }}
                transition={{ duration: 0.4, ease: gentleEase }}
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Status Badge - Interactive */}
          <motion.div 
            className="flex items-center gap-2"
            onMouseEnter={() => setIsStatusHovered(true)}
            onMouseLeave={() => setIsStatusHovered(false)}
          >
            {status === "active" && (
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full"
                  style={{ backgroundColor: statusConfig.color }}
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: statusConfig.color }}
                />
              </span>
            )}
            <motion.span
              className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{
                color: statusConfig.color,
              }}
              animate={{
                backgroundColor: isStatusHovered ? statusConfig.hoverBgColor : statusConfig.bgColor,
                scale: isStatusHovered ? 1.03 : 1,
              }}
              transition={{ duration: 0.35, ease: gentleEase }}
            >
              {statusConfig.label}
            </motion.span>
          </motion.div>
        </div>

        {/* Date Range - with hover effect */}
        {(startDate || endDate) && (
          <motion.div
            className="flex items-center gap-2 text-xs rounded-md px-2 py-1.5 -mx-2"
            style={{ 
              color: FRAMER_TEXT_COLORS.muted,
            }}
            animate={{
              backgroundColor: isHovered ? "rgba(255, 255, 255, 0.025)" : "transparent"
            }}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            transition={{ duration: 0.4, ease: gentleEase }}
          >
            <motion.svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              animate={{ rotate: isHovered ? 3 : 0 }}
              transition={{ duration: 0.5, ease: gentleEase }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </motion.svg>
            <span>
              {formatDate(startDate)}
              {startDate && endDate && " → "}
              {formatDate(endDate)}
            </span>
          </motion.div>
        )}

        {/* Metrics Grid - Interactive cards */}
        <div className="grid grid-cols-3 gap-3">
          {displayMetrics.slice(0, 3).map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              whileHover={{ 
                scale: 1.03,
                y: -2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: gentleEase,
                scale: { duration: 0.4, ease: smoothEase },
                y: { duration: 0.4, ease: smoothEase },
              }}
              className="flex flex-col gap-1 p-3 rounded-lg cursor-default"
              style={{
                backgroundColor: hoveredMetric === index 
                  ? "rgba(25, 125, 255, 0.08)" 
                  : isHovered 
                    ? "rgba(255, 255, 255, 0.02)" 
                    : "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: hoveredMetric === index 
                  ? "rgba(25, 125, 255, 0.15)" 
                  : "transparent",
                transition: "background-color 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={() => setHoveredMetric(index)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <motion.span
                className="text-xs"
                style={{
                  fontFamily: FRAMER_TYPOGRAPHY.body,
                  fontSize: "11px",
                }}
                animate={{
                  color: hoveredMetric === index ? FRAMER_TEXT_COLORS.secondary : FRAMER_TEXT_COLORS.muted,
                }}
                transition={{ duration: 0.35, ease: gentleEase }}
              >
                {metric.label}
              </motion.span>
              <div className="flex items-baseline gap-1">
                <motion.span
                  className="font-semibold"
                  style={{
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "18px",
                  }}
                  animate={{
                    color: hoveredMetric === index ? FRAMER_CHART_COLORS.primaryLine : FRAMER_TEXT_COLORS.primary,
                  }}
                  transition={{ duration: 0.35, ease: gentleEase }}
                >
                  {metric.prefix}
                  {typeof metric.value === "number"
                    ? metric.compact
                      ? formatCompactNumber(metric.value)
                      : metric.value.toLocaleString()
                    : metric.value}
                  {metric.suffix}
                </motion.span>
                {metric.trend && (
                  <motion.span
                    className="text-xs font-medium flex items-center gap-0.5"
                    style={{
                      color:
                        metric.trend.direction === "up"
                          ? "rgb(34, 197, 94)"
                          : metric.trend.direction === "down"
                          ? "rgb(239, 68, 68)"
                          : FRAMER_TEXT_COLORS.muted,
                    }}
                    animate={{
                      y: hoveredMetric === index 
                        ? metric.trend.direction === "up" ? -1 : metric.trend.direction === "down" ? 1 : 0 
                        : 0
                    }}
                    transition={{ duration: 0.4, ease: gentleEase }}
                  >
                    <motion.span
                      animate={{
                        rotate: hoveredMetric === index ? (metric.trend.direction === "up" ? -5 : 5) : 0
                      }}
                      transition={{ duration: 0.4, ease: gentleEase }}
                    >
                      {metric.trend.direction === "up" && "↑"}
                      {metric.trend.direction === "down" && "↓"}
                    </motion.span>
                    {metric.trend.value}%
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Chart - with hover enhancement */}
        {showChart && chartData && chartData.length > 0 && (
          <motion.div 
            className="pt-1 rounded-lg overflow-hidden"
            animate={{ 
              opacity: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.5, ease: gentleEase }}
          >
            <FramerChart
              data={chartData}
              height={80}
              showGrid={false}
              showYAxis={false}
              showXAxis={false}
            />
          </motion.div>
        )}

        {/* Progress Bar (Budget or Timeline) - Interactive */}
        {(progress !== undefined || budget) && (
          <motion.div 
            className="space-y-2 p-3 -mx-3 rounded-lg"
            animate={{
              backgroundColor: isProgressHovered ? "rgba(255, 255, 255, 0.025)" : "transparent"
            }}
            transition={{ duration: 0.4, ease: gentleEase }}
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
          >
            {budget && (
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: FRAMER_TEXT_COLORS.muted }}>Budget</span>
                <motion.span 
                  animate={{ 
                    color: isProgressHovered ? FRAMER_TEXT_COLORS.primary : FRAMER_TEXT_COLORS.secondary 
                  }}
                  transition={{ duration: 0.4, ease: gentleEase }}
                >
                  ${formatCompactNumber(budget.spent)} / ${formatCompactNumber(budget.total)}
                </motion.span>
              </div>
            )}
            <div
              className="relative h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${budgetPercentage}%`,
                }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full rounded-full relative"
                style={{ 
                  backgroundColor: FRAMER_CHART_COLORS.primaryLine,
                }}
              >
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)`,
                  }}
                  animate={{
                    x: isProgressHovered ? ["0%", "200%"] : "0%",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isProgressHovered ? Infinity : 0,
                    ease: "linear",
                  }}
                />
              </motion.div>
              
              {/* Percentage tooltip on hover */}
              <AnimatePresence>
                {isProgressHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: gentleEase }}
                    className="absolute -top-7 px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      left: `${Math.min(budgetPercentage, 90)}%`,
                      transform: "translateX(-50%)",
                      backgroundColor: FRAMER_CHART_COLORS.primaryLine,
                      color: "white",
                    }}
                  >
                    {budgetPercentage.toFixed(0)}%
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Footer: Creator/Post Counts - Interactive */}
        {(creatorCount !== undefined || postCount !== undefined) && (
          <motion.div
            className="flex items-center gap-3 pt-3 border-t text-xs"
            style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
            animate={{ 
              borderColor: isHovered ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.06)" 
            }}
            transition={{ duration: 0.5, ease: gentleEase }}
          >
            {creatorCount !== undefined && (
              <motion.div 
                className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                whileHover={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
                transition={{ duration: 0.35, ease: gentleEase }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={{ color: FRAMER_TEXT_COLORS.muted }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                <span style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                  {creatorCount} Creators
                </span>
              </motion.div>
            )}
            {postCount !== undefined && (
              <motion.div 
                className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                whileHover={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
                transition={{ duration: 0.35, ease: gentleEase }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={{ color: FRAMER_TEXT_COLORS.muted }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <span style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                  {postCount} Posts
                </span>
              </motion.div>
            )}
            
            {/* View Details arrow - appears on hover */}
            <motion.div
              className="ml-auto flex items-center gap-1.5 text-xs"
              initial={{ opacity: 0, x: -8 }}
              animate={{ 
                opacity: isHovered ? 0.9 : 0, 
                x: isHovered ? 0 : -8 
              }}
              transition={{ duration: 0.5, ease: gentleEase, delay: isHovered ? 0.1 : 0 }}
              style={{ color: FRAMER_CHART_COLORS.primaryLine }}
            >
              <span>View Details</span>
              <motion.svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ x: isHovered ? [0, 2, 0] : 0 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.3, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default CampaignOverviewCard;
