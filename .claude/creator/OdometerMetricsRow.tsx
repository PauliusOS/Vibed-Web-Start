"use client";

import { Briefcase, Users, Eye, Target, DollarSign } from "lucide-react";
import { OdometerMetricCard } from "./OdometerMetricCard";

interface OdometerMetricsRowProps {
  activeDealCount?: number;
  totalFollowers?: number;
  totalViews?: number;
  avgEngagementRate?: number;
  totalEarned?: number;
  isLoading?: boolean;
}

export function OdometerMetricsRow({
  activeDealCount = 0,
  totalFollowers = 0,
  totalViews = 0,
  avgEngagementRate = 0,
  totalEarned = 0,
  isLoading = false,
}: OdometerMetricsRowProps) {
  // Calculate staggered delays for animation
  const baseDelay = 0.1;
  const stagger = 0.05;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Active Deals - with live indicator */}
      <OdometerMetricCard
        label="Active Deals"
        value={activeDealCount}
        format="compact"
        icon={Briefcase}
        isLive={activeDealCount > 0}
        isLoading={isLoading}
        delay={baseDelay + stagger * 0}
      />

      {/* Total Followers */}
      <OdometerMetricCard
        label="Total Followers"
        value={totalFollowers}
        format="compact"
        icon={Users}
        isLoading={isLoading}
        delay={baseDelay + stagger * 1}
      />

      {/* Total Views */}
      <OdometerMetricCard
        label="Total Views"
        value={totalViews}
        format="compact"
        icon={Eye}
        isLoading={isLoading}
        delay={baseDelay + stagger * 2}
      />

      {/* Engagement Rate */}
      <OdometerMetricCard
        label="Engagement Rate"
        value={avgEngagementRate}
        format="percentage"
        icon={Target}
        isLoading={isLoading}
        delay={baseDelay + stagger * 3}
      />

      {/* Total Earned */}
      <OdometerMetricCard
        label="Total Earned"
        value={totalEarned}
        format="currency"
        icon={DollarSign}
        isLoading={isLoading}
        delay={baseDelay + stagger * 4}
      />
    </div>
  );
}
