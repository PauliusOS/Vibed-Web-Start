"use client";

import { motion } from "motion/react";
import { Check, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricType = "followers" | "engagementRate" | "views" | "earnings";

interface MetricSelectorProps {
  metrics: Array<{
    key: MetricType;
    label: string;
    color: string;
    value: string | number;
    isSelected: boolean;
  }>;
  onToggle: (metricKey: MetricType) => void;
}

export function MetricSelector({ metrics, onToggle }: MetricSelectorProps) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-[20px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium text-white">Metrics</span>
      </div>

      {/* Today Label */}
      <div className="text-xs text-white/40 mb-3">Today</div>

      {/* Metric Checkboxes */}
      <div className="flex flex-col gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex items-center gap-3 group cursor-pointer select-none"
            onClick={() => onToggle(metric.key)}
          >
            {/* Custom Checkbox with Metric Color */}
            <div
              className={cn(
                "h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-200",
                metric.isSelected
                  ? "bg-transparent border-current"
                  : "bg-transparent border-white/20 group-hover:border-white/30"
              )}
              style={{
                borderColor: metric.isSelected ? metric.color : undefined,
                color: metric.color,
              }}
            >
              {metric.isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="h-3 w-3" style={{ color: metric.color }} />
                </motion.div>
              )}
            </div>

            {/* Metric Label & Value */}
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span
                className={cn(
                  "text-sm transition-colors duration-200 truncate",
                  metric.isSelected ? "text-white" : "text-white/40 group-hover:text-white/60"
                )}
              >
                {metric.label}
              </span>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums transition-colors duration-200 ml-2",
                  metric.isSelected ? "text-white/60" : "text-white/30 group-hover:text-white/40"
                )}
              >
                {typeof metric.value === "number"
                  ? metric.value.toLocaleString()
                  : metric.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
