"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FRAMER_BG_COLORS,
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
} from "./constants/colors";

interface DateRangeOption {
  value: string;
  label: string;
  days: number;
}

const defaultOptions: DateRangeOption[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "14d", label: "Last 14 days", days: 14 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

interface FramerDatePillsProps {
  value?: string;
  onChange?: (value: string, days: number) => void;
  options?: DateRangeOption[];
  className?: string;
}

/**
 * FramerDatePills - Inline pill-based date range selector
 */
export function FramerDatePills({
  value = "30d",
  onChange,
  options = defaultOptions,
  className,
}: FramerDatePillsProps) {
  const [selected, setSelected] = useState(value);

  const handleSelect = (option: DateRangeOption) => {
    setSelected(option.value);
    onChange?.(option.value, option.days);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-lg border",
        className
      )}
      style={{
        backgroundColor: FRAMER_BG_COLORS.cardHover,
        borderColor: FRAMER_BG_COLORS.cardBorder,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option)}
          className={cn(
            "relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            selected !== option.value && "hover:bg-white/5"
          )}
          style={{
            color:
              selected === option.value
                ? FRAMER_TEXT_COLORS.primary
                : FRAMER_TEXT_COLORS.secondary,
            fontFamily: FRAMER_TYPOGRAPHY.body,
            fontWeight: FRAMER_TYPOGRAPHY.weights.medium,
          }}
        >
          {/* Animated background for selected pill */}
          {selected === option.value && (
            <motion.div
              layoutId="framer-date-pill-bg"
              className="absolute inset-0 rounded-md"
              style={{ backgroundColor: FRAMER_BG_COLORS.cardSelected }}
              transition={{
                type: "spring",
                bounce: 0.15,
                duration: 0.5,
              }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FramerDatePills;
