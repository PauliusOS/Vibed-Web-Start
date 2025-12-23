"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Status = "active" | "draft" | "paused" | "completed" | "archived";

interface StatusPillProps {
  status: Status;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    dotColor: "bg-emerald-400",
  },
  draft: {
    label: "Draft",
    color: "text-white/50",
    bgColor: "bg-white/5",
    dotColor: "bg-white/40",
  },
  paused: {
    label: "Paused",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    dotColor: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    dotColor: "bg-blue-400",
  },
  archived: {
    label: "Archived",
    color: "text-white/30",
    bgColor: "bg-white/5",
    dotColor: "bg-white/30",
  },
};

export function StatusPill({
  status,
  size = "md",
  showDot = true,
  className,
}: StatusPillProps) {
  const config = statusConfig[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        config.bgColor,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "rounded-full",
            config.dotColor,
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
            status === "active" && "animate-pulse"
          )}
        />
      )}
      {config.label}
    </motion.span>
  );
}

// Text-only status indicator
export function StatusText({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <span className={cn("text-[12px] capitalize", config.color, className)}>
      {config.label}
    </span>
  );
}
