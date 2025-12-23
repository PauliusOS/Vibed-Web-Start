"use client";

import { cn } from "@/lib/utils";

interface GlowingOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  position?: "left" | "right" | "center" | "top-right" | "bottom-left";
  intensity?: "low" | "medium" | "high";
}

/**
 * GlowingOrb - A 3D glowing sphere effect inspired by Framer's analytics page
 *
 * Creates a luminous blue-cyan gradient orb that can be positioned behind content
 * to create depth and visual interest.
 */
export function GlowingOrb({
  className,
  size = "lg",
  position = "left",
  intensity = "medium",
}: GlowingOrbProps) {
  const sizeClasses = {
    sm: "w-[300px] h-[300px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[700px] h-[700px]",
    xl: "w-[900px] h-[900px]",
    "2xl": "w-[1100px] h-[1100px]",
  };

  const positionClasses = {
    left: "-left-[200px] top-1/2 -translate-y-1/2",
    right: "-right-[200px] top-1/2 -translate-y-1/2",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "-right-[150px] -top-[150px]",
    "bottom-left": "-left-[150px] -bottom-[150px]",
  };

  const intensityOpacity = {
    low: "opacity-40",
    medium: "opacity-60",
    high: "opacity-80",
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        sizeClasses[size],
        positionClasses[position],
        intensityOpacity[intensity],
        className
      )}
    >
      {/* Main orb - creates the 3D sphere illusion */}
      <div className="relative w-full h-full">
        {/* Core glow - brightest center */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(
                ellipse 50% 50% at 40% 40%,
                rgba(56, 189, 248, 0.8) 0%,
                rgba(14, 165, 233, 0.6) 25%,
                rgba(2, 132, 199, 0.4) 50%,
                rgba(3, 105, 161, 0.2) 70%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Secondary glow - outer halo */}
        <div
          className="absolute inset-0 rounded-full blur-[60px]"
          style={{
            background: `
              radial-gradient(
                circle at 50% 50%,
                rgba(56, 189, 248, 0.4) 0%,
                rgba(14, 165, 233, 0.3) 30%,
                rgba(2, 132, 199, 0.15) 60%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Ambient glow - very soft outer spread */}
        <div
          className="absolute -inset-[20%] rounded-full blur-[100px]"
          style={{
            background: `
              radial-gradient(
                circle at 50% 50%,
                rgba(56, 189, 248, 0.15) 0%,
                rgba(14, 165, 233, 0.08) 40%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Highlight - creates the 3D "lit from above" effect */}
        <div
          className="absolute top-[10%] left-[15%] w-[30%] h-[25%] rounded-full blur-[30px]"
          style={{
            background: `
              radial-gradient(
                ellipse at 50% 50%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 70%
              )
            `,
          }}
        />
      </div>
    </div>
  );
}

/**
 * DualGlowingOrbs - Two orbs positioned on opposite sides
 * Useful for framing content in the center
 */
export function DualGlowingOrbs({
  className,
  size = "lg",
  intensity = "medium",
}: Omit<GlowingOrbProps, "position">) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <GlowingOrb position="left" size={size} intensity={intensity} />
      <GlowingOrb position="right" size={size} intensity={intensity} />
    </div>
  );
}

/**
 * OrbBackground - Full background treatment with orbs
 * Creates the signature Framer Analytics look
 */
export function OrbBackground({
  children,
  className,
  variant = "dual",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "dual" | "left" | "right" | "center";
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Orb layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {variant === "dual" && (
          <>
            <GlowingOrb position="left" size="xl" intensity="medium" />
            <GlowingOrb position="right" size="xl" intensity="medium" />
          </>
        )}
        {variant === "left" && (
          <GlowingOrb position="left" size="xl" intensity="high" />
        )}
        {variant === "right" && (
          <GlowingOrb position="right" size="xl" intensity="high" />
        )}
        {variant === "center" && (
          <GlowingOrb position="center" size="2xl" intensity="medium" />
        )}
      </div>

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
