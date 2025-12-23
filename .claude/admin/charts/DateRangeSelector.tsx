"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangeOption = {
  label: string;
  value: string;
  days: number;
};

interface DateRangeSelectorProps {
  options?: DateRangeOption[];
  defaultValue?: string;
  onChange?: (value: string, days: number) => void;
  className?: string;
}

const defaultOptions: DateRangeOption[] = [
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 14 days", value: "14d", days: 14 },
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 90 days", value: "90d", days: 90 },
  { label: "Last 12 months", value: "12m", days: 365 },
  { label: "All time", value: "all", days: -1 },
];

/**
 * DateRangeSelector - A minimal date range selector inspired by Framer Analytics
 *
 * Features:
 * - Clean dropdown with subtle glass effect
 * - Smooth animations
 * - Minimal styling matching the dark theme
 * - Customizable options
 */
export function DateRangeSelector({
  options = defaultOptions,
  defaultValue = "30d",
  onChange,
  className,
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.find((o) => o.value === defaultValue) || options[0]
  );

  const handleSelect = (option: DateRangeOption) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option.value, option.days);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-white/[0.04] border border-white/[0.08]",
          "hover:bg-white/[0.06] hover:border-white/[0.12]",
          "transition-all duration-200",
          "text-sm text-white/70 font-normal",
          isOpen && "bg-white/[0.06] border-white/[0.12]"
        )}
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="h-3.5 w-3.5 text-white/50" />
        <span>{selected.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute right-0 top-full mt-2 z-50",
                "min-w-[160px] py-1.5",
                "bg-black/95 backdrop-blur-xl",
                "border border-white/[0.08] rounded-lg",
                "shadow-2xl shadow-black/50"
              )}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm",
                    "transition-colors duration-150",
                    selected.value === option.value
                      ? "text-white bg-white/[0.06]"
                      : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * DateRangePills - An alternative inline pill-based date range selector
 */
interface DateRangePillsProps {
  options?: DateRangeOption[];
  defaultValue?: string;
  onChange?: (value: string, days: number) => void;
  className?: string;
}

export function DateRangePills({
  options = defaultOptions.slice(0, 4), // Default to first 4 options
  defaultValue = "30d",
  onChange,
  className,
}: DateRangePillsProps) {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (option: DateRangeOption) => {
    setSelected(option.value);
    onChange?.(option.value, option.days);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg",
        "bg-white/[0.02] border border-white/[0.06]",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option)}
          className={cn(
            "relative px-3 py-1.5 rounded-md text-xs font-medium",
            "transition-colors duration-200",
            selected === option.value
              ? "text-white"
              : "text-white/50 hover:text-white/70"
          )}
        >
          {selected === option.value && (
            <motion.div
              layoutId="pill-bg"
              className="absolute inset-0 bg-white/[0.08] rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
