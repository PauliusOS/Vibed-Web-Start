"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  GitCompare,
  Eye,
  Heart,
  MessageCircle,
  Video,
  TrendingUp,
  BarChart3,
  Activity,
  Target,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Blue gradient scale - darkest blue = best performance
const PERFORMANCE_BLUES = [
  '#2563EB', // #1 - Dark blue (best)
  '#3B82F6', // #2 - Blue
  '#38BDF8', // #3 - Sky blue
  '#60A5FA', // #4 - Light blue
  '#93C5FD', // #5 - Lighter blue
  '#BFDBFE', // #6 - Lightest blue
];

const getPerformanceBlue = (rank: number): string => {
  const index = Math.min(rank - 1, PERFORMANCE_BLUES.length - 1);
  return PERFORMANCE_BLUES[Math.max(0, index)];
};

// Chart config for bar chart
const barChartConfig = {
  views: {
    label: "Views",
    color: "#2563EB",
  },
  engagement: {
    label: "Engagement",
    color: "#38BDF8",
  },
} satisfies ChartConfig;

interface CreatorComparisonToolProps {
  campaignId: Id<"campaigns">;
}

type ChartView = "line" | "bar" | "radar";
type MetricType = "views" | "engagement" | "both";

export function CreatorComparisonTool({ campaignId }: CreatorComparisonToolProps) {
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [chartView, setChartView] = useState<ChartView>("line");
  const [metricType, setMetricType] = useState<MetricType>("views");
  const [timeRange, setTimeRange] = useState<number>(30);

  // Fetch creator analytics
  const creatorAnalytics = useQuery(api.analytics.getCampaignCreatorAnalytics, {
    campaignId,
    days: timeRange,
  });

  const isLoading = creatorAnalytics === undefined;

  // Build aggregated creator stats
  const creatorStats = useMemo(() => {
    if (!creatorAnalytics) return [];

    const stats = new Map<
      string,
      {
        id: string;
        name: string;
        username: string;
        profilePicture: string;
        platform: string;
        color: string;
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalEngagement: number;
        videoCount: number;
        engagementRate: number;
        avgViewsPerVideo: number;
        avgEngagementPerVideo: number;
      }
    >();

    // Initialize with creator info
    creatorAnalytics.creators.forEach((creator) => {
      stats.set(creator.id, {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        profilePicture: creator.profilePicture,
        platform: creator.platform,
        color: creator.color,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalEngagement: 0,
        videoCount: 0,
        engagementRate: 0,
        avgViewsPerVideo: 0,
        avgEngagementPerVideo: 0,
      });
    });

    // Aggregate from posts
    creatorAnalytics.posts.forEach((post) => {
      const creatorStat = stats.get(post.creatorId);
      if (creatorStat) {
        creatorStat.totalViews += post.views;
        creatorStat.totalLikes += post.likes;
        creatorStat.totalComments += post.comments;
        creatorStat.totalEngagement += post.likes + post.comments;
        creatorStat.videoCount += 1;
      }
    });

    // Calculate rates and averages
    stats.forEach((s) => {
      if (s.totalViews > 0) {
        s.engagementRate = (s.totalEngagement / s.totalViews) * 100;
      }
      if (s.videoCount > 0) {
        s.avgViewsPerVideo = s.totalViews / s.videoCount;
        s.avgEngagementPerVideo = s.totalEngagement / s.videoCount;
      }
    });

    // Sort by views and assign blue gradient colors based on rank
    const sorted = Array.from(stats.values()).sort((a, b) => b.totalViews - a.totalViews);
    sorted.forEach((creator, index) => {
      creator.color = getPerformanceBlue(index + 1);
    });
    
    return sorted;
  }, [creatorAnalytics]);

  // Build time series data for selected creators
  const timeSeriesData = useMemo(() => {
    if (!creatorAnalytics || selectedCreators.length === 0) return [];

    const dateMap = new Map<
      string,
      Record<string, { views: number; engagement: number }>
    >();

    creatorAnalytics.creatorMetrics.forEach((metric) => {
      if (!selectedCreators.includes(metric.creatorId)) return;

      if (!dateMap.has(metric.date)) {
        dateMap.set(metric.date, {});
      }
      const dateData = dateMap.get(metric.date)!;
      if (!dateData[metric.creatorId]) {
        dateData[metric.creatorId] = { views: 0, engagement: 0 };
      }
      dateData[metric.creatorId].views += metric.views;
      dateData[metric.creatorId].engagement += metric.engagement;
    });

    // Convert to array format for charts
    const chartData = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, creatorData]) => {
        const point: Record<string, number | string> = {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };

        selectedCreators.forEach((creatorId) => {
          const creator = creatorStats.find((c) => c.id === creatorId);
          if (creator) {
            const data = creatorData[creatorId] || { views: 0, engagement: 0 };
            point[`${creator.name}_views`] = data.views;
            point[`${creator.name}_engagement`] = data.engagement;
          }
        });

        return point;
      });

    return chartData;
  }, [creatorAnalytics, selectedCreators, creatorStats]);

  // Build radar chart data for comparison
  const radarData = useMemo(() => {
    if (selectedCreators.length === 0) return [];

    const selectedStats = creatorStats.filter((c) =>
      selectedCreators.includes(c.id)
    );

    // Normalize values to 0-100 scale for radar chart
    const maxViews = Math.max(...selectedStats.map((c) => c.totalViews), 1);
    const maxEngagement = Math.max(
      ...selectedStats.map((c) => c.totalEngagement),
      1
    );
    const maxVideos = Math.max(...selectedStats.map((c) => c.videoCount), 1);
    const maxRate = Math.max(...selectedStats.map((c) => c.engagementRate), 1);
    const maxAvgViews = Math.max(
      ...selectedStats.map((c) => c.avgViewsPerVideo),
      1
    );

    const metrics = [
      { name: "Views", key: "views" },
      { name: "Engagement", key: "engagement" },
      { name: "Videos", key: "videos" },
      { name: "Eng. Rate", key: "engagementRate" },
      { name: "Avg Views", key: "avgViews" },
    ];

    return metrics.map((metric) => {
      const point: Record<string, number | string> = { metric: metric.name };

      selectedStats.forEach((creator) => {
        let value = 0;
        switch (metric.key) {
          case "views":
            value = (creator.totalViews / maxViews) * 100;
            break;
          case "engagement":
            value = (creator.totalEngagement / maxEngagement) * 100;
            break;
          case "videos":
            value = (creator.videoCount / maxVideos) * 100;
            break;
          case "engagementRate":
            value = (creator.engagementRate / maxRate) * 100;
            break;
          case "avgViews":
            value = (creator.avgViewsPerVideo / maxAvgViews) * 100;
            break;
        }
        point[creator.name] = Math.round(value);
      });

      return point;
    });
  }, [selectedCreators, creatorStats]);

  // Build bar chart comparison data
  const barData = useMemo(() => {
    if (selectedCreators.length === 0) return [];

    return creatorStats
      .filter((c) => selectedCreators.includes(c.id))
      .map((creator) => ({
        name: creator.name,
        views: creator.totalViews,
        engagement: creator.totalEngagement,
        videos: creator.videoCount,
        color: creator.color,
      }));
  }, [selectedCreators, creatorStats]);

  // Dynamic chart config for line chart based on selected creators
  const lineChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    selectedCreators.forEach((creatorId) => {
      const creator = creatorStats.find((c) => c.id === creatorId);
      if (creator) {
        config[`${creator.name}_views`] = {
          label: `${creator.name} (Views)`,
          color: creator.color,
        };
      }
    });
    return config;
  }, [selectedCreators, creatorStats]);

  // Dynamic chart config for radar chart based on selected creators
  const radarChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    selectedCreators.forEach((creatorId) => {
      const creator = creatorStats.find((c) => c.id === creatorId);
      if (creator) {
        config[creator.name] = {
          label: creator.name,
          color: creator.color,
        };
      }
    });
    return config;
  }, [selectedCreators, creatorStats]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const toggleCreator = (creatorId: string) => {
    setSelectedCreators((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : prev.length < 6
        ? [...prev, creatorId]
        : prev
    );
  };

  const removeCreator = (creatorId: string) => {
    setSelectedCreators((prev) => prev.filter((id) => id !== creatorId));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-6">
          <Skeleton className="h-[400px] w-80 bg-white/10 rounded-xl" />
          <Skeleton className="h-[400px] flex-1 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  const selectedCreatorObjects = creatorStats.filter((c) =>
    selectedCreators.includes(c.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">
            Compare Creator Performance
          </h2>
          <Badge
            variant="outline"
            className="border-white/10 text-white/50 text-[11px]"
          >
            Select up to 6 creators
          </Badge>
        </div>

        {selectedCreators.length > 0 && (
          <div className="flex items-center gap-3">
            <Select
              value={timeRange.toString()}
              onValueChange={(v) => setTimeRange(parseInt(v))}
            >
              <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10 text-white text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="7" className="text-white text-[13px]">
                  Last 7 days
                </SelectItem>
                <SelectItem value="14" className="text-white text-[13px]">
                  Last 14 days
                </SelectItem>
                <SelectItem value="30" className="text-white text-[13px]">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90" className="text-white text-[13px]">
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <Button
                size="sm"
                variant={chartView === "line" ? "secondary" : "ghost"}
                className={
                  chartView === "line"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => setChartView("line")}
              >
                <Activity className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={chartView === "bar" ? "secondary" : "ghost"}
                className={
                  chartView === "bar"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => setChartView("bar")}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={chartView === "radar" ? "secondary" : "ghost"}
                className={
                  chartView === "radar"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }
                onClick={() => setChartView("radar")}
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Creator Selection Panel */}
        <GlassPanel className="w-80 p-4 flex-shrink-0">
          <h3 className="text-[13px] font-medium text-white mb-4">
            Select Creators to Compare
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {creatorStats.map((creator) => {
              const isSelected = selectedCreators.includes(creator.id);
              return (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/[0.02] border border-transparent hover:bg-white/5"
                  }`}
                  onClick={() => toggleCreator(creator.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={creator.profilePicture}
                      alt={creator.name}
                    />
                    <AvatarFallback
                      className="text-[10px]"
                      style={{ backgroundColor: creator.color }}
                    >
                      {creator.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">
                      {creator.name}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {formatNumber(creator.totalViews)} views
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: creator.color }}
                  />
                </motion.div>
              );
            })}
          </div>

          {selectedCreators.length >= 6 && (
            <p className="text-[11px] text-amber-400 mt-3">
              Maximum 6 creators selected
            </p>
          )}
        </GlassPanel>

        {/* Chart Area */}
        <div className="flex-1">
          {selectedCreators.length === 0 ? (
            <GlassPanel className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <GitCompare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select Creators to Compare
                </h3>
                <p className="text-[13px] text-white/50 max-w-sm">
                  Choose up to 6 creators from the list to visualize and compare
                  their performance metrics.
                </p>
              </div>
            </GlassPanel>
          ) : (
            <div className="space-y-4">
              {/* Selected Creators Tags */}
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedCreatorObjects.map((creator) => (
                    <motion.div
                      key={creator.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                      style={{
                        backgroundColor: `${creator.color}20`,
                        borderColor: `${creator.color}40`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: creator.color }}
                      />
                      <span className="text-[12px] text-white">
                        {creator.name}
                      </span>
                      <button
                        onClick={() => removeCreator(creator.id)}
                        className="text-white/50 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Chart */}
              <GlassPanel className="p-6">
                <div className="h-[420px]">
                  {chartView === "line" && (
                    <ChartContainer config={lineChartConfig} className="h-full w-full">
                      <LineChart
                        accessibilityLayer
                        data={timeSeriesData}
                        margin={{ left: 12, right: 12 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => formatNumber(value)}
                        />
                        <ChartTooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          content={<ChartTooltipContent />}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          formatter={(value) => (
                            <span className="text-muted-foreground text-sm">
                              {value.replace("_views", "")}
                            </span>
                          )}
                        />
                        {selectedCreatorObjects.map((creator) => (
                          <Line
                            key={`${creator.id}_views`}
                            type="monotone"
                            dataKey={`${creator.name}_views`}
                            stroke={creator.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: creator.color }}
                          />
                        ))}
                      </LineChart>
                    </ChartContainer>
                  )}

                  {chartView === "bar" && (
                    <ChartContainer config={barChartConfig} className="h-full w-full">
                      <BarChart
                        accessibilityLayer
                        data={barData}
                        layout="vertical"
                        margin={{ left: 12, right: 12 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis
                          type="number"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => formatNumber(value)}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          width={100}
                        />
                        <ChartTooltip
                          cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
                          content={<ChartTooltipContent />}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          formatter={(value) => (
                            <span className="text-muted-foreground text-sm">
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </span>
                          )}
                        />
                        <Bar
                          dataKey="views"
                          fill="var(--color-views)"
                          radius={[0, 8, 8, 0]}
                        />
                        <Bar
                          dataKey="engagement"
                          fill="var(--color-engagement)"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  )}

                  {chartView === "radar" && (
                    <ChartContainer config={radarChartConfig} className="h-full w-full">
                      <RadarChart data={radarData}>
                        <PolarGrid opacity={0.3} />
                        <PolarAngleAxis
                          dataKey="metric"
                          tickLine={false}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tickLine={false}
                          axisLine={false}
                        />
                        {selectedCreatorObjects.map((creator) => (
                          <Radar
                            key={creator.id}
                            name={creator.name}
                            dataKey={creator.name}
                            stroke={creator.color}
                            fill={creator.color}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          formatter={(value) => (
                            <span className="text-muted-foreground text-sm">{value}</span>
                          )}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                      </RadarChart>
                    </ChartContainer>
                  )}
                </div>
              </GlassPanel>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCreatorObjects.map((creator) => (
                  <GlassPanel
                    key={creator.id}
                    className="p-4"
                    style={{ borderColor: `${creator.color}30` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={creator.profilePicture}
                          alt={creator.name}
                        />
                        <AvatarFallback
                          className="text-[9px]"
                          style={{ backgroundColor: creator.color }}
                        >
                          {creator.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[12px] font-medium text-white truncate">
                        {creator.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-white/40">Views</p>
                        <p className="text-[13px] font-semibold text-white">
                          {formatNumber(creator.totalViews)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40">Engagement</p>
                        <p className="text-[13px] font-semibold text-white">
                          {formatNumber(creator.totalEngagement)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40">Videos</p>
                        <p className="text-[13px] font-semibold text-white">
                          {creator.videoCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40">Eng. Rate</p>
                        <p
                          className={`text-[13px] font-semibold ${
                            creator.engagementRate >= 5
                              ? "text-emerald-400"
                              : "text-white"
                          }`}
                        >
                          {creator.engagementRate.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
