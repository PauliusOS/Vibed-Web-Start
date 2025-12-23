"use client";

import { FramerCard } from "../FramerCard";
import { FramerMetrics, FramerMetricCard } from "../FramerMetrics";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "../constants/colors";

interface MetricConfig {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  isLive?: boolean;
}

interface AnalyticsMetricsBlockProps {
  /** Section title */
  title?: string;
  /** Display as grid of cards or horizontal row */
  variant?: "row" | "grid";
  /** Metrics to display (uses defaults if not provided) */
  metrics?: MetricConfig[];
  /** Number of columns for grid variant */
  columns?: 2 | 3 | 4;
  /** Additional className */
  className?: string;
}

// Default metrics
const DEFAULT_METRICS: MetricConfig[] = [
  { label: "Total Views", value: 1250000, compact: true },
  { label: "CPM", value: 4.25, prefix: "$" },
  { label: "Comments", value: 45000, compact: true },
  { label: "Likes", value: 320000, compact: true },
  { label: "Roster", value: 12 },
];

/**
 * AnalyticsMetricsBlock
 * 
 * A metrics section that can display as a row or grid of cards.
 * 
 * @example
 * ```tsx
 * // Default row layout
 * <AnalyticsMetricsBlock title="Campaign Metrics" />
 * 
 * // Grid layout
 * <AnalyticsMetricsBlock 
 *   title="Performance"
 *   variant="grid"
 *   columns={4}
 * />
 * 
 * // Custom metrics
 * <AnalyticsMetricsBlock
 *   metrics={[
 *     { label: "Revenue", value: 50000, prefix: "$", compact: true },
 *     { label: "Conversions", value: 1234 },
 *   ]}
 * />
 * ```
 */
export function AnalyticsMetricsBlock({
  title,
  variant = "row",
  metrics = DEFAULT_METRICS,
  columns = 4,
  className,
}: AnalyticsMetricsBlockProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <FramerCard className={className} padding="lg">
      <div className="space-y-4">
        {title && (
          <h3
            className="font-semibold"
            style={{
              color: FRAMER_TEXT_COLORS.primary,
              fontFamily: FRAMER_TYPOGRAPHY.body,
              fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
              fontSize: "16px",
            }}
          >
            {title}
          </h3>
        )}

        {variant === "row" ? (
          <FramerMetrics metrics={metrics} />
        ) : (
          <div className={`grid ${gridCols[columns]} gap-4`}>
            {metrics.map((metric, index) => (
              <FramerMetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                compact={metric.compact}
                isLive={metric.isLive}
                delay={index}
              />
            ))}
          </div>
        )}
      </div>
    </FramerCard>
  );
}

export default AnalyticsMetricsBlock;


















