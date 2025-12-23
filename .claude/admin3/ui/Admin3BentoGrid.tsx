"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function Admin3BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  variant?: "default" | "highlight" | "glass";
  index?: number;
}

export function BentoItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  variant = "default",
  index = 0,
}: BentoItemProps) {
  const colSpanClasses = {
    1: "col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  };

  const rowSpanClasses = {
    1: "row-span-1",
    2: "row-span-2",
  };

  const variantClasses = {
    default: "bg-[#141414] border-white/[0.08]",
    highlight:
      "bg-gradient-to-br from-[#1a1a2e] to-[#141414] border-blue-500/20",
    glass:
      "bg-white/[0.02] backdrop-blur-sm border-white/[0.06] hover:bg-white/[0.04]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      className={cn(
        "relative group rounded-xl border overflow-hidden",
        "hover:border-white/[0.15] transition-all duration-300",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        variantClasses[variant],
        className
      )}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Dashboard-specific bento grid with preset layouts
export function DashboardBento({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-4">
      {children}
    </div>
  );
}
