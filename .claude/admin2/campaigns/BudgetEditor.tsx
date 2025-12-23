"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, AlertTriangle, Info } from "lucide-react";

interface BudgetUtilization {
  totalBudget: number;
  paid: number;
  committed: number;
  remaining: number;
  paidPercent: number;
  committedPercent: number;
  remainingPercent: number;
}

interface BudgetEditorProps {
  budget: string;
  onBudgetChange: (value: string) => void;
  utilization?: BudgetUtilization | null;
}

export function BudgetEditor({
  budget,
  onBudgetChange,
  utilization,
}: BudgetEditorProps) {
  const budgetValue = parseFloat(budget) || 0;
  const paidAmount = utilization?.paid ?? 0;
  const committedAmount = utilization?.committed ?? 0;
  const remainingAmount = utilization?.remaining ?? budgetValue * 100;

  // Check for budget warnings
  const isOverBudget = paidAmount + committedAmount > budgetValue * 100;
  const isNearLimit = remainingAmount < budgetValue * 100 * 0.1 && !isOverBudget;

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Budget</h3>
      </div>

      <div className="space-y-6">
        {/* Budget Input */}
        <div>
          <Label htmlFor="budget" className="text-white/80 mb-2 block">
            Total Budget
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              $
            </span>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => onBudgetChange(e.target.value)}
              placeholder="50000"
              className="pl-8 bg-white/[0.02] border-white/[0.06] text-white"
              min="0"
              step="100"
            />
          </div>
          <p className="text-xs text-white/40 mt-1">
            Enter the total budget for this campaign
          </p>
        </div>

        {/* Budget Utilization */}
        {utilization && budgetValue > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">Budget Utilization</span>
              <span className="text-white font-medium">
                ${((paidAmount + committedAmount) / 100).toLocaleString()} / $
                {budgetValue.toLocaleString()}
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden flex">
              {/* Paid portion */}
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(utilization.paidPercent, 100)}%` }}
              />
              {/* Committed portion */}
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{
                  width: `${Math.min(utilization.committedPercent, 100 - utilization.paidPercent)}%`,
                }}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-white/60">Paid</span>
                </div>
                <p className="text-white font-semibold">
                  ${(paidAmount / 100).toLocaleString()}
                </p>
                <p className="text-xs text-white/40">
                  {utilization.paidPercent.toFixed(1)}%
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-white/60">Committed</span>
                </div>
                <p className="text-white font-semibold">
                  ${(committedAmount / 100).toLocaleString()}
                </p>
                <p className="text-xs text-white/40">
                  {utilization.committedPercent.toFixed(1)}%
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-white/60">Remaining</span>
                </div>
                <p className="text-white font-semibold">
                  ${(remainingAmount / 100).toLocaleString()}
                </p>
                <p className="text-xs text-white/40">
                  {utilization.remainingPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Alerts */}
            {isOverBudget && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Over Budget</p>
                    <p className="text-xs text-red-400/80 mt-1">
                      Total paid and committed amounts exceed the budget. Consider
                      increasing the budget or pausing new commitments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isNearLimit && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      Near Budget Limit
                    </p>
                    <p className="text-xs text-amber-400/80 mt-1">
                      Less than 10% of the budget remains. Monitor spending closely.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info if no utilization data */}
        {!utilization && budgetValue > 0 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-400">Budget Tracking</p>
                <p className="text-xs text-blue-400/80 mt-1">
                  Budget utilization will be tracked once creators are assigned and
                  payments are made.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
