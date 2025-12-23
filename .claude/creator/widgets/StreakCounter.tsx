"use client";

import { motion } from "motion/react";
import { Flame, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastPostDate?: Date;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  lastPostDate
}: StreakCounterProps) {
  const isActive = currentStreak > 0;
  const isPersonalBest = currentStreak === longestStreak && currentStreak > 0;

  // Calculate days since last post
  const daysSinceLastPost = lastPostDate
    ? Math.floor((Date.now() - new Date(lastPostDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Determine streak status
  const getStreakStatus = () => {
    if (!isActive) return { text: "Start your streak!", color: "white/40" };
    if (currentStreak >= 30) return { text: "On fire! 🔥", color: "orange-400" };
    if (currentStreak >= 14) return { text: "Crushing it!", color: "yellow-400" };
    if (currentStreak >= 7) return { text: "Great momentum!", color: "emerald-400" };
    return { text: "Keep going!", color: "cyan-400" };
  };

  const status = getStreakStatus();

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />

      {/* Animated flame particles (when active) */}
      {isActive && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-400/30"
              style={{
                left: `${30 + i * 20}%`,
                bottom: "20%",
              }}
              animate={{
                y: [0, -40, -80],
                opacity: [0.3, 0.6, 0],
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg border",
              isActive
                ? "bg-orange-500/10 border-orange-500/20"
                : "bg-white/[0.02] border-white/[0.06]"
            )}>
              <Flame className={cn(
                "h-4 w-4",
                isActive ? "text-orange-400" : "text-white/30"
              )} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/90">Posting Streak</h3>
              <p className="text-xs text-white/40 mt-0.5">Daily consistency</p>
            </div>
          </div>

          {/* Personal best badge */}
          {isPersonalBest && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20"
            >
              <Award className="h-3 w-3 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">PB</span>
            </motion.div>
          )}
        </div>

        {/* Current Streak Display */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
          >
            {/* Glow effect */}
            {isActive && (
              <div className="absolute inset-0 blur-2xl bg-orange-500/20 rounded-full" />
            )}

            {/* Number */}
            <div className="relative">
              <span className={cn(
                "text-6xl font-bold font-mono",
                isActive ? "text-orange-400" : "text-white/20"
              )}>
                {currentStreak}
              </span>
              <div className="text-center mt-1">
                <span className="text-sm text-white/40">
                  day{currentStreak !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Status message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn("text-sm font-medium", `text-${status.color}`)}
          >
            {status.text}
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Longest streak */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Award className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-white/50 font-medium">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-white/90 font-mono">
              {longestStreak}
            </p>
            <p className="text-xs text-white/30 mt-0.5">days</p>
          </div>

          {/* Last post */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-white/50 font-medium">Last Post</span>
            </div>
            <p className="text-2xl font-bold text-white/90 font-mono">
              {daysSinceLastPost !== null ? daysSinceLastPost : "-"}
            </p>
            <p className="text-xs text-white/30 mt-0.5">days ago</p>
          </div>
        </div>

        {/* Progress to next milestone */}
        {isActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Next milestone</span>
              <span className="text-white/40">
                {currentStreak < 7 ? "7 days" :
                 currentStreak < 14 ? "14 days" :
                 currentStreak < 30 ? "30 days" :
                 currentStreak < 90 ? "90 days" : "100 days"}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    currentStreak < 7 ? (currentStreak / 7) * 100 :
                    currentStreak < 14 ? ((currentStreak - 7) / 7) * 100 :
                    currentStreak < 30 ? ((currentStreak - 14) / 16) * 100 :
                    currentStreak < 90 ? ((currentStreak - 30) / 60) * 100 :
                    ((currentStreak - 90) / 10) * 100
                  }%`
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        )}

        {/* Encouragement message */}
        <div className={cn(
          "p-3 rounded-lg text-center",
          "bg-gradient-to-r from-orange-500/5 to-yellow-500/5",
          "border border-orange-500/10"
        )}>
          <p className="text-xs text-white/50">
            {!isActive && "Post daily to build your streak!"}
            {isActive && daysSinceLastPost === 0 && "Great! You posted today. Keep it up tomorrow!"}
            {isActive && daysSinceLastPost === 1 && "⚠️ Post today to maintain your streak!"}
            {isActive && daysSinceLastPost !== null && daysSinceLastPost > 1 && "Your streak has ended. Start a new one!"}
          </p>
        </div>
      </div>
    </div>
  );
}
