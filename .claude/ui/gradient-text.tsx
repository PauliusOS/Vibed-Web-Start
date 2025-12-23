"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends Omit<HTMLMotionProps<"span">, "children"> {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animationDuration?: number;
  neon?: boolean;
}

export function GradientText({
  children,
  className,
  gradient = "linear-gradient(90deg, #3b82f6 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)",
  animationDuration = 3,
  neon = false,
  ...props
}: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent font-semibold",
        neon && "drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]",
        className
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: "linear",
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
