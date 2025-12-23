"use client";

import { CampaignOverviewCard } from "../CampaignOverviewCard";
import { generateSampleData } from "../utils/formatters";
import type { CampaignStatus, CampaignMetric } from "../CampaignOverviewCard";

interface CampaignOverviewBlockProps {
  /** Campaign name */
  name?: string;
  /** Campaign status */
  status?: CampaignStatus;
  /** Campaign description */
  description?: string;
  /** Start date */
  startDate?: Date | string;
  /** End date */
  endDate?: Date | string;
  /** Custom metrics (uses defaults if not provided) */
  metrics?: CampaignMetric[];
  /** Show chart */
  showChart?: boolean;
  /** Number of creators */
  creatorCount?: number;
  /** Number of posts */
  postCount?: number;
  /** Budget info */
  budget?: {
    spent: number;
    total: number;
  };
  /** Additional className */
  className?: string;
}

/**
 * CampaignOverviewBlock - Ready-to-use campaign overview card
 *
 * Drop-in component with sensible defaults.
 *
 * @example
 * ```tsx
 * import { CampaignOverviewBlock } from "@/components/framer-analytics/blocks";
 *
 * // With defaults
 * <CampaignOverviewBlock />
 *
 * // Customized
 * <CampaignOverviewBlock
 *   name="My Campaign"
 *   status="active"
 *   creatorCount={8}
 *   postCount={24}
 * />
 * ```
 */
export function CampaignOverviewBlock({
  name = "Campaign Overview",
  status = "active",
  description = "Track your campaign performance and key metrics",
  startDate,
  endDate,
  metrics,
  showChart = true,
  creatorCount = 6,
  postCount = 12,
  budget,
  className,
}: CampaignOverviewBlockProps) {
  // Generate sample chart data
  const chartData = generateSampleData(15, 2000, 0.25);

  // Default metrics
  const defaultMetrics: CampaignMetric[] = [
    { label: "Views", value: 1250000, compact: true, trend: { value: 8, direction: "up" } },
    { label: "Engagement", value: "4.2%" },
    { label: "CPM", value: "$4.50" },
  ];

  return (
    <CampaignOverviewCard
      name={name}
      status={status}
      description={description}
      startDate={startDate}
      endDate={endDate}
      metrics={metrics || defaultMetrics}
      chartData={chartData}
      showChart={showChart}
      creatorCount={creatorCount}
      postCount={postCount}
      budget={budget}
      className={className}
    />
  );
}

export default CampaignOverviewBlock;
