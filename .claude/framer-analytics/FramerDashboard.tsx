"use client";

import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FramerChart } from "./FramerChart";
import type { CreatorChartData, PostMarker } from "./FramerChart";
import { FramerMetrics } from "./FramerMetrics";
import { FramerCard } from "./FramerCard";
import { FramerDateSelector } from "./FramerDateSelector";
import type { Creator } from "./CreatorAvatarRow";
import { VideoPreviewModal } from "./VideoPreviewModal";
import { MetricSettingsPopover } from "./MetricSettingsPopover";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
  FRAMER_CHART_COLORS,
} from "./constants/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDuration, formatNumber, formatCompactNumber, generateMultiMetricData } from "./utils/formatters";
import type { MultiMetricDataPoint } from "./utils/formatters";
import { ActivityIcon } from "@/components/ui/activity";
import { ChartLineIcon } from "@/components/ui/chart-line";

// Chart wrapper with interactive SylcRoad watermark
function ChartWithWatermark({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [smoothPos, setSmoothPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Smooth interpolation for mouse position
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPos(prev => ({
        x: lerp(prev.x, mousePos.x, 0.08),
        y: lerp(prev.y, mousePos.y, 0.08),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SylcRoad watermark with hover reveal effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1086 227"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Metallic blue gradient */}
            <linearGradient id="sylcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="20%" stopColor="#60a5fa" />
              <stop offset="40%" stopColor="#93c5fd" />
              <stop offset="60%" stopColor="#60a5fa" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            
            {/* Hover reveal radial gradient - uses smoothed position */}
            <radialGradient
              id="revealGradient"
              cx={`${smoothPos.x}%`}
              cy={`${smoothPos.y}%`}
              r="40%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            
            <mask id="revealMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#revealGradient)" />
            </mask>
          </defs>
          
          {/* Base text - subtle always visible */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#sylcGradient)"
            style={{
              fontFamily: "'Euclid Circular A', sans-serif",
              fontSize: "180px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: 0.035,
            }}
          >
            SylcRoad
          </text>
          
          {/* Hover reveal text - brighter on mouse */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#sylcGradient)"
            mask="url(#revealMask)"
            style={{
              fontFamily: "'Euclid Circular A', sans-serif",
              fontSize: "180px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: isHovered ? 0.12 : 0,
              transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            SylcRoad
          </text>
        </svg>
      </div>
      
      {/* Chart content on top */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Metric colors for chart lines (ordered by priority)
const METRIC_COLORS = {
  views: "rgb(25, 125, 255)", // Blue - primary (Avg Views)
  engagement: "rgb(34, 197, 94)", // Green (Engagement Rate)
  comments: "rgb(139, 92, 246)", // Purple (Comments)
  likes: "rgb(251, 191, 36)", // Amber (Likes)
  saves: "rgb(244, 114, 182)", // Pink (Saves)
  shares: "rgb(6, 182, 212)", // Cyan (Shares)
  cpm: "rgb(173, 133, 255)", // Light Purple (CPM)
  rosterCount: "rgb(249, 115, 22)", // Orange (Roster Count)
  // Legacy keys for backward compatibility
  totalComments: "rgb(139, 92, 246)", // Purple
  totalLikes: "rgb(251, 191, 36)", // Amber
} as const;

interface DataPoint {
  date: string;
  primary: number;
  secondary: number;
}

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

// Video post for the modal
interface VideoPost {
  creatorId: string;
  videoId: string;
  postedAt: number;
  thumbnailUrl: string;
  videoUrl: string;
  platform: "instagram" | "tiktok";
  views: number;
  likes: number;
  comments: number;
  shares?: number;
  cpm?: number;
  description: string;
}

interface FramerDashboardProps {
  chartData: DataPoint[];
  countryData: CountryData[];
  deviceData: DeviceData[];
  // New campaign-relevant metrics
  totalViews?: number;
  cpm?: number;
  totalComments?: number;
  totalLikes?: number;
  totalSaves?: number;
  totalShares?: number;
  rosterCount?: number;
  totalVideos?: number;
  title?: string;
  className?: string;
  onDateRangeChange?: (value: string, days: number) => void;
  // Creator analytics props
  creators?: Creator[];
  creatorChartData?: CreatorChartData[];
  videoPosts?: VideoPost[];
  dateRange?: { start: number; end: number };
  // Metric settings props (for admins/clients)
  enabledMetrics?: string[];
  onMetricSettingsChange?: (metrics: string[]) => void;
  isMetricSettingsSaving?: boolean;
  showMetricSettings?: boolean;
}

/**
 * FramerDashboard - Complete analytics dashboard matching Framer's style
 *
 * Combines all Framer Analytics components into a cohesive dashboard:
 * - Header with title and date selector
 * - Metrics row with live visitors
 * - Dual-line SVG chart
 * - Country and device breakdowns
 */
export function FramerDashboard({
  chartData,
  countryData,
  deviceData,
  // New campaign-relevant metrics
  totalViews = 1250000,
  cpm = 4.25,
  totalComments = 45000,
  totalLikes = 320000,
  totalSaves = 15000,
  totalShares = 8000,
  rosterCount = 12,
  totalVideos = 48,
  title = "Analytics",
  className,
  onDateRangeChange,
  // Creator analytics
  creators,
  creatorChartData,
  videoPosts,
  dateRange: propDateRange,
  // Metric settings
  enabledMetrics: propEnabledMetrics,
  onMetricSettingsChange,
  isMetricSettingsSaving = false,
  showMetricSettings = false,
}: FramerDashboardProps) {
  const [dateRangeValue, setDateRangeValue] = useState("30d");
  // Track which metrics are active (shown on chart)
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(["views"]));
  // All creators are always active on chart (no toggle filtering)
  const activeCreators = useMemo(() => {
    return new Set(creators?.map((c) => c.id) || []);
  }, [creators]);
  // Selected video for modal
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Find selected video and its creator
  const selectedVideo = useMemo(() => {
    if (!selectedVideoId || !videoPosts) return null;
    return videoPosts.find((v) => v.videoId === selectedVideoId) || null;
  }, [selectedVideoId, videoPosts]);

  const selectedVideoCreator = useMemo(() => {
    if (!selectedVideo || !creators) return null;
    return creators.find((c) => c.id === selectedVideo.creatorId) || null;
  }, [selectedVideo, creators]);


  // Convert video posts to post markers
  const postMarkers = useMemo<PostMarker[]>(() => {
    if (!videoPosts || !creators) return [];
    
    // Calculate average views per creator for performance comparison
    const creatorAvgViews: Record<string, number> = {};
    creators.forEach((creator) => {
      const creatorPosts = videoPosts.filter((p) => p.creatorId === creator.id);
      if (creatorPosts.length > 0) {
        creatorAvgViews[creator.id] = 
          creatorPosts.reduce((sum, p) => sum + (p.views || 0), 0) / creatorPosts.length;
      }
    });
    
    return videoPosts.map((post) => {
      const creator = creators.find((c) => c.id === post.creatorId);
      return {
        creatorId: post.creatorId,
        videoId: post.videoId,
        postedAt: post.postedAt,
        color: creator?.color || "#888888",
        thumbnailUrl: post.thumbnailUrl,
        views: post.views,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        cpm: post.cpm,
        avgViews: creatorAvgViews[post.creatorId] || post.views,
        creatorName: creator?.name || "",
        creatorAvatar: creator?.profilePicture || "",
        creatorUsername: creator?.username || "",
      };
    });
  }, [videoPosts, creators]);

  // Generate multi-metric data for the chart
  const multiMetricData = useMemo<MultiMetricDataPoint[]>(() => {
    // Sample fewer points for simpler chart
    const days = chartData.length;
    const rawData = generateMultiMetricData(days, 2000, 0.25);
    // Sample every 2nd point for more triangular shape
    return rawData.filter((_, i) => i % 2 === 0 || i === rawData.length - 1);
  }, [chartData.length]);

  // Toggle metric visibility
  const toggleMetric = (metricKey: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(metricKey)) {
        // Don't allow removing the last metric
        if (next.size > 1) {
          next.delete(metricKey);
        }
      } else {
        next.add(metricKey);
      }
      return next;
    });
  };

  // Calculate engagement rate (likes + comments / views * 100)
  const engagementRate = totalViews > 0
    ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1)
    : "0.0";

  // Default enabled metrics (including saves and shares)
  const defaultEnabledMetrics = ["views", "engagement", "comments", "likes", "saves", "shares"];
  const enabledMetrics = propEnabledMetrics || defaultEnabledMetrics;
  
  // Platform filter state
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set(["instagram", "tiktok"]));

  // All available metrics configuration (ordered by priority: views > engagement > comments > likes > saves > shares)
  const allMetricsConfig = useMemo(() => [
    {
      key: "views",
      label: "Avg Views",
      value: totalViews,
      displayValue: formatCompactNumber(totalViews),
      color: METRIC_COLORS.views,
      priority: 1,
    },
    {
      key: "engagement",
      label: "Engagement",
      value: parseFloat(engagementRate),
      displayValue: `${engagementRate}%`,
      color: METRIC_COLORS.engagement,
      priority: 2,
    },
    {
      key: "comments",
      label: "Comments",
      value: totalComments,
      displayValue: formatCompactNumber(totalComments),
      color: METRIC_COLORS.comments,
      priority: 3,
    },
    {
      key: "likes",
      label: "Likes",
      value: totalLikes,
      displayValue: formatCompactNumber(totalLikes),
      color: METRIC_COLORS.likes,
      priority: 4,
    },
    {
      key: "saves",
      label: "Saves",
      value: totalSaves,
      displayValue: formatCompactNumber(totalSaves),
      color: METRIC_COLORS.saves,
      priority: 5,
    },
    {
      key: "shares",
      label: "Shares",
      value: totalShares,
      displayValue: formatCompactNumber(totalShares),
      color: METRIC_COLORS.shares,
      priority: 6,
    },
    {
      key: "cpm",
      label: "CPM",
      value: cpm,
      displayValue: `$${cpm.toFixed(2)}`,
      color: METRIC_COLORS.cpm,
      priority: 7,
    },
  ], [totalViews, engagementRate, totalComments, totalLikes, totalSaves, totalShares, cpm]);

  // Filter and sort metrics based on enabled settings
  const metricsConfig = useMemo(() => {
    return allMetricsConfig
      .filter((m) => enabledMetrics.includes(m.key))
      .sort((a, b) => a.priority - b.priority);
  }, [allMetricsConfig, enabledMetrics]);

  const handleDateChange = (value: string, days: number) => {
    setDateRangeValue(value);
    onDateRangeChange?.(value, days);
  };

  // Handle post marker click
  const handlePostMarkerClick = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6", className)}
    >
      {/* Main Content Card */}
      <FramerCard padding="lg" interactiveGlow>
        <div className="space-y-6">
          {/* Insights Header with Campaign Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2 shrink-0">
              <ActivityIcon size={20} className="text-blue-400" />
              <h3
                className="font-semibold"
                style={{
                  color: FRAMER_TEXT_COLORS.primary,
                  fontFamily: FRAMER_TYPOGRAPHY.body,
                  fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                  fontSize: "20px",
                }}
              >
                Insights
              </h3>
            </div>
            
            {/* Campaign Overview Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                    fontSize: "12px",
                  }}
                >
                  Views
                </span>
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "20px",
                  }}
                >
                  {formatCompactNumber(totalViews || 0)}
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                    fontSize: "12px",
                  }}
                >
                  Likes
                </span>
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "20px",
                  }}
                >
                  {formatCompactNumber(totalLikes || 0)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                    fontSize: "12px",
                  }}
                >
                  Comments
                </span>
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "20px",
                  }}
                >
                  {formatCompactNumber(totalComments || 0)}
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: FRAMER_TEXT_COLORS.primary,
                      fontFamily: FRAMER_TYPOGRAPHY.body,
                      fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                      fontSize: "12px",
                    }}
                  >
                    CPM
                  </span>
                  {/* Orange pulsing live indicator with glow */}
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: "rgba(251, 146, 60, 0.5)" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ 
                        backgroundColor: "rgb(251, 146, 60)",
                        boxShadow: "0 0 8px rgba(251, 146, 60, 0.6), 0 0 12px rgba(251, 146, 60, 0.4)"
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      color: FRAMER_TEXT_COLORS.primary,
                      fontFamily: FRAMER_TYPOGRAPHY.body,
                      fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                      fontSize: "20px",
                    }}
                  >
                    ${(cpm || 0).toFixed(2)}
                  </span>
                  {(cpm || 0) < 4 ? (
                    <svg width="12" height="12" viewBox="0 0 10 10">
                      <path d="M5 2L8 6H2L5 2Z" fill="rgb(34, 197, 94)" />
                    </svg>
                  ) : (cpm || 0) < 6 ? (
                    <svg width="12" height="12" viewBox="0 0 10 10">
                      <path d="M2 5H8" stroke="rgb(251, 146, 60)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 10 10">
                      <path d="M5 8L8 4H2L5 8Z" fill="rgb(239, 68, 68)" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                    fontSize: "12px",
                  }}
                >
                  Roster
                </span>
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "20px",
                  }}
                >
                  {rosterCount || 0}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
                    fontSize: "12px",
                  }}
                >
                  Videos
                </span>
                <span
                  style={{
                    color: FRAMER_TEXT_COLORS.primary,
                    fontFamily: FRAMER_TYPOGRAPHY.body,
                    fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
                    fontSize: "20px",
                  }}
                >
                  {totalVideos || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          />

          {/* Date Selector and Metric Cards Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Date Selector (left side) */}
            <div className="flex items-center gap-3 shrink-0">
              <FramerDateSelector
                variant="dropdown"
                value={dateRangeValue}
                onChange={handleDateChange}
              />
            </div>

            {/* Metric Cards (right side - with settings) */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {metricsConfig.map((metric) => {
                const isActive = activeMetrics.has(metric.key);
                return (
                  <motion.button
                    key={metric.key}
                    onClick={() => toggleMetric(metric.key)}
                    className="relative flex flex-col items-center px-4 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                      border: isActive
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className="text-[10px] leading-tight"
                      style={{
                        color: isActive
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      {metric.label}
                    </span>
                    <span
                      className="text-sm font-semibold leading-tight"
                      style={{
                        color: isActive
                          ? FRAMER_TEXT_COLORS.primary
                          : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {metric.displayValue}
                    </span>
                    {/* Colored underline indicator */}
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ backgroundColor: metric.color }}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scaleX: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-6 mx-1 hidden sm:block" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

              {/* Platforms Dropdown */}
              <Select
                value={
                  activePlatforms.has("instagram") && activePlatforms.has("tiktok")
                    ? "all"
                    : activePlatforms.has("instagram")
                    ? "instagram"
                    : "tiktok"
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    setActivePlatforms(new Set(["instagram", "tiktok"]));
                  } else if (value === "instagram") {
                    setActivePlatforms(new Set(["instagram"]));
                  } else if (value === "tiktok") {
                    setActivePlatforms(new Set(["tiktok"]));
                  }
                }}
              >
                <SelectTrigger
                  className="w-[140px] h-9 text-xs border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200"
                  style={{ color: FRAMER_TEXT_COLORS.secondary }}
                >
                  <SelectValue placeholder="Platforms" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a]/95 border-white/10 backdrop-blur-xl">
                  <SelectItem value="all" className="focus:bg-white/10">
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#E1306C] via-[#833AB4] to-[#00F2EA] flex items-center justify-center shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
                      </span>
                      <span className="font-medium">All Platforms</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="instagram" className="focus:bg-white/10">
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white">
                          <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor"/>
                        </svg>
                      </span>
                      <span className="font-medium">Instagram</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="tiktok" className="focus:bg-white/10">
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-md bg-black flex items-center justify-center shadow-sm border border-white/20">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" 
                            fill="#00F2EA"
                          />
                          <path d="M17.59 4.69a4.83 4.83 0 0 1-3.77-4.25V0h-1.45v13.67a2.89 2.89 0 0 1-3.2 2.87" 
                            fill="#FF0050" fillOpacity="0.8"
                          />
                        </svg>
                      </span>
                      <span className="font-medium">TikTok</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Metric Settings Popover (for admins/clients) */}
              {showMetricSettings && onMetricSettingsChange && (
                <MetricSettingsPopover
                  enabledMetrics={enabledMetrics}
                  onSave={onMetricSettingsChange}
                  isLoading={isMetricSettingsSaving}
                />
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          />

          {/* Chart with SylcRoad watermark */}
          <ChartWithWatermark>
            <FramerChart
              data={chartData}
              multiMetricData={multiMetricData}
              height={227}
              showGrid={false}
              showYAxis={true}
              showXAxis={true}
              activeMetrics={activeMetrics}
              metricColors={METRIC_COLORS}
              // Creator analytics props
              creatorData={creatorChartData}
              activeCreators={activeCreators}
              postMarkers={postMarkers}
              onPostMarkerClick={handlePostMarkerClick}
              dateRange={propDateRange}
            />
          </ChartWithWatermark>
        </div>
      </FramerCard>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        post={selectedVideo}
        creator={selectedVideoCreator}
        open={selectedVideoId !== null}
        onOpenChange={(open) => !open && setSelectedVideoId(null)}
      />
    </motion.div>
  );
}

/**
 * Simplified overview card (like Framer's sidebar widget)
 */
interface FramerOverviewCardProps {
  chartData: DataPoint[];
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
  className?: string;
}

export function FramerOverviewCard({
  chartData,
  totalViews = 1250000,
  totalLikes = 320000,
  totalComments = 45000,
  className,
}: FramerOverviewCardProps) {
  const metrics = [
    { label: "Views", value: totalViews, compact: true },
    { label: "Likes", value: totalLikes, compact: true },
    { label: "Comments", value: totalComments, compact: true },
  ];

  return (
    <FramerCard className={className} padding="md" interactiveGlow>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ChartLineIcon size={16} className="text-blue-400" />
          <h3
            className="font-bold"
            style={{
              color: FRAMER_TEXT_COLORS.primary,
              fontFamily: FRAMER_TYPOGRAPHY.body,
              fontWeight: FRAMER_TYPOGRAPHY.weights.bold,
              fontSize: "14px",
            }}
          >
            Overview
          </h3>
        </div>
        <FramerMetrics metrics={metrics} />
        <FramerChart
          data={chartData}
          height={150}
          showGrid={false}
          showYAxis={false}
          showXAxis={false}
        />
      </div>
    </FramerCard>
  );
}

export default FramerDashboard;
