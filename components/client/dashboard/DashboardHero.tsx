"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DollarSign, Video, MessageSquare, Receipt } from "lucide-react";
import { BudgetProgressBar } from "../BudgetProgressBar";
import { QuickActionButton } from "./QuickActionButton";

interface DashboardHeroProps {
  campaignName: string;
  campaignStatus: "draft" | "active" | "paused" | "completed" | "archived";
  totalBudget: number;
  budgetUtilization?: {
    totalBudget: number;
    paid: number;
    committed: number;
    remaining: number;
    paidPercent: number;
    committedPercent: number;
    remainingPercent: number;
  };
  onViewVideos: () => void;
  onSubmitFeedback: () => void;
  onViewInvoices: () => void;
  notifications?: {
    newVideos: number;
    unreadFeedback: number;
    pendingInvoices: number;
  };
}

const statusConfig = {
  draft: { label: "Draft", color: "text-white/60", bg: "bg-white/[0.06]", border: "border-white/[0.1]" },
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  paused: { label: "Paused", color: "text-blue-300", bg: "bg-blue-400/10", border: "border-blue-400/30" },
  completed: { label: "Completed", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  archived: { label: "Archived", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30" },
};

export function DashboardHero({
  campaignName,
  campaignStatus,
  totalBudget,
  budgetUtilization,
  onViewVideos,
  onSubmitFeedback,
  onViewInvoices,
  notifications,
}: DashboardHeroProps) {
  const config = statusConfig[campaignStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative space-y-6"
    >
      {/* Header glow */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-500/5 via-blue-400/5 to-blue-500/5 blur-xl" />

      <div className="relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        {/* Campaign Name and Status */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {campaignName}
            </h1>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border",
              config.bg, config.border, config.color
            )}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-white/50">
            Your campaign command center
          </p>
        </div>

        {/* Budget Display */}
        <div className="mb-6">
          <div className="flex flex-col gap-2 p-4 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white/70">Total Budget:</span>
              </div>
              <span className="text-sm font-semibold text-white">
                ${totalBudget.toLocaleString()}
              </span>
            </div>

            {budgetUtilization ? (
              <BudgetProgressBar {...budgetUtilization} />
            ) : (
              <div className="h-2.5 rounded-full bg-white/[0.06] animate-pulse" />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickActionButton
            icon={Video}
            label="View Videos"
            description="See all campaign content"
            onClick={onViewVideos}
            badgeCount={notifications?.newVideos}
            variant="primary"
            delay={0.1}
          />
          <QuickActionButton
            icon={MessageSquare}
            label="Submit Feedback"
            description="Message your manager"
            onClick={onSubmitFeedback}
            badgeCount={notifications?.unreadFeedback}
            variant="accent"
            delay={0.15}
          />
          <QuickActionButton
            icon={Receipt}
            label="View Invoices"
            description="Billing and payments"
            onClick={onViewInvoices}
            badgeCount={notifications?.pendingInvoices}
            variant="secondary"
            delay={0.2}
          />
        </div>
      </div>
    </motion.div>
  );
}
