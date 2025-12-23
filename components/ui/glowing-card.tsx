"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "./glowing-effect";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  /** Glow variant - cyan matches admin69 theme */
  variant?: "default" | "white" | "cyan";
  /** Whether glow is always visible or only on hover */
  alwaysGlow?: boolean;
  /** Blur amount for softer glow */
  blur?: number;
  /** Border width of the glow */
  borderWidth?: number;
  /** Spread angle of the glow effect */
  spread?: number;
  /** Distance where effect activates */
  proximity?: number;
  /** Card padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Rounded corners */
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

/**
 * GlowingCard - A card with interactive glowing border effect (Aceternity style)
 *
 * Uses the cyan variant by default to match the admin69 theme.
 * The glow follows cursor position and activates on hover.
 *
 * @example
 * ```tsx
 * <GlowingCard variant="cyan" padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content...</p>
 * </GlowingCard>
 * ```
 */
export function GlowingCard({
  children,
  className,
  variant = "cyan",
  alwaysGlow = false,
  blur = 0,
  borderWidth = 1,
  spread = 40,
  proximity = 64,
  padding = "md",
  rounded = "2xl",
}: GlowingCardProps) {
  return (
    <div
      className={cn(
        "relative",
        roundedClasses[rounded],
        "bg-[#0a0a0a] border border-white/[0.08]",
        paddingClasses[padding],
        className
      )}
    >
      <GlowingEffect
        variant={variant}
        blur={blur}
        borderWidth={borderWidth}
        spread={spread}
        proximity={proximity}
        glow={alwaysGlow}
        disabled={false}
        inactiveZone={0.01}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * GlowingMetricCard - Specialized card for displaying metrics with glow effect
 */
interface GlowingMetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  variant?: "default" | "white" | "cyan";
  className?: string;
}

export function GlowingMetricCard({
  label,
  value,
  icon,
  trend,
  variant = "cyan",
  className,
}: GlowingMetricCardProps) {
  return (
    <GlowingCard variant={variant} padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[12px] uppercase tracking-wider text-white/40">
            {label}
          </p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-[12px]",
                trend.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-cyan-500/10">{icon}</div>
        )}
      </div>
    </GlowingCard>
  );
}

export default GlowingCard;
