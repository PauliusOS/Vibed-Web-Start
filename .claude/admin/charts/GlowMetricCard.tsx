"use client";

import { memo } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GlowColor = "blue" | "cyan" | "purple" | "green";
type GlowIntensity = "low" | "medium" | "high";

interface GlowMetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: LucideIcon;
  glowColor?: GlowColor;
  glowIntensity?: GlowIntensity;
  isLive?: boolean;
  delay?: number;
  animateValue?: boolean;
  className?: string;
}

// Glow color configurations
const glowColors: Record<GlowColor, { core: string; mid: string; outer: string }> = {
  blue: {
    core: "rgba(56, 189, 248, 0.3)", // #38bdf8
    mid: "rgba(59, 130, 246, 0.2)",  // #3b82f6
    outer: "rgba(14, 165, 233, 0.1)", // #0ea5e9
  },
  cyan: {
    core: "rgba(34, 211, 238, 0.3)", // #22d3ee
    mid: "rgba(56, 189, 248, 0.2)",  // #38bdf8
    outer: "rgba(6, 182, 212, 0.1)", // #06b6d4
  },
  purple: {
    core: "rgba(168, 85, 247, 0.3)", // #a855f7
    mid: "rgba(139, 92, 246, 0.2)",  // #8b5cf6
    outer: "rgba(124, 58, 237, 0.1)", // #7c3aed
  },
  green: {
    core: "rgba(34, 197, 94, 0.3)",  // #22c55e
    mid: "rgba(16, 185, 129, 0.2)",  // #10b981
    outer: "rgba(5, 150, 105, 0.1)", // #059669
  },
};

// Intensity multipliers
const intensityMultipliers: Record<GlowIntensity, number> = {
  low: 0.5,
  medium: 1.0,
  high: 1.5,
};

// Glow Orb Sub-component
const GlowOrb = memo(function GlowOrb({
  color = "blue",
  intensity = "medium",
  isLive = false,
}: {
  color?: GlowColor;
  intensity?: GlowIntensity;
  isLive?: boolean;
}) {
  const colors = glowColors[color];
  const multiplier = intensityMultipliers[intensity];

  // Calculate adjusted opacities based on intensity
  const coreOpacity = parseFloat(colors.core.match(/[\d.]+\)$/)?.[0].replace(')', '') || '0.3') * multiplier;
  const midOpacity = parseFloat(colors.mid.match(/[\d.]+\)$/)?.[0].replace(')', '') || '0.2') * multiplier;
  const outerOpacity = parseFloat(colors.outer.match(/[\d.]+\)$/)?.[0].replace(')', '') || '0.1') * multiplier;

  // Extract RGB values
  const coreRgb = colors.core.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)?.[0] || 'rgb(56, 189, 248';
  const midRgb = colors.mid.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)?.[0] || 'rgb(59, 130, 246';
  const outerRgb = colors.outer.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)?.[0] || 'rgb(14, 165, 233';

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: '350px',
        height: '350px',
        background: `radial-gradient(circle at center, ${coreRgb}, ${coreOpacity}) 0%, ${midRgb}, ${midOpacity}) 35%, ${outerRgb}, ${outerOpacity}) 60%, transparent 100%)`,
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: 0,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isLive
          ? {
              opacity: [coreOpacity * 0.7, coreOpacity, coreOpacity * 0.7],
              scale: [1, 1.05, 1],
            }
          : { opacity: coreOpacity * 0.7, scale: 1 }
      }
      transition={
        isLive
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {
              duration: 0.8,
              ease: "easeOut",
            }
      }
    />
  );
});

GlowOrb.displayName = "GlowOrb";

// Main Component
export const GlowMetricCard = memo(function GlowMetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  glowColor = "blue",
  glowIntensity = "medium",
  isLive = false,
  delay = 0,
  animateValue = true,
  className,
}: GlowMetricCardProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Background Glow Orb */}
      <GlowOrb color={glowColor} intensity={glowIntensity} isLive={isLive} />

      {/* Glassmorphic Card */}
      <div
        className={cn(
          "relative z-10 p-6 rounded-xl min-w-[200px]",
          // Glassmorphism
          "bg-gradient-to-br from-white/[0.04] to-white/[0.02]",
          "border border-white/[0.06]",
          "backdrop-blur-[20px]",
          // Shadow
          "shadow-lg shadow-black/10",
          // Hover states
          "hover:from-white/[0.06] hover:to-white/[0.03]",
          "hover:border-white/[0.1]",
          "hover:shadow-xl hover:shadow-blue-500/20",
          "hover:-translate-y-1 hover:scale-[1.02]",
          // Transitions
          "transition-all duration-300 ease-out",
          // Performance
          "will-change-transform",
          className
        )}
      >
        {/* Top Highlight Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="flex flex-col gap-3">
          {/* Header: Label + Live Indicator */}
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
            <span className="text-sm font-medium text-white/40 tracking-wide">
              {label}
            </span>
            {Icon && (
              <Icon className="h-4 w-4 text-blue-400/60 group-hover:text-blue-400 ml-auto transition-colors duration-300" />
            )}
          </div>

          {/* Value: Animated Number */}
          <div className="flex items-baseline gap-1">
            {animateValue && typeof value === "number" ? (
              <NumberFlow
                value={value}
                className="text-4xl font-semibold text-white tracking-tighter tabular-nums leading-none"
                transformTiming={{
                  duration: 1200,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            ) : (
              <span className="text-4xl font-semibold text-white tracking-tighter tabular-nums leading-none">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
            )}
            {suffix && (
              <span className="text-sm text-white/40 font-normal">{suffix}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

GlowMetricCard.displayName = "GlowMetricCard";
