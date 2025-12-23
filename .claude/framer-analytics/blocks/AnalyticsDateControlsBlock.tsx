"use client";

import { useState } from "react";
import { FramerCard } from "../FramerCard";
import { FramerDateSelector } from "../FramerDateSelector";
import { FramerDatePills } from "../FramerDatePills";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "../constants/colors";

interface AnalyticsDateControlsBlockProps {
  /** Control variant */
  variant?: "dropdown" | "pills" | "both";
  /** Initial selected value */
  defaultValue?: string;
  /** Callback when date range changes */
  onDateRangeChange?: (value: string, days: number) => void;
  /** Additional className */
  className?: string;
}

/**
 * AnalyticsDateControlsBlock
 * 
 * Date range selector block with dropdown or pill variants.
 * 
 * @example
 * ```tsx
 * // Dropdown only
 * <AnalyticsDateControlsBlock variant="dropdown" />
 * 
 * // Pills only
 * <AnalyticsDateControlsBlock variant="pills" />
 * 
 * // Both with callback
 * <AnalyticsDateControlsBlock 
 *   variant="both"
 *   onDateRangeChange={(value, days) => console.log(value, days)}
 * />
 * ```
 */
export function AnalyticsDateControlsBlock({
  variant = "dropdown",
  defaultValue = "30d",
  onDateRangeChange,
  className,
}: AnalyticsDateControlsBlockProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: string, days: number) => {
    setValue(newValue);
    onDateRangeChange?.(newValue, days);
  };

  if (variant === "dropdown") {
    return (
      <div className={className}>
        <FramerDateSelector
          variant="dropdown"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  }

  if (variant === "pills") {
    return (
      <div className={className}>
        <FramerDatePills
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  }

  // Both variants
  return (
    <FramerCard className={className} padding="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          >
            Dropdown:
          </span>
          <FramerDateSelector
            variant="dropdown"
            value={value}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          >
            Pills:
          </span>
          <FramerDatePills
            value={value}
            onChange={handleChange}
          />
        </div>
      </div>
    </FramerCard>
  );
}

export default AnalyticsDateControlsBlock;


















