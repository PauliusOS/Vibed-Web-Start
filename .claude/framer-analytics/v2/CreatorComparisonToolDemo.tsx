"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FramerCard } from "../FramerCard";
import { FramerChart } from "../FramerChart";
import { FramerDateSelector } from "../FramerDateSelector";
import { CreatorAvatarRow } from "../CreatorAvatarRow";
import type { Creator } from "../CreatorAvatarRow";
import type { CreatorChartData } from "../FramerChart";
import { FRAMER_TEXT_COLORS, CREATOR_COLORS } from "../constants/colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompactNumber } from "../utils/formatters";
import { Sparkles, TrendingUp, TrendingDown, Eye, Heart, MessageCircle, BarChart3 } from "lucide-react";

// Sample creators matching the dashboard format
const SAMPLE_CREATORS: Creator[] = [
  {
    id: "creator_1",
    name: "Sarah Johnson",
    username: "sarahjcreates",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "tiktok",
    color: CREATOR_COLORS[0],
  },
  {
    id: "creator_2",
    name: "Mike Chen",
    username: "mikechenlife",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "instagram",
    color: CREATOR_COLORS[1],
  },
  {
    id: "creator_3",
    name: "Emma Wilson",
    username: "emmawilson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    platform: "tiktok",
    color: CREATOR_COLORS[2],
  },
  {
    id: "creator_4",
    name: "Alex Rivera",
    username: "alexrivera_",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    platform: "instagram",
    color: CREATOR_COLORS[3],
  },
  {
    id: "creator_5",
    name: "Olivia Martinez",
    username: "oliviamartinez",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    platform: "tiktok",
    color: CREATOR_COLORS[4],
  },
  {
    id: "creator_6",
    name: "James Park",
    username: "jamespark_",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    platform: "instagram",
    color: CREATOR_COLORS[5],
  },
];

// Seeded random for consistent data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Performance metric types
type PerformanceMetric = "views" | "avgViews" | "engagement" | "avgEngagement";

// Performance metric config
const PERFORMANCE_METRICS: Array<{
  key: PerformanceMetric;
  label: string;
  shortLabel: string;
}> = [
  { key: "views", label: "Total Views", shortLabel: "Views" },
  { key: "avgViews", label: "Avg. Views", shortLabel: "Avg Views" },
  { key: "engagement", label: "Total Engagement", shortLabel: "Engagement" },
  { key: "avgEngagement", label: "Avg. Engagement", shortLabel: "Avg Eng." },
];

export function CreatorComparisonToolDemo() {
  const [activeCreators, setActiveCreators] = useState<Set<string>>(new Set());
  const [dateRangeValue, setDateRangeValue] = useState("30d");
  const [activeMetric, setActiveMetric] = useState<PerformanceMetric>("views");

  // Build creator stats with performance metrics
  const creatorStats = useMemo(() => {
    return SAMPLE_CREATORS.map((creator, index) => {
      const seed = index * 100;
      const baseViews = 200000 + seededRandom(seed) * 800000;
      const baseLikes = baseViews * (0.03 + seededRandom(seed + 1) * 0.05);
      const baseComments = baseLikes * (0.1 + seededRandom(seed + 2) * 0.1);
      const videoCount = 3 + Math.floor(seededRandom(seed + 3) * 5);
      
      const totalEngagement = Math.round(baseLikes + baseComments);
      const avgViewsPerVideo = Math.round(baseViews / videoCount);
      const avgEngagement = Math.round(totalEngagement / videoCount);
      const engagementRate = ((baseLikes + baseComments) / baseViews) * 100;
      
      // Trend data (percentage change)
      const viewsTrend = -5 + seededRandom(seed + 11) * 20; // -5% to +15%
      const engagementTrend = -3 + seededRandom(seed + 12) * 18; // -3% to +15%

      return {
        ...creator,
        totalViews: Math.round(baseViews),
        totalLikes: Math.round(baseLikes),
        totalComments: Math.round(baseComments),
        totalEngagement,
        videoCount,
        engagementRate,
        avgViewsPerVideo,
        avgEngagement,
        viewsTrend,
        engagementTrend,
      };
    }).sort((a, b) => b.totalViews - a.totalViews);
  }, []);

  // Generate chart data for selected creators based on active metric
  const creatorChartData = useMemo<CreatorChartData[]>(() => {
    return creatorStats
      .filter((c) => activeCreators.has(c.id))
      .map((creator, creatorIdx) => {
        const days = dateRangeValue === "7d" ? 7 : dateRangeValue === "14d" ? 14 : dateRangeValue === "90d" ? 90 : 30;
        
        // Generate data based on active metric
        const baseValue = (() => {
          switch (activeMetric) {
            case "views": return creator.totalViews / 1000; // Scale down for chart
            case "avgViews": return creator.avgViewsPerVideo / 1000;
            case "engagement": return creator.totalEngagement / 100;
            case "avgEngagement": return creator.avgEngagement / 100;
            default: return creator.totalViews / 1000;
          }
        })();
        
        const data = Array.from({ length: days }, (_, i) => {
          const seed = creatorIdx * 1000 + i;
          const variance = 0.7 + seededRandom(seed) * 0.6;
          return Math.round(baseValue * variance);
        });
        
        return {
          creatorId: creator.id,
          color: creator.color,
          name: creator.name,
          data,
        };
      });
  }, [activeCreators, creatorStats, dateRangeValue, activeMetric]);

  // Generate basic chart data for the timeline
  const chartData = useMemo(() => {
    const days = dateRangeValue === "7d" ? 7 : dateRangeValue === "14d" ? 14 : dateRangeValue === "90d" ? 90 : 30;
    const now = Date.now();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(now - (days - i - 1) * 24 * 60 * 60 * 1000);
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        primary: 1000 + Math.random() * 500,
        secondary: 800 + Math.random() * 400,
      };
    });
  }, [dateRangeValue]);

  // Date range for chart
  const dateRange = useMemo(() => {
    const days = dateRangeValue === "7d" ? 7 : dateRangeValue === "14d" ? 14 : dateRangeValue === "90d" ? 90 : 30;
    const end = Date.now();
    const start = end - days * 24 * 60 * 60 * 1000;
    return { start, end };
  }, [dateRangeValue]);

  // Toggle creator
  const toggleCreator = (creatorId: string) => {
    setActiveCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else if (next.size < 6) {
        next.add(creatorId);
      }
      return next;
    });
  };

  // Calculate aggregate stats for selected creators
  const aggregateStats = useMemo(() => {
    const selectedCreators = creatorStats.filter((c) => activeCreators.has(c.id));
    if (selectedCreators.length === 0) return null;
    
    const totalViews = selectedCreators.reduce((sum, c) => sum + c.totalViews, 0);
    const avgViews = Math.round(totalViews / selectedCreators.length);
    const totalEngagement = selectedCreators.reduce((sum, c) => sum + c.totalEngagement, 0);
    const avgEngagement = Math.round(totalEngagement / selectedCreators.length);
    const avgEngagementRate = selectedCreators.reduce((sum, c) => sum + c.engagementRate, 0) / selectedCreators.length;
    
    return {
      totalViews,
      avgViews,
      totalEngagement,
      avgEngagement,
      avgEngagementRate,
    };
  }, [activeCreators, creatorStats]);

  // Get trend color
  const getTrendColor = (trend: number): string => {
    return trend >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";
  };

  return (
    <FramerCard padding="lg">
      <div className="space-y-6">
        {/* Header with Ask Echo button */}
        <div className="flex items-center justify-between">
          <h3
            className="font-semibold text-xl"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            Compare Creators
          </h3>
          <div className="flex items-center gap-3">
            {activeCreators.size === 0 && (
              <Badge
                variant="outline"
                className="border-white/10 text-white/50 text-[11px]"
              >
                Click avatars to compare (up to 6)
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
            >
              <Sparkles className="w-4 h-4" />
              Ask Echo
            </Button>
          </div>
        </div>

        {/* Creator Row with Date Selector */}
        <div className="flex items-center justify-between gap-6">
          {/* Creator Avatar Row (left side) */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="text-sm font-medium"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              Creators
            </span>
            <CreatorAvatarRow
              creators={SAMPLE_CREATORS}
              activeCreators={activeCreators}
              onToggleCreator={toggleCreator}
            />
          </div>

          {/* Date Selector (right) */}
          <FramerDateSelector
            variant="dropdown"
            value={dateRangeValue}
            onChange={(value) => setDateRangeValue(value)}
          />
        </div>

        {/* Performance Metrics Comparison Header */}
        {aggregateStats && (
          <div 
            className="grid grid-cols-4 gap-4 p-4 rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)" }}
          >
            {PERFORMANCE_METRICS.map((metric) => {
              const isActive = activeMetric === metric.key;
              const value = (() => {
                switch (metric.key) {
                  case "views": return aggregateStats.totalViews;
                  case "avgViews": return aggregateStats.avgViews;
                  case "engagement": return aggregateStats.totalEngagement;
                  case "avgEngagement": return aggregateStats.avgEngagement;
                  default: return 0;
                }
              })();
              
              return (
                <motion.button
                  key={metric.key}
                  onClick={() => setActiveMetric(metric.key)}
                  className="text-left p-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    border: isActive ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  }}
                  whileHover={{ backgroundColor: isActive ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.03)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span 
                    className="text-[10px] uppercase tracking-wider block mb-1"
                    style={{ color: isActive ? "rgb(59, 130, 246)" : FRAMER_TEXT_COLORS.muted }}
                  >
                    {metric.label}
                  </span>
                  <span 
                    className="text-xl font-semibold tabular-nums"
                    style={{ color: isActive ? "rgb(59, 130, 246)" : FRAMER_TEXT_COLORS.primary }}
                  >
                    {formatCompactNumber(value)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Empty state for metrics */}
        {!aggregateStats && (
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)" }}
          >
            <BarChart3 className="w-5 h-5 mx-auto mb-2" style={{ color: FRAMER_TEXT_COLORS.muted }} />
            <p className="text-sm" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              Select creators to compare performance metrics
            </p>
          </div>
        )}

        {/* Chart Area */}
        {activeCreators.size === 0 ? (
          <div
            className="h-[280px] flex items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.04)" }}
          >
            <div className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
              <p
                className="text-lg font-semibold mb-2"
                style={{ color: FRAMER_TEXT_COLORS.primary }}
              >
                Select Creators to Compare
              </p>
              <p
                className="text-sm max-w-sm"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                Click on creator avatars above to visualize and compare their
                performance across different metrics.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Active metric indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                  Comparing:
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: "rgb(59, 130, 246)" }}
                >
                  {PERFORMANCE_METRICS.find(m => m.key === activeMetric)?.label}
                </span>
              </div>
              {/* Creator legend */}
              <div className="flex items-center gap-3">
                {creatorStats
                  .filter((c) => activeCreators.has(c.id))
                  .map((creator) => (
                    <div key={creator.id} className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: creator.color }}
                      />
                      <span className="text-[11px]" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                        {creator.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <FramerChart
              data={chartData}
              height={280}
              showGrid={false}
              showYAxis={true}
              showXAxis={true}
              creatorData={creatorChartData}
              activeCreators={activeCreators}
              dateRange={dateRange}
            />
          </div>
        )}

        {/* Selected Creator Stats Grid - Elegant Cards */}
        <AnimatePresence>
          {activeCreators.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creatorStats
                  .filter((c) => activeCreators.has(c.id))
                  .map((creator, index) => (
                    <motion.div
                      key={creator.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      {/* Color accent bar */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: creator.color }}
                      />
                      
                      <div className="p-5 pt-6">
                        {/* Creator header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="relative">
                            <img 
                              src={creator.profilePicture} 
                              alt={creator.name}
                              className="w-12 h-12 rounded-full object-cover ring-2"
                              style={{ 
                                ringColor: creator.color,
                                boxShadow: `0 0 20px ${creator.color}30`
                              }}
                            />
                            <div 
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                              style={{ 
                                backgroundColor: creator.color,
                                color: "white"
                              }}
                            >
                              {creator.videoCount}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-[15px] font-semibold block truncate"
                              style={{ color: FRAMER_TEXT_COLORS.primary }}
                            >
                              {creator.name}
                            </span>
                            <span
                              className="text-[12px] truncate block"
                              style={{ color: creator.color }}
                            >
                              @{creator.username}
                            </span>
                          </div>
                        </div>

                        {/* Performance metrics grid */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Views */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ 
                              backgroundColor: activeMetric === "views" ? `${creator.color}15` : "rgba(255, 255, 255, 0.02)",
                              border: activeMetric === "views" ? `1px solid ${creator.color}30` : "1px solid transparent"
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Eye className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
                              <span className="text-[10px] uppercase tracking-wider" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                                Views
                              </span>
                            </div>
                            <span
                              className="text-lg font-semibold tabular-nums block"
                              style={{ color: activeMetric === "views" ? creator.color : FRAMER_TEXT_COLORS.primary }}
                            >
                              {formatCompactNumber(creator.totalViews)}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                              {creator.viewsTrend >= 0 ? (
                                <TrendingUp className="w-3 h-3" style={{ color: getTrendColor(creator.viewsTrend) }} />
                              ) : (
                                <TrendingDown className="w-3 h-3" style={{ color: getTrendColor(creator.viewsTrend) }} />
                              )}
                              <span 
                                className="text-[10px] font-medium"
                                style={{ color: getTrendColor(creator.viewsTrend) }}
                              >
                                {creator.viewsTrend >= 0 ? "+" : ""}{creator.viewsTrend.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          {/* Avg Views */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ 
                              backgroundColor: activeMetric === "avgViews" ? `${creator.color}15` : "rgba(255, 255, 255, 0.02)",
                              border: activeMetric === "avgViews" ? `1px solid ${creator.color}30` : "1px solid transparent"
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <BarChart3 className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
                              <span className="text-[10px] uppercase tracking-wider" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                                Avg Views
                              </span>
                            </div>
                            <span
                              className="text-lg font-semibold tabular-nums block"
                              style={{ color: activeMetric === "avgViews" ? creator.color : FRAMER_TEXT_COLORS.primary }}
                            >
                              {formatCompactNumber(creator.avgViewsPerVideo)}
                            </span>
                            <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                              per video
                            </span>
                          </div>

                          {/* Engagement */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ 
                              backgroundColor: activeMetric === "engagement" ? `${creator.color}15` : "rgba(255, 255, 255, 0.02)",
                              border: activeMetric === "engagement" ? `1px solid ${creator.color}30` : "1px solid transparent"
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Heart className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
                              <span className="text-[10px] uppercase tracking-wider" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                                Engagement
                              </span>
                            </div>
                            <span
                              className="text-lg font-semibold tabular-nums block"
                              style={{ color: activeMetric === "engagement" ? creator.color : FRAMER_TEXT_COLORS.primary }}
                            >
                              {formatCompactNumber(creator.totalEngagement)}
                            </span>
                            <div className="flex items-center gap-1 mt-1">
                              {creator.engagementTrend >= 0 ? (
                                <TrendingUp className="w-3 h-3" style={{ color: getTrendColor(creator.engagementTrend) }} />
                              ) : (
                                <TrendingDown className="w-3 h-3" style={{ color: getTrendColor(creator.engagementTrend) }} />
                              )}
                              <span 
                                className="text-[10px] font-medium"
                                style={{ color: getTrendColor(creator.engagementTrend) }}
                              >
                                {creator.engagementTrend >= 0 ? "+" : ""}{creator.engagementTrend.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          {/* Avg Engagement */}
                          <div 
                            className="p-3 rounded-lg"
                            style={{ 
                              backgroundColor: activeMetric === "avgEngagement" ? `${creator.color}15` : "rgba(255, 255, 255, 0.02)",
                              border: activeMetric === "avgEngagement" ? `1px solid ${creator.color}30` : "1px solid transparent"
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <MessageCircle className="w-3 h-3" style={{ color: FRAMER_TEXT_COLORS.muted }} />
                              <span className="text-[10px] uppercase tracking-wider" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                                Avg Eng.
                              </span>
                            </div>
                            <span
                              className="text-lg font-semibold tabular-nums block"
                              style={{ color: activeMetric === "avgEngagement" ? creator.color : FRAMER_TEXT_COLORS.primary }}
                            >
                              {formatCompactNumber(creator.avgEngagement)}
                            </span>
                            <span 
                              className="text-[10px] font-medium"
                              style={{ color: creator.engagementRate >= 5 ? "rgb(34, 197, 94)" : creator.engagementRate >= 3 ? "rgb(251, 191, 36)" : "rgb(249, 115, 22)" }}
                            >
                              {creator.engagementRate.toFixed(1)}% rate
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FramerCard>
  );
}
