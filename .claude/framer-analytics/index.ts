/**
 * Framer Analytics Components
 *
 * A pixel-perfect recreation of Framer's Analytics dashboard components
 * using pure SVG rendering for charts.
 *
 * @example
 * ```tsx
 * import {
 *   FramerChart,
 *   FramerDashboard,
 *   FramerMetrics,
 *   generateSampleData,
 * } from "@/components/framer-analytics";
 *
 * // Use the full dashboard
 * <FramerDashboard
 *   chartData={chartData}
 *   countryData={countryData}
 *   deviceData={deviceData}
 *   liveVisitors={127}
 * />
 *
 * // Or use individual components
 * <FramerChart data={chartData} height={227} />
 * ```
 */

// Main components
export { FramerChart } from "./FramerChart";
export { FramerDashboard, FramerOverviewCard } from "./FramerDashboard";
export { FramerMetrics, FramerMetricCard } from "./FramerMetrics";
export { FramerCard } from "./FramerCard";
export { FramerDateSelector } from "./FramerDateSelector";
export { FramerDatePills } from "./FramerDatePills";
export { FramerCountryList } from "./FramerCountryList";
export { FramerDeviceList } from "./FramerDeviceList";

// Creator Analytics components
export { CreatorAvatarRow } from "./CreatorAvatarRow";
export { VideoPreviewModal } from "./VideoPreviewModal";
export { MetricSettingsPopover } from "./MetricSettingsPopover";

// Campaign components
export { CampaignOverviewCard } from "./CampaignOverviewCard";
export type { CampaignOverviewCardProps, CampaignMetric, CampaignStatus } from "./CampaignOverviewCard";
export { CampaignBudgetSelector } from "./CampaignBudgetSelector";
export type { CampaignBudgetSelectorProps } from "./CampaignBudgetSelector";
export { CreatorPayoutCard } from "./CreatorPayoutCard";
export type { CreatorPayoutCardProps, PayoutFormData } from "./CreatorPayoutCard";
export { AnalyticsSummaryCard } from "./AnalyticsSummaryCard";
export type { AnalyticsSummaryCardProps, SummaryMetric } from "./AnalyticsSummaryCard";

// Chat component
export { FramerChat } from "./FramerChat";
export { FramerChatLayout, useChatPanel, ChatToggleButton } from "./FramerChatLayout";

// Sylc AI Chat
export { SylcAIChat } from "./SylcAIChat";
export type { SylcAIChatProps, ResultsData } from "./SylcAIChat";

// Shared animated components
export {
  StackedInfluencerCards,
  StackedVideoCards,
  AnimatedReach,
  AnimatedCPM,
  DEFAULT_CREATORS,
  formatNumber as formatAnimatedNumber,
  formatCurrency as formatAnimatedCurrency,
} from "./shared/AnimatedStats";

// Chart types for creator analytics
export type { CreatorChartData, PostMarker } from "./FramerChart";
export type { Creator } from "./CreatorAvatarRow";

// Constants
export {
  FRAMER_ANALYTICS_COLORS,
  FRAMER_CHART_COLORS,
  FRAMER_GRADIENT_COLORS,
  FRAMER_BG_COLORS,
  FRAMER_TEXT_COLORS,
  FRAMER_CHART_STYLES,
  FRAMER_TYPOGRAPHY,
  FRAMER_LIVE_COLORS,
  DEFAULT_LINE_CONFIGS,
  CREATOR_COLORS,
  getCreatorGradient,
} from "./constants/colors";

// Utilities
export {
  generateChartPaths,
  generateDualChartPaths,
  generateYAxisTicks,
  formatAxisValue,
} from "./utils/pathGenerator";

export {
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatDuration,
  formatChartDate,
  formatDateRange,
  getDateRange,
  generateSampleData,
  generateMultiMetricData,
  sampleCountryData,
  sampleDeviceData,
} from "./utils/formatters";

export type { MultiMetricDataPoint } from "./utils/formatters";

// Types
export type {
  DataPoint,
  DualDataPoint,
  LineConfig,
  MetricItem,
  CountryData,
  DeviceData,
  DateRangeOption,
  ChartDimensions,
  PathData,
  AnimationConfig,
  FramerChartProps,
  FramerMetricsProps,
  FramerCardProps,
  FramerDateSelectorProps,
  FramerCountryListProps,
  FramerDeviceListProps,
  FramerDashboardProps,
} from "./types";

// Blocks - Ready-to-use sections
export {
  AnalyticsDashboardBlock,
  AnalyticsChartBlock,
  AnalyticsMetricsBlock,
  AnalyticsBreakdownBlock,
  AnalyticsOverviewBlock,
  AnalyticsChatBlock,
  AnalyticsDateControlsBlock,
  CampaignOverviewBlock,
} from "./blocks";

// Campaigns Dashboard
export { CampaignsDashboard } from "./CampaignsDashboard";
export type { CampaignsDashboardProps } from "./CampaignsDashboard";

// Calendar components
export {
  FramerCalendar,
  CreatorRankings,
  CreatorRankingsCompact,
} from "./calendar";
export type {
  ViewMode,
  PostStatus,
  UserRole,
  ScheduledPost,
  CreatorRanking,
} from "./calendar";
export { CampaignCalendarDashboard } from "./calendar/CampaignCalendarDashboard";
