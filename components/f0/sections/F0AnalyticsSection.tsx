"use client";

import { useState } from "react";
import { ComponentPreview, ComponentGrid, ComponentCard, SectionHeader } from "@/components/f0";
import {
  FramerChart,
  FramerDashboard,
  FramerMetrics,
  FramerMetricCard,
  FramerCard,
  FramerDateSelector,
  FramerDatePills,
  FramerCountryList,
  FramerDeviceList,
  CampaignOverviewCard,
  CampaignBudgetSelector,
  CreatorPayoutCard,
  AnalyticsSummaryCard,
  CreatorAvatarRow,
  generateSampleData,
  sampleCountryData,
  sampleDeviceData,
  FRAMER_CHART_COLORS,
  CREATOR_COLORS,
  DEFAULT_CREATORS,
} from "@/components/framer-analytics";
import { InsightsCard, CreatorLeaderboard, AnalyticsOverview } from "@/components/analytics";

const chartData = generateSampleData(30, 2000, 0.25);

const metrics = [
  { label: "Total Views", value: 1250000, compact: true },
  { label: "Engagement Rate", value: "4.2%", trend: { value: 12, direction: "up" as const } },
  { label: "Avg. CPM", value: "$4.25", trend: { value: 8, direction: "up" as const } },
  { label: "Active Campaigns", value: 12 },
];

const creators = DEFAULT_CREATORS.slice(0, 5).map((c, i) => ({
  ...c,
  color: CREATOR_COLORS[i % CREATOR_COLORS.length],
}));

// Sample data for new analytics components
const sampleMetrics = {
  views: 1300000,
  likes: 320000,
  comments: 45000,
  cpm: 4.25,
  roster: 6,
  videos: 12,
};

const sampleCreators = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "emmawilson",
    avatar: "https://i.pravatar.cc/150?img=1",
    platform: "tiktok" as const,
    views: 853800,
    engagement: 50700,
    engagementRate: 5.9,
    videos: 4,
    medianCPM: 4.12,
    performance: "excellent" as const,
  },
  {
    id: "2",
    name: "Marcus Chen",
    username: "marcuschen",
    avatar: "https://i.pravatar.cc/150?img=2",
    platform: "instagram" as const,
    views: 672500,
    engagement: 38200,
    engagementRate: 5.7,
    videos: 3,
    medianCPM: 4.38,
    performance: "excellent" as const,
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    username: "sofiarodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    platform: "youtube" as const,
    views: 524300,
    engagement: 28100,
    engagementRate: 5.4,
    videos: 2,
    medianCPM: 4.45,
    performance: "good" as const,
  },
];

const overviewMetrics = {
  avgViews: 1300000,
  engagement: 29.2,
  comments: 45000,
  likes: 320000,
  saves: 15000,
  shares: 8000,
};

export default function F0AnalyticsSection() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics Components"
        description="Framer-style analytics dashboard components with pure SVG charts"
        count={45}
        badge="ANALYTICS"
        badgeColor="cyan"
      />

      {/* New Analytics Components from sylcroad.com/f0 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Full Analytics Blocks</h3>
        <ComponentGrid columns={1}>
          <ComponentPreview
            name="InsightsCard"
            description="Comprehensive insights overview with 6 key metrics, trends, and engagement rate"
            importPath="@/components/analytics"
          >
            <InsightsCard
              title="Insights Views"
              dateRange="Nov 17 — Dec 17"
              metrics={sampleMetrics}
              trend={{
                views: { value: 12, direction: "up" },
                engagement: { value: 8, direction: "up" },
              }}
            />
          </ComponentPreview>

          <ComponentPreview
            name="AnalyticsOverview"
            description="Detailed metrics breakdown with engagement stats and period selector"
            importPath="@/components/analytics"
          >
            <AnalyticsOverview
              title="All Platforms"
              metrics={overviewMetrics}
              period={{ start: "Nov 17", end: "Dec 17" }}
            />
          </ComponentPreview>

          <ComponentPreview
            name="CreatorLeaderboard"
            description="Interactive leaderboard with tabs, sortable columns, expandable details, and platform badges"
            importPath="@/components/analytics"
          >
            <CreatorLeaderboard
              creators={sampleCreators}
              dateRange="Last 30 days"
            />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Main Chart Demo */}
      <ComponentPreview
        name="FramerChart"
        description="Pure SVG chart with monotone cubic interpolation, gradient fills, and smooth animations"
        importPath="@/components/framer-analytics"
        props={[
          { name: "data", type: "DataPoint[]", required: true, description: "Array of {date, value} objects" },
          { name: "height", type: "number", description: "Chart height in pixels" },
          { name: "lineColor", type: "string", description: "Line stroke color" },
          { name: "showGrid", type: "boolean", description: "Show grid lines" },
        ]}
      >
        <FramerChart data={chartData} height={280} lineColor={FRAMER_CHART_COLORS.primaryLine} />
      </ComponentPreview>

      {/* Metrics Row */}
      <ComponentPreview
        name="FramerMetrics"
        description="Horizontal metrics row with live indicators and trend badges"
        importPath="@/components/framer-analytics"
      >
        <FramerMetrics metrics={metrics} />
      </ComponentPreview>

      {/* Metric Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Metric Cards</h3>
        <ComponentGrid columns={4}>
          <ComponentPreview name="FramerMetricCard" description="Individual metric card" importPath="@/components/framer-analytics" variant="compact">
            <FramerMetricCard label="Views" value={125000} compact trend={{ value: 12, direction: "up" }} />
          </ComponentPreview>
          <ComponentPreview name="FramerMetricCard" description="With currency prefix" importPath="@/components/framer-analytics" variant="compact">
            <FramerMetricCard label="Revenue" value={4250} prefix="$" />
          </ComponentPreview>
          <ComponentPreview name="FramerMetricCard" description="With percentage suffix" importPath="@/components/framer-analytics" variant="compact">
            <FramerMetricCard label="CTR" value={3.8} suffix="%" />
          </ComponentPreview>
          <ComponentPreview name="FramerMetricCard" description="Down trend" importPath="@/components/framer-analytics" variant="compact">
            <FramerMetricCard label="Bounce Rate" value={42} suffix="%" trend={{ value: 5, direction: "down" }} />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Date Controls */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Date Controls</h3>
        <ComponentGrid columns={2}>
          <ComponentPreview name="FramerDateSelector" description="Dropdown date range selector" importPath="@/components/framer-analytics">
            <FramerDateSelector value={selectedDateRange} onChange={setSelectedDateRange} />
          </ComponentPreview>
          <ComponentPreview name="FramerDatePills" description="Pill-style date range buttons" importPath="@/components/framer-analytics">
            <FramerDatePills value={selectedDateRange} onChange={setSelectedDateRange} />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Breakdown Lists */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Breakdown Components</h3>
        <ComponentGrid columns={2}>
          <ComponentPreview name="FramerCountryList" description="Country breakdown with flags and percentages" importPath="@/components/framer-analytics">
            <FramerCountryList data={sampleCountryData} />
          </ComponentPreview>
          <ComponentPreview name="FramerDeviceList" description="Device breakdown with icons" importPath="@/components/framer-analytics">
            <FramerDeviceList data={sampleDeviceData} />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Creator Components */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Creator Components</h3>
        <ComponentPreview name="CreatorAvatarRow" description="Row of creator avatars with platform colors" importPath="@/components/framer-analytics">
          <CreatorAvatarRow creators={creators} />
        </ComponentPreview>
      </div>

      {/* Campaign Components */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Campaign Components</h3>
        <ComponentGrid columns={1}>
          <ComponentPreview
            name="CampaignOverviewCard"
            description="Campaign summary with metrics, chart, and status"
            importPath="@/components/framer-analytics"
          >
            <CampaignOverviewCard
              name="Q4 Holiday Campaign"
              status="active"
              dateRange="Dec 1 - Dec 31, 2024"
              metrics={[
                { label: "Total Views", value: 2500000, trend: { value: 15, direction: "up" } },
                { label: "Engagement", value: "4.8%", trend: { value: 8, direction: "up" } },
                { label: "CPM", value: "$3.20" },
                { label: "Creators", value: 12 },
              ]}
              chartData={chartData}
            />
          </ComponentPreview>

          <ComponentPreview
            name="AnalyticsSummaryCard"
            description="Comprehensive analytics summary with multiple metrics and trends"
            importPath="@/components/framer-analytics"
          >
            <AnalyticsSummaryCard
              title="Campaign Performance"
              metrics={[
                { label: "Total Reach", value: 5200000, trend: { value: 22, direction: "up" }, format: "compact" },
                { label: "Impressions", value: 12500000, trend: { value: 18, direction: "up" }, format: "compact" },
                { label: "Clicks", value: 125000, trend: { value: 5, direction: "down" }, format: "compact" },
                { label: "Conversions", value: 8500, format: "number" },
              ]}
            />
          </ComponentPreview>
        </ComponentGrid>
      </div>

      {/* Budget Selector */}
      <ComponentPreview
        name="CampaignBudgetSelector"
        description="Premium budget slider with visualizations and creator estimates"
        importPath="@/components/framer-analytics"
        previewClassName="max-w-2xl"
      >
        <CampaignBudgetSelector
          minBudget={5000}
          maxBudget={100000}
          defaultBudget={25000}
          currency="USD"
          onBudgetChange={(budget) => console.log("Budget:", budget)}
        />
      </ComponentPreview>

      {/* Payout Card */}
      <ComponentPreview
        name="CreatorPayoutCard"
        description="Creator cash out form with payment method selection"
        importPath="@/components/framer-analytics"
        previewClassName="max-w-md"
      >
        <CreatorPayoutCard
          availableBalance={1250.00}
          pendingBalance={350.00}
          paymentMethods={[
            { id: "1", type: "bank", name: "Bank Account", last4: "4242", isDefault: true },
            { id: "2", type: "paypal", name: "PayPal", email: "creator@email.com" },
          ]}
          onSubmit={(data) => console.log("Payout:", data)}
        />
      </ComponentPreview>

      {/* Base Card */}
      <ComponentPreview
        name="FramerCard"
        description="Base card component with glass styling and border effects"
        importPath="@/components/framer-analytics"
      >
        <FramerCard>
          <p className="text-white/60">This is the base FramerCard component used throughout the analytics system. It features a glass morphism effect with subtle borders.</p>
        </FramerCard>
      </ComponentPreview>

      {/* Component Directory */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">All Analytics Components</h3>
        <FramerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "InsightsCard", "CreatorLeaderboard", "AnalyticsOverview",
              "FramerChart", "FramerDashboard", "FramerOverviewCard", "FramerMetrics",
              "FramerMetricCard", "FramerCard", "FramerDateSelector", "FramerDatePills",
              "FramerCountryList", "FramerDeviceList", "FramerChat", "FramerChatLayout",
              "CampaignOverviewCard", "CampaignBudgetSelector", "CreatorPayoutCard", "AnalyticsSummaryCard",
              "CreatorAvatarRow", "VideoPreviewModal", "MetricSettingsPopover", "CampaignsDashboard",
            ].map((name) => {
              const isNewComponent = ["InsightsCard", "CreatorLeaderboard", "AnalyticsOverview"].includes(name);
              return (
                <ComponentCard 
                  key={name} 
                  name={name} 
                  importPath={isNewComponent ? "@/components/analytics" : "@/components/framer-analytics"} 
                  color="cyan" 
                />
              );
            })}
          </div>
        </FramerCard>
      </div>
    </div>
  );
}
