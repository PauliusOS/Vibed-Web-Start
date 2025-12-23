"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { formatCurrency } from "@/lib/constants";
import {
  DollarSign,
  TrendingUp,
  Video,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface CampaignDealCardProps {
  campaign: {
    _id: Id<"campaigns">;
    assignmentId: Id<"campaignCreators">;
    name: string;
    status: string;
    budget: number;
    organizationName?: string;
    hasDealTerms: boolean;
    flatRatePerVideo?: number;
    rpmRate?: number;
    requiredVideos: number;
    videosCompleted: number;
    pendingDrafts: number;
    totalViews: number;
    flatRateEarned: number;
    rpmEarned: number;
    totalEarned: number;
  };
  index?: number;
}

export function CampaignDealCard({ campaign, index = 0 }: CampaignDealCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const progress =
    campaign.requiredVideos > 0
      ? Math.min(100, (campaign.videosCompleted / campaign.requiredVideos) * 100)
      : 0;

  const getDealTermsSummary = () => {
    const terms: string[] = [];
    if (campaign.flatRatePerVideo) {
      terms.push(`${formatCurrency(campaign.flatRatePerVideo)}/video`);
    }
    if (campaign.rpmRate) {
      terms.push(`${formatCurrency(campaign.rpmRate)}/1K views`);
    }
    return terms.length > 0 ? terms.join(" + ") : null;
  };

  const dealTerms = getDealTermsSummary();

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          "bg-white/[0.02] border border-white/[0.06]",
          "hover:bg-white/[0.04] hover:border-white/[0.1]",
          "transition-all duration-300"
        )}
      >
        {/* Hover glow effect */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

        {/* Main Card Content */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                {campaign.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                    statusColors[campaign.status] || statusColors.draft
                  )}
                >
                  {campaign.status}
                </span>
                {campaign.hasDealTerms ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Deal Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Terms Pending
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {campaign.hasDealTerms && (
                <div className="text-right">
                  <p className="text-xs text-white/40 mb-0.5">Earned</p>
                  <p className="text-xl font-bold text-white tracking-tight">
                    {formatCurrency(campaign.totalEarned)}
                  </p>
                </div>
              )}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-lg bg-white/[0.04] text-white/40"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          {/* Deal Terms Summary */}
          {campaign.hasDealTerms && dealTerms && (
            <p className="text-sm text-white/50 mb-4">{dealTerms}</p>
          )}

          {/* Progress Bar */}
          {campaign.hasDealTerms && campaign.requiredVideos > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/50">Video Progress</span>
                <span className="text-white font-medium">
                  {campaign.videosCompleted} / {campaign.requiredVideos}
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
            </div>
          )}
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-white/[0.06]">
                {campaign.hasDealTerms ? (
                  <>
                    {/* Deal Terms Detail */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <DollarSign className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Flat Rate</p>
                          <p className="text-sm font-medium text-white">
                            {campaign.flatRatePerVideo
                              ? `${formatCurrency(campaign.flatRatePerVideo)}/video`
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/40">RPM Rate</p>
                          <p className="text-sm font-medium text-white">
                            {campaign.rpmRate
                              ? `${formatCurrency(campaign.rpmRate)}/1K views`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Breakdown */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-white/[0.04]">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Flat Rate Earned</p>
                        <p className="text-lg font-semibold text-white">
                          {formatCurrency(campaign.flatRateEarned)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">RPM Earned</p>
                        <p className="text-lg font-semibold text-white">
                          {formatCurrency(campaign.rpmEarned)}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Video className="h-4 w-4" />
                        <span>{campaign.videosCompleted} live</span>
                      </div>
                      {campaign.pendingDrafts > 0 && (
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Clock className="h-4 w-4" />
                          <span>{campaign.pendingDrafts} pending</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span>{campaign.totalViews.toLocaleString()} views</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/creator/campaigns/${campaign._id}`}
                        className="flex-1"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/80 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
                        >
                          View Campaign
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                      <Link
                        href={`/creator/deals/${campaign.assignmentId}`}
                        className="flex-1"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                        >
                          Open Workspace
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </div>
                  </>
                ) : (
                  /* No Deal Terms Yet */
                  <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                      <AlertCircle className="h-6 w-6 text-amber-400" />
                    </div>
                    <p className="text-white/60 text-sm mb-4 max-w-xs mx-auto">
                      Deal terms haven&apos;t been set for this campaign yet.
                      Contact your campaign manager for details.
                    </p>
                    <Link href={`/creator/campaigns/${campaign._id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/80 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        View Campaign Details
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CampaignDealCardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-white/[0.06] rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-white/[0.06] rounded-full" />
              <div className="h-6 w-20 bg-white/[0.06] rounded-full" />
            </div>
          </div>
          <div className="h-8 w-24 bg-white/[0.06] rounded" />
        </div>
        <div className="h-4 w-32 bg-white/[0.06] rounded" />
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full" />
      </div>
    </div>
  );
}
