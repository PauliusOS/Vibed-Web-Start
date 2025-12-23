"use client";

import { cn } from "@/lib/utils";

interface LightRaysProps {
  isActive: boolean;
  className?: string;
  color?: string;
}

export function LightRays({
  isActive,
  className,
  color = "59, 130, 246", // RGB values for blue
}: LightRaysProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Main light ray cone */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[35%] w-[300px] h-[200px]"
        style={{
          background: `conic-gradient(
            from 180deg at 50% 100%,
            transparent 25%,
            rgba(${color}, 0.03) 35%,
            rgba(${color}, 0.08) 45%,
            rgba(${color}, 0.12) 50%,
            rgba(${color}, 0.08) 55%,
            rgba(${color}, 0.03) 65%,
            transparent 75%
          )`,
          filter: "blur(8px)",
        }}
      />

      {/* Secondary wider glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[30%] w-[400px] h-[250px]"
        style={{
          background: `conic-gradient(
            from 180deg at 50% 100%,
            transparent 20%,
            rgba(${color}, 0.02) 30%,
            rgba(${color}, 0.05) 45%,
            rgba(${color}, 0.08) 50%,
            rgba(${color}, 0.05) 55%,
            rgba(${color}, 0.02) 70%,
            transparent 80%
          )`,
          filter: "blur(20px)",
        }}
      />

      {/* Center bright spot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[32%] w-[100px] h-[60px]"
        style={{
          background: `radial-gradient(
            ellipse at center bottom,
            rgba(${color}, 0.3) 0%,
            rgba(${color}, 0.1) 40%,
            transparent 70%
          )`,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
