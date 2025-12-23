"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: boolean;
  onClick?: () => void;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.15)",
  hoverScale = true,
  onClick,
}: GlowCardProps) {
  return (
    <motion.div
      className={cn(
        "relative group rounded-xl overflow-hidden",
        "bg-[#141414] border border-white/[0.08]",
        "transition-all duration-300",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hoverScale ? { scale: 1.02 } : undefined}
      onClick={onClick}
      style={{
        boxShadow: `0 0 0 1px transparent`,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Simpler version with static glow
export function GlowCardSimple({
  children,
  className,
  glowColor = "#3b82f6",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden",
        "bg-[#141414] border border-white/[0.08]",
        "hover:border-white/[0.15] transition-all duration-300",
        className
      )}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"
        style={{
          background: glowColor,
          opacity: 0,
        }}
      />
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"
        style={{
          boxShadow: `0 0 40px 5px ${glowColor}`,
        }}
      />

      {children}
    </div>
  );
}
