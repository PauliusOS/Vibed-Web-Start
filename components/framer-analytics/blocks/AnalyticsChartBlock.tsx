"use client";

import { useState } from "react";
import { FramerCard } from "../FramerCard";
import { FramerChart } from "../FramerChart";
import { FramerDateSelector } from "../FramerDateSelector";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "../constants/colors";
import { generateSampleData } from "../utils/formatters";

interface AnalyticsChartBlockProps {
  /** Chart title */
  title?: string;
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show Y axis */
  showYAxis?: boolean;
  /** Show X axis */
  showXAxis?: boolean;
  /** Enable date selector */
  showDateSelector?: boolean;
  /** Additional className */
  className?: string;
  /** Callback when date range changes */
  onDateRangeChange?: (value: string, days: number) => void;
}

/**
 * AnalyticsChartBlock
 * 
 * A standalone chart section with title and optional date selector.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <AnalyticsChartBlock title="Performance" />
 * 
 * // With date selector
 * <AnalyticsChartBlock 
 *   title="Views Over Time"
 *   showDateSelector
 *   height={300}
 * />
 * ```
 */
export function AnalyticsChartBlock({
  title = "Analytics",
  height = 280,
  showGrid = false,
  showYAxis = true,
  showXAxis = true,
  showDateSelector = true,
  className,
  onDateRangeChange,
}: AnalyticsChartBlockProps) {
  const [dateRange, setDateRange] = useState("30d");

  // Generate sample data
  const fullData = generateSampleData(30, 2000, 0.25);
  const chartData = fullData.filter((_, i) => i % 2 === 0 || i === fullData.length - 1);

  const handleDateChange = (value: string, days: number) => {
    setDateRange(value);
    onDateRangeChange?.(value, days);
  };

  return (
    <FramerCard className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="font-semibold"
            style={{
              color: FRAMER_TEXT_COLORS.primary,
              fontFamily: FRAMER_TYPOGRAPHY.body,
              fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
              fontSize: "20px",
            }}
          >
            {title}
          </h3>
          
          {showDateSelector && (
            <FramerDateSelector
              variant="dropdown"
              value={dateRange}
              onChange={handleDateChange}
            />
          )}
        </div>

        {/* Chart */}
        <FramerChart
          data={chartData}
          height={height}
          showGrid={showGrid}
          showYAxis={showYAxis}
          showXAxis={showXAxis}
        />
      </div>
    </FramerCard>
  );
}

export default AnalyticsChartBlock;


















