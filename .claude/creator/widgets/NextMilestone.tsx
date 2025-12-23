"use client";

import { motion } from "motion/react";
import { TrendingUp, Users, DollarSign, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  type: "followers" | "earnings";
  current: number;
  next: number;
  icon: React.ReactNode;
  label: string;
  color: string;
  unit: string;
}

interface NextMilestoneProps {
  followers: number;
  earnings: number;
}

export function NextMilestone({ followers, earnings }: NextMilestoneProps) {
  // Calculate next milestone
  const getNextMilestone = (current: number, type: "followers" | "earnings") => {
    const milestones = type === "followers"
      ? [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000]
      : [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

    return milestones.find(m => m > current) || milestones[milestones.length - 1];
  };

  const nextFollowerMilestone = getNextMilestone(followers, "followers");
  const nextEarningsMilestone = getNextMilestone(earnings, "earnings");

  const milestones: Milestone[] = [
    {
      type: "followers",
      current: followers,
      next: nextFollowerMilestone,
      icon: <Users className="h-4 w-4" />,
      label: "Followers",
      color: "cyan",
      unit: "",
    },
    {
      type: "earnings",
      current: earnings,
      next: nextEarningsMilestone,
      icon: <DollarSign className="h-4 w-4" />,
      label: "Earnings",
      color: "emerald",
      unit: "$",
    },
  ];

  const colorClasses = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      bar: "from-cyan-500 to-cyan-400",
      glow: "bg-cyan-500/20",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      bar: "from-emerald-500 to-emerald-400",
      glow: "bg-emerald-500/20",
    },
  };

  const calculateProgress = (current: number, next: number) => {
    // Find the previous milestone
    const milestoneArray = next <= 100000
      ? [0, 1000, 5000, 10000, 25000, 50000, 100000]
      : [0, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

    const prev = [...milestoneArray].reverse().find(m => m < current) || 0;
    const range = next - prev;
    const progress = current - prev;

    return (progress / range) * 100;
  };

  const getRemaining = (current: number, next: number) => {
    return next - current;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />

      {/* Sparkle particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + (i % 2) * 60}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-3 w-3 text-purple-400/30" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/90">Next Milestone</h3>
            <p className="text-xs text-white/40 mt-0.5">You're almost there!</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const colors = colorClasses[milestone.color as keyof typeof colorClasses];
            const progress = calculateProgress(milestone.current, milestone.next);
            const remaining = getRemaining(milestone.current, milestone.next);

            return (
              <motion.div
                key={milestone.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-3"
              >
                {/* Milestone header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      colors.bg,
                      colors.border,
                      "border"
                    )}>
                      <div className={colors.text}>
                        {milestone.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-medium">
                        {milestone.label}
                      </p>
                      <p className={cn("text-sm font-semibold", colors.text)}>
                        {milestone.unit}{milestone.next.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Remaining count */}
                  <div className="text-right">
                    <p className="text-xs text-white/40">
                      {remaining.toLocaleString()} more
                    </p>
                    <p className={cn("text-lg font-bold font-mono", colors.text)}>
                      {progress.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Progress bar with labels */}
                <div className="space-y-1.5">
                  <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    {/* Progress fill */}
                    <motion.div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        colors.bar,
                        "relative overflow-hidden"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        delay: index * 0.15 + 0.3,
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>

                    {/* Milestone marker */}
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />
                  </div>

                  {/* Current vs Next labels */}
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span>
                      {milestone.unit}{milestone.current.toLocaleString()}
                    </span>
                    <span>
                      {milestone.unit}{milestone.next.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "p-4 rounded-lg text-center",
            "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
            "border border-purple-500/20"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">
              Keep pushing!
            </span>
          </div>
          <p className="text-xs text-white/50">
            {followers >= earnings * 100
              ? "Your follower growth is strong! Focus on monetization next."
              : "Great earnings momentum! Keep engaging with your audience."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
