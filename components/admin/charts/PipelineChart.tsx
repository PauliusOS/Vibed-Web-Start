"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface PipelineChartProps {
  stages: PipelineStage[];
  title?: string;
  className?: string;
  href?: string;
}

export function PipelineChart({
  stages,
  title = "Sales Pipeline",
  className,
  href,
}: PipelineChartProps) {
  const totalCount = stages.reduce((sum, stage) => sum + stage.count, 0);
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">
              Total: <span className="font-semibold text-white">{totalCount} deals</span>
            </span>
            <span className="text-white/40">
              Value: <span className="font-semibold text-white">${totalValue.toLocaleString()}</span>
            </span>
          </div>

          {/* Stacked progress bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="flex h-full">
              {stages.map((stage, index) => {
                const percentage = totalCount > 0 ? (stage.count / totalCount) * 100 : 0;
                return (
                  <motion.div
                    key={stage.name}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative h-full group cursor-pointer"
                    style={{ backgroundColor: stage.color }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-black/90 backdrop-blur-xl border border-white/[0.08] rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap">
                        <p className="text-xs font-medium text-white">{stage.name}</p>
                        <p className="text-xs text-white/50">
                          {stage.count} deals · ${stage.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend and details */}
          <div className="space-y-2.5 pt-2">
            {stages.map((stage, index) => {
              const percentage = totalCount > 0 ? ((stage.count / totalCount) * 100).toFixed(0) : 0;
              return (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium text-white">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/40">
                      {stage.count} deals
                    </span>
                    <span className="text-sm font-semibold text-white min-w-[80px] text-right">
                      ${stage.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/30 min-w-[40px] text-right">
                      {percentage}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Won deals highlight - Blue theme */}
          {stages.some((s) => s.name.toLowerCase().includes("won")) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 pt-4 border-t border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-400">
                  Total Won
                </span>
                <span className="text-lg font-bold text-blue-400">
                  $
                  {stages
                    .filter((s) => s.name.toLowerCase().includes("won"))
                    .reduce((sum, s) => sum + s.value, 0)
                    .toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </div>
    </motion.div>
  );
}
