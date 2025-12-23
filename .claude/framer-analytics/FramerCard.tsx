"use client";

import { cn } from "@/lib/utils";
import { FRAMER_BG_COLORS } from "./constants/colors";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface FramerCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  /** Enable interactive cursor-following glow effect */
  interactiveGlow?: boolean;
  /** Glow variant */
  glowVariant?: "default" | "white" | "cyan";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * FramerCard - Card wrapper matching Framer's analytics card style
 *
 * Features:
 * - Glassy see-through dark background
 * - Subtle blue glow around edges
 * - Sharp corners (no border radius)
 * - Backdrop blur for glass effect
 * - Optional interactive glow effect that follows cursor
 */
export function FramerCard({
  children,
  className,
  padding = "md",
  interactiveGlow = false,
  glowVariant = "cyan",
}: FramerCardProps) {
  return (
    <div
      className={cn(
        "relative border backdrop-blur-xl",
        paddingClasses[padding],
        className
      )}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.70)",
        borderColor: "rgba(0, 110, 255, 0.15)",
        boxShadow: "0 0 20px rgba(25, 125, 255, 0.08), 0 0 40px rgba(25, 125, 255, 0.04)",
      }}
    >
      {interactiveGlow && (
        <GlowingEffect
          variant={glowVariant}
          blur={4}
          borderWidth={1}
          spread={80}
          proximity={100}
          glow={false}
          disabled={false}
          inactiveZone={0.3}
          movementDuration={6}
        />
      )}
      <div className={cn(interactiveGlow && "relative z-10")}>{children}</div>
    </div>
  );
}

export default FramerCard;
