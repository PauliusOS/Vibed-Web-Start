"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FRAMER_BG_COLORS,
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
} from "./constants/colors";
import { formatDateRange, getDateRange } from "./utils/formatters";

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

interface FramerDateSelectorProps {
  value?: string;
  onChange?: (value: string, days: number) => void;
  options?: DateRangeOption[];
  showDateRange?: boolean;
  className?: string;
}

/**
 * FramerDateSelector - Dropdown date range picker matching Framer's style
 */
export function FramerDateSelector({
  value = "30d",
  onChange,
  options = defaultOptions,
  showDateRange = true,
  className,
}: FramerDateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === selected) || options[0];
  const dateRange = getDateRange(selectedOption.days);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DateRangeOption) => {
    setSelected(option.value);
    setIsOpen(false);
    onChange?.(option.value, option.days);
  };

  return (
    <div ref={containerRef} className={cn("relative flex items-center gap-3", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
        style={{
          backgroundColor: FRAMER_BG_COLORS.cardHover,
          borderColor: FRAMER_BG_COLORS.cardBorder,
        }}
      >
        <Calendar
          size={14}
          style={{ color: FRAMER_TEXT_COLORS.secondary }}
        />
        <span
          className="text-xs font-semibold"
          style={{
            color: FRAMER_TEXT_COLORS.primary,
            fontFamily: FRAMER_TYPOGRAPHY.body,
            fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
          }}
        >
          {selectedOption.label}
        </span>
        <ChevronDown
          size={14}
          style={{ color: FRAMER_TEXT_COLORS.secondary }}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Date Range Display */}
      {showDateRange && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: "transparent",
            borderColor: FRAMER_BG_COLORS.cardBorder,
          }}
        >
          <Calendar
            size={14}
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
          />
          <span
            className="text-xs font-semibold"
            style={{
              color: FRAMER_TEXT_COLORS.primary,
              fontFamily: FRAMER_TYPOGRAPHY.body,
              fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
            }}
          >
            {formatDateRange(dateRange.start, dateRange.end)}
          </span>
        </div>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[160px] rounded-lg border overflow-hidden shadow-xl"
            style={{
              backgroundColor: FRAMER_BG_COLORS.card,
              borderColor: FRAMER_BG_COLORS.cardBorder,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full px-3 py-2 text-left text-xs font-medium transition-colors",
                  selected === option.value
                    ? "bg-white/10"
                    : "hover:bg-white/5"
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
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FramerDateSelector;
