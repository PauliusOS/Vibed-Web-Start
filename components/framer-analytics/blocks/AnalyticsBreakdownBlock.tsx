"use client";

import { FramerCard } from "../FramerCard";
import { FramerCountryList } from "../FramerCountryList";
import { FramerDeviceList } from "../FramerDeviceList";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "../constants/colors";
import { sampleCountryData, sampleDeviceData } from "../utils/formatters";

interface CountryData {
  code: string;
  name: string;
  flag: string;
  visitors: number;
  percentage: number;
}

interface DeviceData {
  type: "desktop" | "mobile" | "tablet" | "other";
  name: string;
  visitors: number;
  percentage: number;
}

interface AnalyticsBreakdownBlockProps {
  /** Section title */
  title?: string;
  /** Country data (uses sample if not provided) */
  countryData?: CountryData[];
  /** Device data (uses sample if not provided) */
  deviceData?: DeviceData[];
  /** Layout variant */
  variant?: "side-by-side" | "stacked";
  /** Additional className */
  className?: string;
}

/**
 * AnalyticsBreakdownBlock
 * 
 * Shows country and device breakdown analytics.
 * 
 * @example
 * ```tsx
 * // Default side-by-side layout
 * <AnalyticsBreakdownBlock title="Audience Breakdown" />
 * 
 * // Stacked layout
 * <AnalyticsBreakdownBlock variant="stacked" />
 * 
 * // With custom data
 * <AnalyticsBreakdownBlock
 *   countryData={myCountryData}
 *   deviceData={myDeviceData}
 * />
 * ```
 */
export function AnalyticsBreakdownBlock({
  title,
  countryData = sampleCountryData,
  deviceData = sampleDeviceData,
  variant = "side-by-side",
  className,
}: AnalyticsBreakdownBlockProps) {
  const layoutClass = variant === "side-by-side" 
    ? "grid grid-cols-1 md:grid-cols-2 gap-8"
    : "space-y-8";

  return (
    <FramerCard className={className} padding="lg">
      <div className="space-y-6">
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

        <div className={layoutClass}>
          <FramerCountryList data={countryData} />
          <FramerDeviceList data={deviceData} />
        </div>
      </div>
    </FramerCard>
  );
}

export default AnalyticsBreakdownBlock;


















