"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface AdminBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function AdminBadge({ className, size = "sm" }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full",
        "bg-gradient-to-r from-cyan-500/20 to-blue-500/20",
        "text-cyan-400 font-medium",
        "border border-cyan-500/30",
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-xs",
        className
      )}
    >
      <ShieldCheck className={cn(
        size === "sm" && "w-3 h-3",
        size === "md" && "w-3.5 h-3.5"
      )} />
      Admin
    </span>
  );
}
