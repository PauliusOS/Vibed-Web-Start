"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FramerCard } from "../FramerCard";
import { FRAMER_TEXT_COLORS } from "../constants/colors";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

// Types
export interface CreatorRanking {
  creatorId: string;
  rank: number;
  overallScore: number;
  timelinessScore: number;
  reliabilityScore: number;
  qualityScore: number;
  engagementScore: number;
  totalAssignments: number;
  completedOnTime: number;
  completedLate: number;
  missed: number;
  campaigns?: number;
  previousRank?: number;
  creatorInfo: {
    username: string;
    displayName?: string;
    profilePictureUrl?: string;
    platform?: "instagram" | "tiktok";
  } | null;
}

interface CreatorRankingsProps {
  rankings: CreatorRanking[];
  title?: string;
  subtitle?: string;
  showDetailed?: boolean;
  className?: string;
}

// Performance tier based on score
function getPerformanceTier(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 90) return { label: "Tier 1", color: "rgb(34, 197, 94)", bgColor: "rgba(34, 197, 94, 0.1)" };
  if (score >= 75) return { label: "Tier 2", color: "rgb(59, 130, 246)", bgColor: "rgba(59, 130, 246, 0.1)" };
  if (score >= 60) return { label: "Tier 3", color: "rgb(245, 158, 11)", bgColor: "rgba(245, 158, 11, 0.1)" };
  if (score >= 40) return { label: "Tier 4", color: "rgb(249, 115, 22)", bgColor: "rgba(249, 115, 22, 0.1)" };
  return { label: "Tier 5", color: "rgb(239, 68, 68)", bgColor: "rgba(239, 68, 68, 0.1)" };
}

// Calculate completion rate
function getCompletionRate(onTime: number, late: number, missed: number): number {
  const total = onTime + late + missed;
  if (total === 0) return 0;
  return Math.round(((onTime + late) / total) * 100);
}

// Calculate on-time rate
function getOnTimeRate(onTime: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((onTime / total) * 100);
}

// Trend indicator
function TrendIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: FRAMER_TEXT_COLORS.muted }}>
        —
      </span>
    );
  }
  
  const change = current - previous;
  
  if (change === 0) {
    return (
      <span 
        className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
        style={{ 
          color: FRAMER_TEXT_COLORS.muted,
          backgroundColor: "rgba(255, 255, 255, 0.03)"
        }}
      >
        <Minus className="w-2.5 h-2.5" />
        0
      </span>
    );
  }
  
  if (change > 0) {
    return (
      <span 
        className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
        style={{ 
          color: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)"
        }}
      >
        <ArrowDownRight className="w-2.5 h-2.5" />
        {change}
      </span>
    );
  }
  
  return (
    <span 
      className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
      style={{ 
        color: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)"
      }}
    >
      <ArrowUpRight className="w-2.5 h-2.5" />
      {Math.abs(change)}
    </span>
  );
}

export function CreatorRankings({
  rankings,
  title = "Creator Performance Metrics",
  subtitle = "Aggregate performance analysis across all deliverables",
  showDetailed = true,
  className,
}: CreatorRankingsProps) {
  // Calculate aggregate stats
  const aggregateStats = useMemo(() => {
    if (rankings.length === 0) return null;
    
    const avgScore = Math.round(rankings.reduce((sum, r) => sum + r.overallScore, 0) / rankings.length);
    const totalAssignments = rankings.reduce((sum, r) => sum + r.totalAssignments, 0);
    const totalOnTime = rankings.reduce((sum, r) => sum + r.completedOnTime, 0);
    const totalLate = rankings.reduce((sum, r) => sum + r.completedLate, 0);
    const totalMissed = rankings.reduce((sum, r) => sum + r.missed, 0);
    const avgOnTimeRate = getOnTimeRate(totalOnTime, totalOnTime + totalLate + totalMissed);
    const completionRate = getCompletionRate(totalOnTime, totalLate, totalMissed);
    
    return {
      avgScore,
      totalAssignments,
      avgOnTimeRate,
      completionRate,
      creatorsCount: rankings.length,
    };
  }, [rankings]);

  return (
    <FramerCard padding="lg" className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div 
                className="p-1.5 rounded"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <BarChart3 className="w-4 h-4" style={{ color: "rgb(59, 130, 246)" }} />
              </div>
              <h3
                className="text-[15px] font-medium tracking-tight"
                style={{ color: FRAMER_TEXT_COLORS.primary }}
              >
                {title}
              </h3>
            </div>
            <p className="text-[12px] ml-9" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              {subtitle}
            </p>
          </div>
          
          {aggregateStats && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                  Avg Score
                </p>
                <p className="text-lg font-semibold tabular-nums" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                  {aggregateStats.avgScore}
                  <span className="text-[11px] font-normal ml-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>/100</span>
                </p>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }} />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                  On-Time Rate
                </p>
                <p className="text-lg font-semibold tabular-nums" style={{ color: "rgb(34, 197, 94)" }}>
                  {aggregateStats.avgOnTimeRate}%
                </p>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }} />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                  Completion
                </p>
                <p className="text-lg font-semibold tabular-nums" style={{ color: "rgb(59, 130, 246)" }}>
                  {aggregateStats.completionRate}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Table Header */}
        <div 
          className="grid grid-cols-12 gap-4 px-4 py-2.5 rounded text-[10px] uppercase tracking-wider"
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            color: FRAMER_TEXT_COLORS.muted 
          }}
        >
          <div className="col-span-1">#</div>
          <div className="col-span-3">Creator</div>
          <div className="col-span-1 text-center">Tier</div>
          <div className="col-span-1 text-right">Score</div>
          <div className="col-span-1 text-right">Δ Rank</div>
          <div className="col-span-1 text-right">On-Time</div>
          <div className="col-span-1 text-right">Comp %</div>
          <div className="col-span-1 text-right">Delivered</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rankings List */}
        <div className="space-y-1">
          {rankings.map((ranking, index) => (
            <CreatorRow
              key={ranking.creatorId}
              ranking={ranking}
              showDetailed={showDetailed}
              index={index}
            />
          ))}

          {rankings.length === 0 && (
            <div className="text-center py-12">
              <Activity
                className="h-8 w-8 mx-auto mb-3"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              />
              <p className="text-[13px]" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                No performance data available
              </p>
              <p
                className="text-[12px] mt-1"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                Metrics will populate as creators complete assignments
              </p>
            </div>
          )}
        </div>

        {/* Footer Legend */}
        {rankings.length > 0 && (
          <div 
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgb(34, 197, 94)" }} />
                <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>Tier 1 (90+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgb(59, 130, 246)" }} />
                <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>Tier 2 (75-89)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgb(245, 158, 11)" }} />
                <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>Tier 3 (60-74)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgb(249, 115, 22)" }} />
                <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>Tier 4 (40-59)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "rgb(239, 68, 68)" }} />
                <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>Tier 5 (&lt;40)</span>
              </div>
            </div>
            <p className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              Updated in real-time • {rankings.length} creators tracked
            </p>
          </div>
        )}
      </div>
    </FramerCard>
  );
}

// Individual creator row
interface CreatorRowProps {
  ranking: CreatorRanking;
  showDetailed: boolean;
  index: number;
}

function CreatorRow({ ranking, showDetailed, index }: CreatorRowProps) {
  const tier = getPerformanceTier(ranking.overallScore);
  const completionRate = getCompletionRate(ranking.completedOnTime, ranking.completedLate, ranking.missed);
  const onTimeRate = getOnTimeRate(ranking.completedOnTime, ranking.totalAssignments);
  const delivered = ranking.completedOnTime + ranking.completedLate;
  
  // Determine status
  const getStatus = () => {
    if (ranking.missed > 0 && ranking.missed >= ranking.completedOnTime) {
      return { label: "At Risk", color: "rgb(239, 68, 68)", icon: AlertCircle };
    }
    if (ranking.completedLate > ranking.completedOnTime) {
      return { label: "Needs Attention", color: "rgb(245, 158, 11)", icon: Clock };
    }
    if (onTimeRate >= 80) {
      return { label: "On Track", color: "rgb(34, 197, 94)", icon: CheckCircle2 };
    }
    return { label: "Monitoring", color: "rgb(59, 130, 246)", icon: Target };
  };
  
  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div 
        className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg items-center transition-colors hover:bg-white/[0.02]"
        style={{ 
          borderLeft: `2px solid ${tier.color}`,
        }}
      >
        {/* Rank */}
        <div className="col-span-1">
          <span 
            className="text-[13px] font-semibold tabular-nums"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            {String(ranking.rank).padStart(2, '0')}
          </span>
        </div>

        {/* Creator Info */}
        <div className="col-span-3 flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8 ring-1 ring-white/10">
            <AvatarImage src={ranking.creatorInfo?.profilePictureUrl} />
            <AvatarFallback 
              className="text-[11px] font-medium"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {ranking.creatorInfo?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p
              className="text-[13px] font-medium truncate leading-tight"
              style={{ color: FRAMER_TEXT_COLORS.primary }}
            >
              {ranking.creatorInfo?.displayName ||
                ranking.creatorInfo?.username ||
                "Unknown"}
            </p>
            {ranking.creatorInfo?.username && (
              <p
                className="text-[11px] truncate leading-tight"
                style={{ color: FRAMER_TEXT_COLORS.muted }}
              >
                @{ranking.creatorInfo.username}
              </p>
            )}
          </div>
        </div>

        {/* Tier */}
        <div className="col-span-1 flex justify-center">
          <span 
            className="text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ 
              color: tier.color,
              backgroundColor: tier.bgColor 
            }}
          >
            {tier.label}
          </span>
        </div>

        {/* Score */}
        <div className="col-span-1 text-right">
          <span 
            className="text-[14px] font-semibold tabular-nums"
            style={{ color: tier.color }}
          >
            {ranking.overallScore}
          </span>
        </div>

        {/* Rank Change */}
        <div className="col-span-1 flex justify-end">
          <TrendIndicator current={ranking.rank} previous={ranking.previousRank} />
        </div>

        {/* On-Time Rate */}
        <div className="col-span-1 text-right">
          <span 
            className="text-[13px] tabular-nums"
            style={{ 
              color: onTimeRate >= 80 
                ? "rgb(34, 197, 94)" 
                : onTimeRate >= 60 
                ? "rgb(245, 158, 11)"
                : "rgb(239, 68, 68)"
            }}
          >
            {onTimeRate}%
          </span>
        </div>

        {/* Completion Rate */}
        <div className="col-span-1 text-right">
          <span 
            className="text-[13px] tabular-nums"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          >
            {completionRate}%
          </span>
        </div>

        {/* Delivered */}
        <div className="col-span-1 text-right">
          <span 
            className="text-[13px] tabular-nums"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          >
            {delivered}
            <span className="text-[11px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              /{ranking.totalAssignments}
            </span>
          </span>
        </div>

        {/* Status */}
        <div className="col-span-2 flex items-center justify-end gap-1.5">
          <StatusIcon className="w-3 h-3" style={{ color: status.color }} />
          <span 
            className="text-[11px] font-medium"
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetailed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="ml-4 mr-4 mb-2 overflow-hidden"
        >
          <div 
            className="grid grid-cols-4 gap-6 px-4 py-3 rounded-b-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.015)" }}
          >
            <MetricBlock
              label="Timeliness"
              value={ranking.timelinessScore}
              suffix="/100"
              description="Submission punctuality"
            />
            <MetricBlock
              label="Reliability"
              value={ranking.reliabilityScore}
              suffix="/100"
              description="Assignment completion"
            />
            <MetricBlock
              label="Quality"
              value={ranking.qualityScore}
              suffix="/100"
              description="First-approval rate"
            />
            <MetricBlock
              label="Engagement"
              value={ranking.engagementScore}
              suffix="/100"
              description="Performance vs benchmark"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Metric block for detailed view
interface MetricBlockProps {
  label: string;
  value: number;
  suffix?: string;
  description?: string;
}

function MetricBlock({ label, value, suffix = "", description }: MetricBlockProps) {
  const tier = getPerformanceTier(value);
  
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: FRAMER_TEXT_COLORS.muted }}>
          {label}
        </span>
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: tier.color }}>
          {value}
          <span className="text-[10px] font-normal" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            {suffix}
          </span>
        </span>
      </div>
      <div 
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: tier.color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
      {description && (
        <p className="text-[9px] mt-1" style={{ color: FRAMER_TEXT_COLORS.muted }}>
          {description}
        </p>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function CreatorRankingsCompact({
  rankings,
  title = "Performance Overview",
  limit = 5,
  className,
}: {
  rankings: CreatorRanking[];
  title?: string;
  limit?: number;
  className?: string;
}) {
  const topRankings = rankings.slice(0, limit);

  return (
    <FramerCard padding="md" className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" style={{ color: "rgb(59, 130, 246)" }} />
            <h4
              className="text-[13px] font-medium"
              style={{ color: FRAMER_TEXT_COLORS.primary }}
            >
              {title}
            </h4>
          </div>
          <span className="text-[10px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            {rankings.length} tracked
          </span>
        </div>

        <div className="space-y-1">
          {topRankings.map((ranking) => {
            const tier = getPerformanceTier(ranking.overallScore);
            
            return (
              <div
                key={ranking.creatorId}
                className="flex items-center gap-3 p-2 rounded transition-colors hover:bg-white/[0.02]"
              >
                <span 
                  className="w-5 text-[11px] font-medium tabular-nums"
                  style={{ color: FRAMER_TEXT_COLORS.muted }}
                >
                  {String(ranking.rank).padStart(2, '0')}
                </span>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={ranking.creatorInfo?.profilePictureUrl} />
                  <AvatarFallback 
                    className="text-[9px]"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    {ranking.creatorInfo?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-medium truncate"
                    style={{ color: FRAMER_TEXT_COLORS.primary }}
                  >
                    {ranking.creatorInfo?.displayName ||
                      ranking.creatorInfo?.username ||
                      "Unknown"}
                  </p>
                </div>
                <span 
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ 
                    color: tier.color,
                    backgroundColor: tier.bgColor 
                  }}
                >
                  {tier.label}
                </span>
                <span
                  className="text-[12px] font-semibold tabular-nums w-8 text-right"
                  style={{ color: tier.color }}
                >
                  {ranking.overallScore}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </FramerCard>
  );
}

export default CreatorRankings;
