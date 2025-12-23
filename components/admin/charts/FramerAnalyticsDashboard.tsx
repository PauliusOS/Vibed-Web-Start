"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FramerMetricsRow, FramerMetricCard } from "./FramerMetricsRow";
import { FramerDualLineChart } from "./FramerDualLineChart";
import { DateRangeSelector, DateRangePills } from "./DateRangeSelector";

// Types
interface AnalyticsData {
  date: string;
  visitors: number;
  uniqueVisitors: number;
}

interface CountryData {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

interface FramerAnalyticsDashboardProps {
  chartData: AnalyticsData[];
  countryData?: CountryData[];
  deviceData?: DeviceData[];
  liveVisitors?: number;
  className?: string;
}

/**
 * FramerAnalyticsDashboard - Complete analytics dashboard inspired by Framer
 *
 * A fully styled analytics dashboard that includes:
 * - Horizontal metrics row with live indicators
 * - Dual-line area chart (cyan/blue)
 * - Date range selector
 * - Country breakdown
 * - Device breakdown
 */
export function FramerAnalyticsDashboard({
  chartData,
  countryData = [],
  deviceData = [],
  liveVisitors = 0,
  className,
}: FramerAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState("30d");

  // Calculate metrics from data
  const metrics = useMemo(() => {
    const totalVisitors = chartData.reduce((sum, d) => sum + d.visitors, 0);
    const totalUniqueVisitors = chartData.reduce(
      (sum, d) => sum + d.uniqueVisitors,
      0
    );
    const avgSessionDuration = "2m 34s"; // Mock value
    const bounceRate = "42.3%"; // Mock value

    return {
      liveVisitors,
      totalVisitors,
      totalUniqueVisitors,
      avgSessionDuration,
      bounceRate,
    };
  }, [chartData, liveVisitors]);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header with Title and Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Analytics</h2>
        <DateRangeSelector
          defaultValue={dateRange}
          onChange={(value) => setDateRange(value)}
        />
      </div>

      {/* Metrics Row */}
      <FramerMetricsRow
        metrics={[
          { label: "Live Visitors", value: metrics.liveVisitors, isLive: true },
          { label: "Total Visitors", value: metrics.totalVisitors },
          { label: "Unique Visitors", value: metrics.totalUniqueVisitors },
          { label: "Avg. Session", value: metrics.avgSessionDuration },
          { label: "Bounce Rate", value: metrics.bounceRate },
        ]}
      />

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
      >
        <FramerDualLineChart
          data={chartData}
          lines={[
            { dataKey: "visitors", label: "Visitors", color: "#38bdf8" },
            {
              dataKey: "uniqueVisitors",
              label: "Unique Visitors",
              color: "#3b82f6",
            },
          ]}
          height={320}
          formatXAxis={(date) => {
            const d = new Date(date);
            return d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
      </motion.div>

      {/* Country and Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Countries */}
        {countryData.length > 0 && (
          <CountryBreakdown countries={countryData} />
        )}

        {/* Devices */}
        {deviceData.length > 0 && <DeviceBreakdown devices={deviceData} />}
      </div>
    </div>
  );
}

/**
 * CountryBreakdown - Shows visitor breakdown by country
 */
interface CountryBreakdownProps {
  countries: CountryData[];
  className?: string;
}

export function CountryBreakdown({
  countries,
  className,
}: CountryBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/80 mb-4">Countries</h3>
      <div className="space-y-3">
        {countries.map((country, index) => (
          <motion.div
            key={country.countryCode}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getFlagEmoji(country.countryCode)}</span>
              <span className="text-sm text-white/70">{country.country}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">
                {country.visitors.toLocaleString()}
              </span>
              <div className="w-20">
                <ProgressBar percentage={country.percentage} color="cyan" />
              </div>
              <span className="text-xs text-white/40 w-10 text-right">
                {country.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * DeviceBreakdown - Shows visitor breakdown by device
 */
interface DeviceBreakdownProps {
  devices: DeviceData[];
  className?: string;
}

export function DeviceBreakdown({ devices, className }: DeviceBreakdownProps) {
  const deviceIcons: Record<string, string> = {
    desktop: "laptop",
    mobile: "smartphone",
    tablet: "tablet",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className={cn(
        "p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/80 mb-4">Devices</h3>
      <div className="space-y-3">
        {devices.map((device, index) => (
          <motion.div
            key={device.device}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <DeviceIcon type={device.device.toLowerCase()} />
              <span className="text-sm text-white/70 capitalize">
                {device.device}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">
                {device.visitors.toLocaleString()}
              </span>
              <div className="w-20">
                <ProgressBar percentage={device.percentage} color="blue" />
              </div>
              <span className="text-xs text-white/40 w-10 text-right">
                {device.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * ProgressBar - Minimal progress bar for breakdowns
 */
interface ProgressBarProps {
  percentage: number;
  color?: "cyan" | "blue" | "emerald" | "amber";
}

function ProgressBar({ percentage, color = "cyan" }: ProgressBarProps) {
  const colors = {
    cyan: "bg-cyan-400",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={cn("h-full rounded-full", colors[color])}
      />
    </div>
  );
}

/**
 * DeviceIcon - Simple device icons
 */
function DeviceIcon({ type }: { type: string }) {
  const iconClasses = "h-4 w-4 text-white/50";

  switch (type) {
    case "desktop":
      return (
        <svg
          className={iconClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "mobile":
      return (
        <svg
          className={iconClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    case "tablet":
      return (
        <svg
          className={iconClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

/**
 * Helper to get flag emoji from country code
 */
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Generate sample analytics data for testing
 */
export function generateSampleAnalyticsData(days: number = 30): AnalyticsData[] {
  const data: AnalyticsData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic-looking data with some variance
    const baseVisitors = 1500 + Math.sin(i / 3) * 400;
    const visitors = Math.round(baseVisitors + Math.random() * 600);
    const uniqueVisitors = Math.round(visitors * (0.65 + Math.random() * 0.1));

    data.push({
      date: date.toISOString().split("T")[0],
      visitors,
      uniqueVisitors,
    });
  }

  return data;
}

export const sampleCountryData: CountryData[] = [
  { country: "United States", countryCode: "US", visitors: 12453, percentage: 42 },
  { country: "United Kingdom", countryCode: "GB", visitors: 4521, percentage: 15 },
  { country: "Germany", countryCode: "DE", visitors: 3892, percentage: 13 },
  { country: "France", countryCode: "FR", visitors: 2341, percentage: 8 },
  { country: "Canada", countryCode: "CA", visitors: 1987, percentage: 7 },
];

export const sampleDeviceData: DeviceData[] = [
  { device: "Desktop", visitors: 18234, percentage: 58 },
  { device: "Mobile", visitors: 11342, percentage: 36 },
  { device: "Tablet", visitors: 1876, percentage: 6 },
];
