"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InteractiveMetricCard, METRIC_COLORS } from "./InteractiveMetricCard";
import { FramerDualLineChart } from "./FramerDualLineChart";

interface MetricConfig {
  key: string;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  dataKey: string;
  isLive?: boolean;
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface InteractiveMetricsWithChartProps {
  metrics: MetricConfig[];
  chartData: ChartDataPoint[];
  chartHeight?: number;
  className?: string;
  formatValue?: (value: number) => string;
  showChart?: boolean;
}

/**
 * InteractiveMetricsWithChart - Combines metric cards with a dynamic chart
 *
 * Features:
 * - Grid of InteractiveMetricCards with dark blue ambient glow
 * - Chart that responds to card toggling
 * - Click a card to show/hide that metric in the chart
 * - Smooth animations and transitions
 */
export function InteractiveMetricsWithChart({
  metrics,
  chartData,
  chartHeight = 280,
  className,
  formatValue,
  showChart = true,
}: InteractiveMetricsWithChartProps) {
  // Track which metrics are visible in the chart
  const [visibleMetrics, setVisibleMetrics] = useState<Set<string>>(
    new Set(metrics.map((m) => m.key))
  );

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow hiding all metrics - keep at least one visible
        if (next.size > 1) {
          next.delete(key);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Build chart lines config based on visible metrics
  const chartLines = useMemo(() => {
    return metrics
      .filter((m) => visibleMetrics.has(m.key))
      .map((m) => ({
        dataKey: m.dataKey,
        label: m.label,
        color: m.color,
      }));
  }, [metrics, visibleMetrics]);

  // Ensure we have exactly 2 lines for the dual chart (or handle single line)
  const displayLines = useMemo(() => {
    if (chartLines.length === 0) return null;
    if (chartLines.length === 1) {
      // Duplicate the single line for the dual chart component
      return [chartLines[0], chartLines[0]] as [typeof chartLines[0], typeof chartLines[0]];
    }
    // Take first two visible lines
    return [chartLines[0], chartLines[1]] as [typeof chartLines[0], typeof chartLines[0]];
  }, [chartLines]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Metrics Grid with Glow Container */}
      <div className="relative">
        {/* Dark blue ambient glow */}
        <div className="absolute -inset-4 bg-blue-500/[0.04] rounded-3xl blur-2xl pointer-events-none" />

        {/* Cards Grid */}
        <motion.div
          className="relative grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {metrics.map((metric, index) => (
            <InteractiveMetricCard
              key={metric.key}
              label={metric.label}
              value={metric.value}
              suffix={metric.suffix}
              indicatorColor={metric.color}
              isActive={visibleMetrics.has(metric.key)}
              onToggle={() => toggleMetric(metric.key)}
              isLive={metric.isLive}
              delay={index}
            />
          ))}
        </motion.div>
      </div>

      {/* Chart */}
      {showChart && displayLines && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <FramerDualLineChart
            data={chartData}
            lines={displayLines}
            height={chartHeight}
            formatXAxis={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            formatValue={formatValue}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Simple standalone metrics row with glow (no chart)
 */
interface MetricsRowWithGlowProps {
  metrics: Omit<MetricConfig, "dataKey">[];
  className?: string;
  columns?: 2 | 3 | 4 | 5;
}

export function MetricsRowWithGlow({
  metrics,
  className,
  columns = 4,
}: MetricsRowWithGlowProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
  };

  return (
    <div className={cn("relative", className)}>
      {/* Dark blue ambient glow */}
      <div className="absolute -inset-4 bg-blue-500/[0.04] rounded-3xl blur-2xl pointer-events-none" />

      {/* Cards Grid */}
      <motion.div
        className={cn("relative grid gap-4", gridCols[columns])}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {metrics.map((metric, index) => (
          <InteractiveMetricCard
            key={metric.key}
            label={metric.label}
            value={metric.value}
            suffix={metric.suffix}
            indicatorColor={metric.color}
            isLive={metric.isLive}
            delay={index}
          />
        ))}
      </motion.div>
    </div>
  );
}

export { METRIC_COLORS };
