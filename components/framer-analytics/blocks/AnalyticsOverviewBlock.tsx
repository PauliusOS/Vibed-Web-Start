"use client";

import { FramerOverviewCard } from "../FramerDashboard";
import { generateSampleData } from "../utils/formatters";

interface AnalyticsOverviewBlockProps {
  /** Total views */
  totalViews?: number;
  /** Total likes */
  totalLikes?: number;
  /** Total comments */
  totalComments?: number;
  /** Additional className */
  className?: string;
}

/**
 * AnalyticsOverviewBlock
 * 
 * A compact overview widget perfect for sidebars or small spaces.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <AnalyticsOverviewBlock />
 * 
 * // With custom metrics
 * <AnalyticsOverviewBlock
 *   totalViews={5000000}
 *   totalLikes={500000}
 *   totalComments={75000}
 * />
 * ```
 */
export function AnalyticsOverviewBlock({
  totalViews = 3200000,
  totalLikes = 256000,
  totalComments = 32000,
  className,
}: AnalyticsOverviewBlockProps) {
  // Generate chart data
  const fullData = generateSampleData(30, 2000, 0.25);
  const chartData = fullData.filter((_, i) => i % 2 === 0 || i === fullData.length - 1);

  return (
    <FramerOverviewCard
      chartData={chartData}
      totalViews={totalViews}
      totalLikes={totalLikes}
      totalComments={totalComments}
      className={className}
    />
  );
}

export default AnalyticsOverviewBlock;


















