"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  badgeCount?: number;
  variant?: "primary" | "accent" | "secondary";
  delay?: number;
}

export function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  badgeCount,
  variant = "primary",
  delay = 0,
}: QuickActionButtonProps) {
  const variantStyles = {
    primary: "hover:border-blue-400/30 hover:bg-blue-500/5",
    accent: "hover:border-cyan-400/30 hover:bg-cyan-500/5",
    secondary: "hover:border-white/20 hover:bg-white/5",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative group h-24 w-full rounded-xl bg-white/[0.02] border border-white/[0.06] transition-all",
        "flex flex-col items-center justify-center gap-1 p-4",
        variantStyles[variant]
      )}
    >
      {/* Hover glow */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

      {/* Badge */}
      {badgeCount !== undefined && badgeCount > 0 && (
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 border-2 border-[rgb(10,10,14)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{badgeCount > 9 ? "9+" : badgeCount}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <Icon className="h-6 w-6 text-blue-400" />
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-white/60">{description}</span>
      </div>
    </motion.button>
  );
}
