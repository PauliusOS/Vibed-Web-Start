"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsHeaderProps {
  title?: string;
  timeRange?: "7d" | "30d" | "90d";
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
}

export function AnalyticsHeader({
  title = "Overview",
  timeRange = "30d",
  onTimeRangeChange,
}: AnalyticsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const timeRangeLabels: Record<"7d" | "30d" | "90d", string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  };

  const handleTimeRangeSelect = (range: "7d" | "30d" | "90d") => {
    onTimeRangeChange?.(range);
    setIsDropdownOpen(false);
  };

  // Calculate date range display
  const getDateRangeText = () => {
    const endDate = new Date();
    const startDate = new Date();

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (date: Date) => {
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    return `${formatDate(startDate)} — ${formatDate(endDate)}`;
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl font-semibold text-white"
      >
        {title}
      </motion.h2>

      {/* Time Range Selectors */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        {/* Dropdown - Last X days */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-white/[0.02] border border-white/[0.06]",
              "hover:bg-white/[0.04] hover:border-white/[0.08]",
              "text-sm font-medium text-white/80",
              "backdrop-blur-[24px]",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/20"
            )}
          >
            <span>{timeRangeLabels[timeRange]}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full mt-2 right-0 min-w-[160px] z-50",
                "rounded-lg border border-white/[0.06]",
                "bg-white/[0.02] backdrop-blur-[32px]",
                "shadow-xl shadow-black/20",
                "overflow-hidden"
              )}
            >
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeSelect(range)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm",
                    "hover:bg-white/[0.04]",
                    "transition-colors duration-150",
                    range === timeRange
                      ? "text-white font-medium bg-white/[0.06]"
                      : "text-white/70"
                  )}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Date Range Display */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-white/[0.02] border border-white/[0.06]",
            "text-sm font-medium text-white/60",
            "backdrop-blur-[24px]"
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>{getDateRangeText()}</span>
        </div>
      </motion.div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
