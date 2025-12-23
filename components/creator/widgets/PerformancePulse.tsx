"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformancePulseProps {
  engagementRate: number;
  isLive?: boolean;
}

export function PerformancePulse({
  engagementRate,
  isLive = true
}: PerformancePulseProps) {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Determine performance level
  const getPerformanceLevel = (rate: number) => {
    if (rate >= 8) return { level: "Excellent", color: "emerald", intensity: "high" };
    if (rate >= 5) return { level: "Good", color: "cyan", intensity: "medium" };
    if (rate >= 3) return { level: "Average", color: "blue", intensity: "low" };
    return { level: "Needs Attention", color: "amber", intensity: "low" };
  };

  const performance = getPerformanceLevel(engagementRate);

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      pulse: "bg-emerald-500",
      glow: "shadow-emerald-500/50",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      pulse: "bg-cyan-500",
      glow: "shadow-cyan-500/50",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      pulse: "bg-blue-500",
      glow: "shadow-blue-500/50",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      pulse: "bg-amber-500",
      glow: "shadow-amber-500/50",
    },
  };

  const colors = colorClasses[performance.color as keyof typeof colorClasses];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg",
              colors.bg,
              colors.border,
              "border"
            )}>
              <Activity className={cn("h-4 w-4", colors.text)} />
            </div>
            <span className="text-sm text-white/50 font-medium">
              Performance Pulse
            </span>
          </div>

          {/* Live indicator */}
          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  colors.pulse
                )} />
                <motion.div
                  key={pulseCount}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    colors.pulse,
                    "opacity-75"
                  )}
                  initial={{ scale: 1, opacity: 0.75 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/40 font-medium">LIVE</span>
            </div>
          )}
        </div>

        {/* Engagement Rate Circle */}
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full blur-xl",
                colors.pulse,
                "opacity-20"
              )}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main circle */}
            <div className={cn(
              "relative w-32 h-32 rounded-full flex items-center justify-center",
              colors.bg,
              colors.border,
              "border-2"
            )}>
              {/* Inner pulse */}
              <motion.div
                className={cn(
                  "absolute inset-4 rounded-full",
                  colors.pulse,
                  "opacity-10"
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Percentage */}
              <div className="relative text-center">
                <motion.p
                  className={cn("text-3xl font-bold font-mono", colors.text)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {engagementRate.toFixed(1)}%
                </motion.p>
                <p className="text-xs text-white/40 mt-1">Engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Level */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <Zap className={cn("h-3.5 w-3.5", colors.text)} />
            <span className={cn("text-sm font-semibold", colors.text)}>
              {performance.level}
            </span>
          </div>
          <p className="text-xs text-white/40">
            {performance.intensity === "high" && "Your content is performing exceptionally well"}
            {performance.intensity === "medium" && "Solid performance, keep it up"}
            {performance.intensity === "low" && "Room for improvement in engagement"}
          </p>
        </div>

        {/* Performance bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/40">
            <span>0%</span>
            <span>10%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", colors.pulse)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((engagementRate / 10) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
