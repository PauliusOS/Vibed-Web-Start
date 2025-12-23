"use client";

import { cn } from "@/lib/utils";

interface GlowPillarProps {
  isActive: boolean;
  className?: string;
  color?: string;
}

export function GlowPillar({
  isActive,
  className,
  color = "59, 130, 246",
}: GlowPillarProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Main soft glow pillar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[30%] w-[120px] h-[280px]"
        style={{
          background: `linear-gradient(
            to top,
            rgba(${color}, 0.25) 0%,
            rgba(${color}, 0.15) 20%,
            rgba(${color}, 0.08) 40%,
            rgba(${color}, 0.03) 60%,
            transparent 80%
          )`,
          filter: "blur(20px)",
        }}
      />

      {/* Inner brighter core */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[32%] w-[60px] h-[200px]"
        style={{
          background: `linear-gradient(
            to top,
            rgba(${color}, 0.35) 0%,
            rgba(${color}, 0.2) 25%,
            rgba(${color}, 0.1) 50%,
            transparent 75%
          )`,
          filter: "blur(12px)",
        }}
      />

      {/* Bright source at bottom */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[28%] w-[80px] h-[40px]"
        style={{
          background: `radial-gradient(
            ellipse at center,
            rgba(${color}, 0.4) 0%,
            rgba(${color}, 0.2) 40%,
            transparent 70%
          )`,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
