"use client";

import { motion } from "motion/react";
import { Trophy, Eye, DollarSign, Video, Medal, Crown, Star } from "lucide-react";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RankingData {
  totalCreators: number;
  rankings: {
    byViews: { rank: number; value: number };
    byEarnings: { rank: number; value: number };
    byVideos: { rank: number; value: number };
  };
  topCreators: {
    rank: number;
    name: string;
    views: number;
    earnings: number;
    videos: number;
    isMe: boolean;
  }[];
}

interface CreatorRankingCardProps {
  ranking: RankingData;
}

function getRankBadgeColor(rank: number, total: number) {
  const percentage = rank / total;
  if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/30";
  if (rank === 3) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (percentage <= 0.25) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (percentage <= 0.5) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return "bg-white/10 text-white/60 border-white/20";
}

function getStarRating(rank: number, total: number): number {
  const percentage = rank / total;
  if (rank === 1) return 5;
  if (rank === 2) return 5;
  if (rank === 3) return 5;
  if (percentage <= 0.25) return 4;
  if (percentage <= 0.5) return 3;
  if (percentage <= 0.75) return 2;
  return 1;
}

export function CreatorRankingCardSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 via-white/[0.02] to-orange-500/10 border border-yellow-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
      <div className="relative p-5 space-y-4 h-full flex flex-col animate-pulse">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-5 w-5 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="h-6 w-6 bg-white/10 rounded" />
            ))}
          </div>
          <div className="h-3 w-32 bg-white/10 rounded mx-auto" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-white/10 rounded" />
                  <div className="h-3 w-12 bg-white/10 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-8 bg-white/10 rounded" />
                  <div className="h-3 w-12 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="h-12 w-full bg-white/[0.04] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CreatorRankingCard({ ranking }: CreatorRankingCardProps) {
  const { totalCreators, rankings } = ranking;

  // Calculate overall star rating based on average rank
  const avgRankPercentage = (
    rankings.byViews.rank / totalCreators +
    rankings.byEarnings.rank / totalCreators +
    rankings.byVideos.rank / totalCreators
  ) / 3;

  const overallStars = getStarRating(
    Math.round(avgRankPercentage * totalCreators),
    totalCreators
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 via-white/[0.02] to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/30 transition-all duration-400"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />

      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl opacity-40" />

      {/* Content */}
      <div className="relative p-5 space-y-4 h-full flex flex-col">
        {/* Header with Stars */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <h3 className="text-base font-bold text-white">Your Ranking</h3>
          </div>

          {/* Star Rating Display - PROMINENT */}
          <motion.div
            className="flex items-center justify-center gap-1 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.5 }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1 * star, duration: 0.5 }}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    star <= overallStars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-white/5 text-white/20"
                  )}
                />
              </motion.div>
            ))}
          </motion.div>

          <p className="text-xs text-white/50">
            Among {totalCreators} creators
          </p>
        </div>

        {/* Ranking Grid */}
        <div className="space-y-3">
          {/* Views Rank */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-white/60 font-medium">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold border",
                    getRankBadgeColor(rankings.byViews.rank, totalCreators)
                  )}
                >
                  #{rankings.byViews.rank}
                </span>
                <span className="text-xs text-white/40">of {totalCreators}</span>
              </div>
            </div>
          </motion.div>

          {/* Earnings Rank */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-white/60 font-medium">Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold border",
                    getRankBadgeColor(rankings.byEarnings.rank, totalCreators)
                  )}
                >
                  #{rankings.byEarnings.rank}
                </span>
                <span className="text-xs text-white/40">of {totalCreators}</span>
              </div>
            </div>
          </motion.div>

          {/* Videos Rank */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-white/60 font-medium">Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold border",
                    getRankBadgeColor(rankings.byVideos.rank, totalCreators)
                  )}
                >
                  #{rankings.byVideos.rank}
                </span>
                <span className="text-xs text-white/40">of {totalCreators}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Motivation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-auto"
        >
          {rankings.byViews.rank === 1 ? (
            <div className="text-center p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <p className="text-xs text-yellow-300 font-medium">
                You&apos;re #1! Keep it up!
              </p>
            </div>
          ) : rankings.byViews.rank <= 3 ? (
            <div className="text-center p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
              <p className="text-xs text-orange-300 font-medium">
                Top 3! Almost there!
              </p>
            </div>
          ) : (
            <div className="text-center p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <p className="text-xs text-cyan-300 font-medium">
                Keep pushing forward!
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
    </motion.div>
  );
}
