"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FramerDualLineChart } from "./FramerDualLineChart";

interface RevenueDataPoint {
  date: string;
  income: number;
  expenses: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  title?: string;
  className?: string;
  showTrend?: boolean;
  trendPercentage?: number;
}

export function RevenueChart({
  data,
  title = "Revenue Trends",
  className,
  showTrend = true,
  trendPercentage = 0,
}: RevenueChartProps) {
  const totalIncome = useMemo(
    () => data.reduce((sum, item) => sum + item.income, 0),
    [data]
  );
  const totalExpenses = useMemo(
    () => data.reduce((sum, item) => sum + item.expenses, 0),
    [data]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {showTrend && trendPercentage !== 0 && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg",
              trendPercentage > 0
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-red-400 bg-red-500/10 border border-red-500/20"
            )}
          >
            {trendPercentage > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trendPercentage)}%</span>
          </div>
        )}
      </div>

      {/* Summary stats - Blue theme */}
      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-white/40">Income:</span>
          <span className="text-sm font-semibold text-blue-400">
            ${totalIncome.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <span className="text-xs text-white/40">Expenses:</span>
          <span className="text-sm font-semibold text-sky-400">
            ${totalExpenses.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart - Blue theme Framer style */}
      <FramerDualLineChart
        data={data}
        lines={[
          { dataKey: "income", label: "Income", color: "#3b82f6" },
          { dataKey: "expenses", label: "Expenses", color: "#38bdf8" },
        ]}
        height={260}
        formatXAxis={(date) => {
          const d = new Date(date);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }}
        formatValue={(value) => `$${value.toLocaleString()}`}
      />
    </motion.div>
  );
}
