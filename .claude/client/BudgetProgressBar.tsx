"use client";

import { motion } from "motion/react";

interface BudgetProgressBarProps {
  totalBudget: number;
  paid: number;
  committed: number;
  remaining: number;
  paidPercent: number;
  committedPercent: number;
  remainingPercent?: number;
}

export function BudgetProgressBar({
  paid,
  committed,
  paidPercent,
  committedPercent,
}: BudgetProgressBarProps) {
  return (
    <div className="space-y-2">
      {/* Progress bar container */}
      <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden relative">
        {/* Paid segment (dark blue) */}
        <motion.div
          className="absolute left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(paidPercent, 100)}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Committed segment (light blue) */}
        <motion.div
          className="absolute h-full bg-gradient-to-r from-blue-300 to-blue-200"
          initial={{ width: 0, left: 0 }}
          animate={{
            width: `${Math.min(committedPercent, Math.max(0, 100 - paidPercent))}%`,
            left: `${Math.min(paidPercent, 100)}%`,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
          <span className="text-white/50">Paid: ${paid.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-300" />
          <span className="text-white/50">
            Committed: ${committed.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
