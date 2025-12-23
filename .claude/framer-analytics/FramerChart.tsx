"use client";

import { useMemo, useId, useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FRAMER_CHART_COLORS,
  FRAMER_GRADIENT_COLORS,
  FRAMER_CHART_STYLES,
  FRAMER_TEXT_COLORS,
} from "./constants/colors";
import {
  generateChartPaths,
  formatAxisValue,
} from "./utils/pathGenerator";
import { formatChartDate, formatCompactNumber } from "./utils/formatters";
import type { MultiMetricDataPoint } from "./utils/formatters";

interface DataPoint {
  date: string;
  primary: number;
  secondary: number;
}

interface LineConfig {
  dataKey: "primary" | "secondary";
  label: string;
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

interface MetricColors {
  views: string;
  cpm: string;
  totalComments: string;
  totalLikes: string;
  rosterCount: string;
  // Extended metric keys for dashboard compatibility
  engagement?: string;
  comments?: string;
  likes?: string;
  saves?: string;
  shares?: string;
}

type MetricKey = keyof MetricColors;

// Creator data for dotted lines (kept for backward compatibility)
export interface CreatorChartData {
  creatorId: string;
  color: string;
  name: string;
  data: number[];
}

// Post marker interface (kept for backward compatibility)
export interface PostMarker {
  creatorId: string;
  videoId: string;
  postedAt: number;
  color: string;
  thumbnailUrl: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  cpm?: number;
  avgViews?: number;
  creatorName?: string;
  creatorAvatar?: string;
  creatorUsername?: string;
}

interface FramerChartProps {
  data: DataPoint[];
  multiMetricData?: MultiMetricDataPoint[];
  lines?: [LineConfig, LineConfig];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  showLegend?: boolean;
  singleLine?: boolean;
  animate?: boolean;
  smooth?: boolean;
  activeMetrics?: Set<string>;
  metricColors?: MetricColors;
  className?: string;
  // Creator analytics props
  creatorData?: CreatorChartData[];
  activeCreators?: Set<string>;
  postMarkers?: PostMarker[];
  onPostMarkerClick?: (videoId: string) => void;
  dateRange?: { start: number; end: number };
}

// Helper to generate gradient color from line color
function getGradientColors(color: string) {
  // Extract RGB values and create gradient
  const match = color.match(/\d+/g);
  if (match && match.length >= 3) {
    const [r, g, b] = match.map(Number);
    return {
      start: `rgba(${r}, ${g}, ${b}, 0.4)`,
      end: `rgba(${r}, ${g}, ${b}, 0)`,
    };
  }
  return {
    start: "rgba(25, 125, 255, 0.4)",
    end: "rgba(25, 125, 255, 0)",
  };
}

/**
 * FramerChart - Pixel-perfect SVG chart matching Framer Analytics
 *
 * Supports multiple metric lines with individual colors
 */
export function FramerChart({
  data,
  multiMetricData,
  lines = [
    {
      dataKey: "primary",
      label: "Visitors",
      color: FRAMER_CHART_COLORS.primaryLine,
      gradientStart: FRAMER_GRADIENT_COLORS.primary.start,
      gradientEnd: FRAMER_GRADIENT_COLORS.primary.end,
    },
    {
      dataKey: "secondary",
      label: "Unique Visitors",
      color: FRAMER_CHART_COLORS.secondaryLine,
      gradientStart: FRAMER_GRADIENT_COLORS.secondary.start,
      gradientEnd: FRAMER_GRADIENT_COLORS.secondary.end,
    },
  ],
  width: propWidth,
  height = 227,
  showGrid = true,
  showYAxis = true,
  showXAxis = true,
  showLegend = false,
  singleLine = true,
  animate = true,
  smooth = false,
  activeMetrics,
  metricColors,
  className,
  // Creator analytics props
  creatorData,
  activeCreators,
  postMarkers,
  onPostMarkerClick,
  dateRange,
}: FramerChartProps) {
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(propWidth || 1200);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    dataIndex: number;
    values: { label: string; value: number | string; color: string }[];
    date: string;
  } | null>(null);

  // Responsive width handling
  useEffect(() => {
    if (propWidth) {
      setContainerWidth(propWidth);
      return;
    }

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [propWidth]);

  // Padding for axes
  const padding = useMemo(
    () => ({
      top: 10,
      right: 10,
      bottom: showXAxis ? 30 : 10,
      left: showYAxis ? 50 : 10,
    }),
    [showXAxis, showYAxis]
  );

  // Determine which metrics to render based on activeMetrics
  const metricsToRender = useMemo(() => {
    if (!activeMetrics || !metricColors || !multiMetricData) {
      // Fallback to old behavior
      return null;
    }

    const metrics: Array<{
      key: MetricKey;
      color: string;
      data: number[];
      gradientId: string;
    }> = [];

    // Map dashboard metric keys to data keys
    const metricKeyMapping: Record<string, keyof MultiMetricDataPoint | null> = {
      views: "views",
      cpm: "cpm",
      totalComments: "totalComments",
      totalLikes: "totalLikes",
      rosterCount: "rosterCount",
      // Dashboard uses these keys, map to data keys
      engagement: null, // Calculated metric, not in raw data
      comments: "totalComments",
      likes: "totalLikes",
      saves: null, // Not in MultiMetricDataPoint
      shares: null, // Not in MultiMetricDataPoint
    };

    activeMetrics.forEach((key) => {
      const dataKey = metricKeyMapping[key];
      const color = metricColors[key as MetricKey];
      
      if (color) {
        let data: number[];
        
        if (dataKey) {
          // Direct mapping to data field
          data = multiMetricData.map((d) => d[dataKey]);
        } else if (key === "engagement") {
          // Calculate engagement rate: (likes + comments) / views * 100
          data = multiMetricData.map((d) => 
            d.views > 0 ? ((d.totalLikes + d.totalComments) / d.views) * 100 * 1000 : 0
          );
        } else {
          // Fallback: use views data scaled
          data = multiMetricData.map((d) => d.views * 0.1);
        }
        
        metrics.push({
          key: key as MetricKey,
          color,
          data,
          gradientId: `gradient-${key}-${uniqueId}`,
        });
      }
    });

    return metrics;
  }, [activeMetrics, metricColors, multiMetricData, uniqueId]);

  // Generate paths for each active metric
  const metricPaths = useMemo(() => {
    if (!metricsToRender) return null;

    return metricsToRender.map((metric) => ({
      ...metric,
      paths: generateChartPaths(
        metric.data,
        containerWidth,
        height,
        padding,
        smooth
      ),
      gradient: getGradientColors(metric.color),
    }));
  }, [metricsToRender, containerWidth, height, padding, smooth]);

  // Generate paths for active creators (dotted lines)
  const creatorPaths = useMemo(() => {
    if (!creatorData || !activeCreators) return null;

    return creatorData
      .filter((creator) => activeCreators.has(creator.creatorId))
      .map((creator) => ({
        creatorId: creator.creatorId,
        color: creator.color,
        name: creator.name,
        paths: generateChartPaths(
          creator.data,
          containerWidth,
          height,
          padding,
          smooth
        ),
      }));
  }, [creatorData, activeCreators, containerWidth, height, padding, smooth]);

  // For Y-axis, use all active metric data
  const yTicks = useMemo(() => {
    if (metricPaths && metricPaths.length > 0) {
      const allValues = metricPaths.flatMap((m) => m.data);
      const maxValue = Math.max(...allValues);
      return [maxValue];
    }
    // Fallback
    const allValues = data.map((d) => d.primary);
    const maxValue = Math.max(...allValues);
    return [maxValue];
  }, [metricPaths, data]);

  // X-axis labels (show every few days for better context)
  const xLabels = useMemo(() => {
    const sourceData = multiMetricData || data;
    if (sourceData.length < 2) return [];
    
    // Calculate interval based on data length
    const totalPoints = sourceData.length;
    const maxLabels = 6; // Show max 6 labels
    const interval = Math.max(1, Math.floor(totalPoints / (maxLabels - 1)));
    
    const labels: Array<{ label: string; position: number }> = [];
    
    for (let i = 0; i < totalPoints; i += interval) {
      labels.push({
        label: formatChartDate(sourceData[i].date),
        position: i / (totalPoints - 1),
      });
    }
    
    // Always include last date
    if (labels[labels.length - 1].position !== 1) {
      labels.push({
        label: formatChartDate(sourceData[totalPoints - 1].date),
        position: 1,
      });
    }
    
    return labels;
  }, [multiMetricData, data]);

  // Chart dimensions
  const chartWidth = containerWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate Y position for tick
  const getYPosition = (value: number): number => {
    const maxValue = Math.max(...yTicks);
    if (maxValue === 0) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - (value / maxValue) * chartHeight;
  };

  // Handle mouse move for hover tooltip
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if mouse is within chart area
      if (
        mouseX < padding.left ||
        mouseX > containerWidth - padding.right ||
        mouseY < padding.top ||
        mouseY > height - padding.bottom
      ) {
        setHoverInfo(null);
        return;
      }

      // Calculate which data point we're hovering over
      const sourceData = multiMetricData || data;
      const chartAreaWidth = containerWidth - padding.left - padding.right;
      const relativeX = mouseX - padding.left;
      const dataIndex = Math.round(
        (relativeX / chartAreaWidth) * (sourceData.length - 1)
      );

      if (dataIndex < 0 || dataIndex >= sourceData.length) {
        setHoverInfo(null);
        return;
      }

      const dataPoint = sourceData[dataIndex];
      const xPosition =
        padding.left + (dataIndex / (sourceData.length - 1)) * chartAreaWidth;

      // Build values array based on active metrics or fallback
      const values: { label: string; value: number | string; color: string }[] = [];

      if (metricPaths && multiMetricData) {
        // Use active metrics
        const metricLabels: Record<string, string> = {
          views: "Views",
          cpm: "CPM",
          totalComments: "Comments",
          totalLikes: "Likes",
          rosterCount: "Roster",
          engagement: "Engagement",
          comments: "Comments",
          likes: "Likes",
          saves: "Saves",
          shares: "Shares",
        };

        metricPaths.forEach((metric) => {
          const value = metric.data[dataIndex];
          let formattedValue: string | number = value;

          if (metric.key === "cpm") {
            formattedValue = `$${value.toFixed(2)}`;
          } else if (metric.key === "engagement") {
            formattedValue = `${(value / 1000).toFixed(1)}%`;
          } else if (typeof value === "number") {
            formattedValue = formatCompactNumber(value);
          }

          values.push({
            label: metricLabels[metric.key] || metric.key,
            value: formattedValue,
            color: metric.color,
          });
        });
      } else {
        // Fallback for simple data
        values.push({
          label: lines[0].label,
          value: formatCompactNumber(dataPoint.primary),
          color: lines[0].color || FRAMER_CHART_COLORS.primaryLine,
        });

        if (!singleLine && dataPoint.secondary !== undefined) {
          values.push({
            label: lines[1].label,
            value: formatCompactNumber(dataPoint.secondary),
            color: lines[1].color || FRAMER_CHART_COLORS.secondaryLine,
          });
        }
      }

      setHoverInfo({
        x: xPosition,
        y: mouseY,
        dataIndex,
        values,
        date: formatChartDate(dataPoint.date),
      });
    },
    [
      multiMetricData,
      data,
      metricPaths,
      containerWidth,
      height,
      padding,
      lines,
      singleLine,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", className)}
    >
      {/* Legend */}
      {showLegend && (
        <div className="flex items-center gap-6 mb-4 pl-2">
          {(singleLine ? [lines[0]] : lines).map((line) => (
            <div key={line.dataKey} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: line.color || FRAMER_CHART_COLORS.primaryLine,
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: FRAMER_TEXT_COLORS.secondary }}
              >
                {line.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* SVG Chart */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${containerWidth} ${height}`}
        width="100%"
        height={height}
        className="overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient Definitions for all active metrics */}
        <defs>
          {metricPaths?.map((metric) => (
            <linearGradient
              key={metric.gradientId}
              id={metric.gradientId}
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="0.95"
            >
              <stop offset="0" stopColor={metric.gradient.start} />
              <stop offset="1" stopColor={metric.gradient.end} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {showGrid &&
          yTicks.map((tick, i) => (
            <line
              key={`grid-${i}`}
              x1={padding.left}
              y1={getYPosition(tick)}
              x2={containerWidth - padding.right}
              y2={getYPosition(tick)}
              stroke={FRAMER_CHART_STYLES.gridColor}
              strokeWidth={1}
              strokeDasharray="2 6"
            />
          ))}

        {/* Y-axis labels */}
        {showYAxis &&
          yTicks.map((tick, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 8}
              y={getYPosition(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fill={FRAMER_CHART_STYLES.axisColor}
              fontSize={11}
              fontWeight={400}
              fontFamily="Inter, sans-serif"
            >
              {formatAxisValue(tick)}
            </text>
          ))}

        {/* X-axis labels */}
        {showXAxis &&
          xLabels.map((item, i) => {
            const x = padding.left + item.position * chartWidth;
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={height - 8}
                textAnchor={item.position === 0 ? "start" : "end"}
                fill={FRAMER_CHART_STYLES.axisColor}
                fontSize={11}
                fontWeight={400}
                fontFamily="Inter, sans-serif"
              >
                {item.label}
              </text>
            );
          })}

        {/* Render all active metric lines */}
        {metricPaths?.map((metric, index) => (
          <g key={metric.key}>
            {/* Area fill */}
            <motion.path
              d={metric.paths.areaPath}
              fill={`url(#${metric.gradientId})`}
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            />

            {/* Line stroke */}
            <motion.path
              d={metric.paths.linePath}
              fill="transparent"
              stroke={metric.color}
              strokeWidth={FRAMER_CHART_STYLES.strokeWidth}
              strokeLinecap={FRAMER_CHART_STYLES.strokeLinecap}
              strokeLinejoin={FRAMER_CHART_STYLES.strokeLinejoin}
              initial={animate ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * index }}
            />
          </g>
        ))}

{/* Creator lines removed - only main blue chart shown */}

        {/* Fallback: if no metricPaths, render primary line */}
        {!metricPaths && (
          <>
            <defs>
              <linearGradient
                id={`fallback-gradient-${uniqueId}`}
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="0.95"
              >
                <stop offset="0" stopColor={FRAMER_GRADIENT_COLORS.primary.start} />
                <stop offset="1" stopColor={FRAMER_GRADIENT_COLORS.primary.end} />
              </linearGradient>
            </defs>
            <motion.path
              d={generateChartPaths(data.map(d => d.primary), containerWidth, height, padding, smooth).areaPath}
              fill={`url(#fallback-gradient-${uniqueId})`}
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.path
              d={generateChartPaths(data.map(d => d.primary), containerWidth, height, padding, smooth).linePath}
              fill="transparent"
              stroke={FRAMER_CHART_COLORS.primaryLine}
              strokeWidth={FRAMER_CHART_STYLES.strokeWidth}
              strokeLinecap={FRAMER_CHART_STYLES.strokeLinecap}
              strokeLinejoin={FRAMER_CHART_STYLES.strokeLinejoin}
              initial={animate ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </>
        )}

      </svg>
    </motion.div>
  );
}

export default FramerChart;
