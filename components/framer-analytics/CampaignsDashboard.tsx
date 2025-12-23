"use client";

import { useState, useMemo } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FramerChart,
  FramerCard,
  FRAMER_CHART_COLORS,
  FRAMER_TEXT_COLORS,
  FRAMER_BG_COLORS,
  generateSampleData,
} from "@/components/framer-analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

// Types
type MetricType = "avgViews" | "engagement" | "comments" | "likes" | "saves" | "shares";
type DatePreset = "7d" | "14d" | "30d" | "90d" | "custom";
type Platform = "all" | "instagram" | "tiktok";

interface MetricConfig {
  id: MetricType;
  label: string;
  value: string | number;
  format: "number" | "percentage";
  color: string;
}

export interface CampaignsDashboardProps {
  className?: string;
  onDateRangeChange?: (start: Date, end: Date) => void;
  onMetricsChange?: (metrics: MetricType[]) => void;
  onPlatformChange?: (platform: Platform) => void;
}

// Format large numbers
function formatMetricValue(value: number, format: "number" | "percentage"): string {
  if (format === "percentage") {
    return `${value.toFixed(1)}%`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

// Metric colors for multi-line chart
const METRIC_COLORS: Record<MetricType, string> = {
  avgViews: "#06b6d4", // cyan
  engagement: "#f59e0b", // amber
  comments: "#8b5cf6", // violet
  likes: "#ef4444", // red
  saves: "#22c55e", // green
  shares: "#3b82f6", // blue
};

export function CampaignsDashboard({
  className,
  onDateRangeChange,
  onMetricsChange,
  onPlatformChange,
}: CampaignsDashboardProps) {
  // State - now supports multiple selected metrics
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricType>>(
    new Set(["avgViews"])
  );
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  const [platform, setPlatform] = useState<Platform>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const end = new Date();
    const start = subDays(end, 30);
    return { from: start, to: end };
  });

  // Generate chart data based on selected metrics
  const chartData = useMemo(() => {
    const days = datePreset === "7d" ? 7 : datePreset === "14d" ? 14 : datePreset === "90d" ? 90 : 30;
    return generateSampleData(days, 2000, 0.25);
  }, [datePreset]);

  // Metrics configuration with sample data and colors
  const metrics: MetricConfig[] = useMemo(() => [
    { id: "avgViews", label: "Avg Views", value: 1300000, format: "number", color: METRIC_COLORS.avgViews },
    { id: "engagement", label: "Engagement", value: 29.2, format: "percentage", color: METRIC_COLORS.engagement },
    { id: "comments", label: "Comments", value: 45000, format: "number", color: METRIC_COLORS.comments },
    { id: "likes", label: "Likes", value: 320000, format: "number", color: METRIC_COLORS.likes },
    { id: "saves", label: "Saves", value: 15000, format: "number", color: METRIC_COLORS.saves },
    { id: "shares", label: "Shares", value: 8000, format: "number", color: METRIC_COLORS.shares },
  ], []);

  // Date presets
  const datePresets = [
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom range" },
  ];

  // Handle date preset change
  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== "custom") {
      const end = new Date();
      const days = preset === "7d" ? 7 : preset === "14d" ? 14 : preset === "90d" ? 90 : 30;
      const start = subDays(end, days);
      setDateRange({ from: start, to: end });
      onDateRangeChange?.(start, end);
    }
  };

  // Handle metric toggle (multi-select)
  const handleMetricToggle = (metric: MetricType) => {
    setSelectedMetrics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        // Don't allow deselecting if it's the last one
        if (newSet.size > 1) {
          newSet.delete(metric);
        }
      } else {
        newSet.add(metric);
      }
      onMetricsChange?.(Array.from(newSet));
      return newSet;
    });
  };

  // Handle platform change
  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    onPlatformChange?.(newPlatform);
  };

  // Format date range display
  const dateRangeDisplay = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}`;
    }
    return "Select dates";
  }, [dateRange]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Preset Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08] hover:text-white gap-2"
            >
              <Calendar className="w-4 h-4" />
              {datePresets.find(p => p.value === datePreset)?.label}
              <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#1a1a1a] border-white/[0.08] min-w-[160px]"
          >
            {datePresets.map((preset) => (
              <DropdownMenuItem
                key={preset.value}
                onClick={() => handleDatePresetChange(preset.value as DatePreset)}
                className="text-white/70 hover:text-white hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white cursor-pointer"
              >
                {preset.label}
                {datePreset === preset.value && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08] hover:text-white gap-2"
            >
              <Calendar className="w-4 h-4" />
              {dateRangeDisplay}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-[#1a1a1a] border-white/[0.08]"
            align="start"
          >
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setDatePreset("custom");
                  onDateRangeChange?.(range.from, range.to);
                }
              }}
              numberOfMonths={2}
              className="bg-[#1a1a1a] text-white"
            />
          </PopoverContent>
        </Popover>

        {/* Metrics Tabs - Multi-select */}
        <div className="flex items-center gap-1 ml-auto">
          {metrics.map((metric) => {
            const isSelected = selectedMetrics.has(metric.id);
            return (
              <button
                key={metric.id}
                onClick={() => handleMetricToggle(metric.id)}
                className={cn(
                  "relative flex flex-col items-center px-5 py-2 rounded-lg transition-all duration-200 min-w-[90px]",
                  isSelected
                    ? "bg-white/[0.08]"
                    : "hover:bg-white/[0.04]"
                )}
              >
                {/* Selection indicator (checkmark) */}
                {isSelected && (
                  <div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: metric.color }}
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-xs font-medium mb-0.5 transition-colors",
                    isSelected
                      ? "text-white/90"
                      : "text-white/50"
                  )}
                >
                  {metric.label}
                </span>
                <span
                  className={cn(
                    "text-lg font-semibold transition-colors",
                    isSelected
                      ? "text-white"
                      : "text-white/70"
                  )}
                >
                  {formatMetricValue(metric.value as number, metric.format)}
                </span>
                {/* Active indicator line with metric color */}
                <div
                  className={cn(
                    "h-0.5 w-full mt-2 rounded-full transition-all duration-200"
                  )}
                  style={{
                    backgroundColor: isSelected ? metric.color : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Platform Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08] hover:text-white gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              {platform === "all" ? "All Platform" : platform === "instagram" ? "Instagram" : "TikTok"}
              <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#1a1a1a] border-white/[0.08] min-w-[160px]"
          >
            <DropdownMenuItem
              onClick={() => handlePlatformChange("all")}
              className="text-white/70 hover:text-white hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-2" />
              All Platform
              {platform === "all" && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePlatformChange("instagram")}
              className="text-white/70 hover:text-white hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-2" />
              Instagram
              {platform === "instagram" && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePlatformChange("tiktok")}
              className="text-white/70 hover:text-white hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-black mr-2" />
              TikTok
              {platform === "tiktok" && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* SylcRoad Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span
            className="text-[120px] font-bold tracking-wider opacity-[0.03] select-none"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            SylcRoad
          </span>
        </div>

        {/* Chart Container */}
        <div
          className="rounded-2xl border backdrop-blur-xl p-6 relative z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.70)",
            borderColor: "rgba(0, 110, 255, 0.15)",
            boxShadow: "rgba(25, 125, 255, 0.08) 0px 0px 20px, rgba(25, 125, 255, 0.04) 0px 0px 40px",
          }}
        >
          {/* Legend for selected metrics */}
          <div className="flex items-center gap-4 mb-4">
            {Array.from(selectedMetrics).map((metricId) => {
              const metric = metrics.find((m) => m.id === metricId);
              if (!metric) return null;
              return (
                <div key={metricId} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="text-sm text-white/70">{metric.label}</span>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="mt-2">
            <FramerChart
              data={chartData}
              height={320}
              showArea={true}
              showGrid={true}
              showLabels={true}
              animate={true}
              lineColor={
                selectedMetrics.size === 1
                  ? METRIC_COLORS[Array.from(selectedMetrics)[0]]
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignsDashboard;





