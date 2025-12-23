"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Settings2, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FRAMER_TEXT_COLORS } from "./constants/colors";

// Available metrics configuration (ordered by priority)
const AVAILABLE_METRICS = [
  { key: "views", label: "Avg Views", priority: 1 },
  { key: "engagement", label: "Engagement", priority: 2 },
  { key: "comments", label: "Comments", priority: 3 },
  { key: "likes", label: "Likes", priority: 4 },
  { key: "saves", label: "Saves", priority: 5 },
  { key: "shares", label: "Shares", priority: 6 },
  { key: "cpm", label: "CPM", priority: 7 },
  { key: "rosterCount", label: "Roster Count", priority: 8 },
] as const;

interface MetricSettingsPopoverProps {
  enabledMetrics: string[];
  onSave: (metrics: string[]) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * MetricSettingsPopover - Allows admins/clients to select which metrics to display
 * Persists selection to database through the onSave callback
 */
export function MetricSettingsPopover({
  enabledMetrics,
  onSave,
  isLoading = false,
  className,
}: MetricSettingsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(enabledMetrics)
  );

  // Reset selection when popover opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedMetrics(new Set(enabledMetrics));
    }
  };

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow removing the last metric
        if (next.size > 1) {
          next.delete(key);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSave = () => {
    // Sort by priority before saving
    const sortedMetrics = Array.from(selectedMetrics).sort((a, b) => {
      const priorityA = AVAILABLE_METRICS.find((m) => m.key === a)?.priority ?? 99;
      const priorityB = AVAILABLE_METRICS.find((m) => m.key === b)?.priority ?? 99;
      return priorityA - priorityB;
    });
    onSave(sortedMetrics);
    setOpen(false);
  };

  const hasChanges = () => {
    if (selectedMetrics.size !== enabledMetrics.length) return true;
    return !enabledMetrics.every((m) => selectedMetrics.has(m));
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${className}`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings2
            className="w-4 h-4"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border-white/[0.08]"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.98)",
          backdropFilter: "blur(12px)",
        }}
        align="end"
        sideOffset={8}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h4
              className="text-sm font-medium"
              style={{ color: FRAMER_TEXT_COLORS.primary }}
            >
              Display Metrics
            </h4>
            <p
              className="text-xs"
              style={{ color: FRAMER_TEXT_COLORS.muted }}
            >
              Select which metrics to show in the dashboard
            </p>
          </div>

          {/* Metric Checkboxes */}
          <div className="space-y-2">
            {AVAILABLE_METRICS.map((metric) => {
              const isSelected = selectedMetrics.has(metric.key);
              const isDisabled = isSelected && selectedMetrics.size === 1;
              
              return (
                <label
                  key={metric.key}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(255, 255, 255, 0.04)"
                      : "transparent",
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => !isDisabled && toggleMetric(metric.key)}
                    disabled={isDisabled}
                    className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span
                    className="text-sm flex-1"
                    style={{ color: FRAMER_TEXT_COLORS.secondary }}
                  >
                    {metric.label}
                  </span>
                  {isSelected && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        color: "rgb(59, 130, 246)",
                      }}
                    >
                      #{metric.priority}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span
              className="text-[10px]"
              style={{ color: FRAMER_TEXT_COLORS.muted }}
            >
              {selectedMetrics.size} metrics selected
            </span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges() || isLoading}
              className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MetricSettingsPopover;

















