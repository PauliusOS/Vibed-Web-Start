"use client";

import { motion } from "motion/react";
import { Target, TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface GoalTrackerProps {
  goals: {
    followers?: { current: number; target: number };
    views?: { current: number; target: number };
    earnings?: { current: number; target: number };
  };
}

export function GoalTracker({ goals }: GoalTrackerProps) {
  const allGoals: Goal[] = [
    {
      id: "followers",
      label: "Follower Goal",
      current: goals.followers?.current || 0,
      target: goals.followers?.target || 10000,
      unit: "",
      color: "cyan",
    },
    {
      id: "views",
      label: "Views Goal",
      current: goals.views?.current || 0,
      target: goals.views?.target || 100000,
      unit: "",
      color: "blue",
    },
    {
      id: "earnings",
      label: "Earnings Goal",
      current: goals.earnings?.current || 0,
      target: goals.earnings?.target || 5000,
      unit: "$",
      color: "emerald",
    },
  ];

  const colorClasses = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      bar: "from-cyan-500 to-cyan-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      bar: "from-blue-500 to-blue-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      bar: "from-emerald-500 to-emerald-400",
    },
  };

  const calculateProgress = (current: number, target: number) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  const isGoalReached = (current: number, target: number) => current >= target;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

      {/* Content */}
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Target className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/90">Goal Tracker</h3>
            <p className="text-xs text-white/40 mt-0.5">Track your progress</p>
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-5">
          {allGoals.map((goal, index) => {
            const colors = colorClasses[goal.color as keyof typeof colorClasses];
            const progress = calculateProgress(goal.current, goal.target);
            const reached = isGoalReached(goal.current, goal.target);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-2"
              >
                {/* Goal header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60 font-medium">
                      {goal.label}
                    </span>
                    {reached && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                  <span className={cn("text-sm font-semibold", colors.text)}>
                    {progress.toFixed(0)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r",
                      colors.bar
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                      delay: index * 0.1 + 0.2,
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>

                {/* Current vs Target */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">
                    {goal.unit}{goal.current.toLocaleString()}
                  </span>
                  <span className="text-white/30">
                    Target: {goal.unit}{goal.target.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall progress summary */}
        <div className={cn(
          "mt-6 p-4 rounded-lg",
          "bg-white/[0.02] border border-white/[0.06]"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-white/40" />
            <span className="text-xs text-white/50 font-medium">Overall Progress</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white/90 font-mono">
              {(
                allGoals.reduce((sum, goal) =>
                  sum + calculateProgress(goal.current, goal.target), 0
                ) / allGoals.length
              ).toFixed(0)}%
            </span>
            <span className="text-xs text-white/40">average completion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
