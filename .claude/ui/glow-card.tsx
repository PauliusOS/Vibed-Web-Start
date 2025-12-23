"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  identifier?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(147, 51, 234, 0.5)", // purple-600
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:opacity-0",
        "before:transition-opacity before:duration-300 before:content-['']",
        "hover:before:opacity-100",
        "after:absolute after:inset-0 after:rounded-lg after:opacity-0",
        "after:transition-opacity after:duration-300 after:content-['']",
        "hover:after:opacity-100 hover:shadow-lg",
        className
      )}
      style={
        {
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
      {...props}
    >
      <style jsx>{`
        .group:hover::before {
          background: linear-gradient(
            90deg,
            transparent,
            var(--glow-color),
            transparent
          );
          animation: shimmer 2s ease-in-out infinite;
        }

        .group:hover::after {
          box-shadow: 0 0 20px var(--glow-color);
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      {children}
    </div>
  );
}
