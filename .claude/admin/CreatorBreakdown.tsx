"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CreatorData {
  username: string;
  platform: "instagram" | "tiktok";
  views: number;
  percentage: number;
}

interface CreatorBreakdownProps {
  creators: CreatorData[];
  className?: string;
}

/**
 * CreatorBreakdown - Shows top creators with progress bars
 * Follows Framer Analytics style (similar to CountryBreakdown)
 */
export function CreatorBreakdown({ creators, className }: CreatorBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]",
        className
      )}
    >
      <h3 className="text-sm font-medium text-white/80 mb-4">Top Creators</h3>
      <div className="space-y-3">
        {creators.length === 0 ? (
          <p className="text-sm text-white/40">No creator data available</p>
        ) : (
          creators.map((creator, index) => (
            <motion.div
              key={creator.username}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={creator.platform} />
                <span className="text-sm text-white/70">@{creator.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">
                  {formatNumber(creator.views)}
                </span>
                <div className="w-20">
                  <ProgressBar percentage={creator.percentage} color="cyan" />
                </div>
                <span className="text-xs text-white/40 w-10 text-right">
                  {creator.percentage}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

/**
 * ProgressBar - Minimal progress bar
 */
interface ProgressBarProps {
  percentage: number;
  color?: "cyan" | "blue";
}

function ProgressBar({ percentage, color = "cyan" }: ProgressBarProps) {
  const colors = {
    cyan: "bg-cyan-400",
    blue: "bg-blue-500",
  };

  return (
    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={cn("h-full rounded-full", colors[color])}
      />
    </div>
  );
}

/**
 * PlatformIcon - Simple platform icons
 */
function PlatformIcon({ platform }: { platform: "instagram" | "tiktok" }) {
  const iconClasses = "h-4 w-4 text-white/50";

  if (platform === "instagram") {
    return (
      <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }

  return (
    <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

/**
 * Helper to format numbers
 */
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}
