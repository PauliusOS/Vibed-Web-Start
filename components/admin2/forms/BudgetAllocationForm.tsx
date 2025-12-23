"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Plus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface BudgetAllocationFormProps {
  totalBudget: number;
  initialCategories?: BudgetCategory[];
  onChange?: (categories: BudgetCategory[]) => void;
  onSave?: (categories: BudgetCategory[]) => void;
  className?: string;
}

const DEFAULT_CATEGORIES: Omit<BudgetCategory, "id" | "amount" | "percentage">[] = [
  { name: "Creator Payments", color: "#3b82f6" },
  { name: "Production Costs", color: "#8b5cf6" },
  { name: "Marketing & Ads", color: "#10b981" },
  { name: "Platform Fees", color: "#f59e0b" },
  { name: "Contingency", color: "#ef4444" },
];

export function BudgetAllocationForm({
  totalBudget,
  initialCategories,
  onChange,
  onSave,
  className = "",
}: BudgetAllocationFormProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(
    initialCategories ||
      DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `cat-${index}`,
        amount: 0,
        percentage: 0,
      }))
  );

  const [remainingBudget, setRemainingBudget] = useState(totalBudget);
  const [totalAllocated, setTotalAllocated] = useState(0);

  // Recalculate totals whenever categories change
  useEffect(() => {
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    setTotalAllocated(total);
    setRemainingBudget(totalBudget - total);
  }, [categories, totalBudget]);

  const updateCategory = (id: string, updates: Partial<BudgetCategory>) => {
    const newCategories = categories.map((cat) => {
      if (cat.id !== id) return cat;

      const updated = { ...cat, ...updates };

      // If amount was updated, recalculate percentage
      if ("amount" in updates) {
        updated.percentage = totalBudget > 0 ? (updated.amount / totalBudget) * 100 : 0;
      }

      // If percentage was updated, recalculate amount
      if ("percentage" in updates && !("amount" in updates)) {
        updated.amount = (totalBudget * updated.percentage) / 100;
      }

      return updated;
    });

    setCategories(newCategories);
    if (onChange) {
      onChange(newCategories);
    }
  };

  const addCategory = () => {
    const newCategory: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: "",
      amount: 0,
      percentage: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    if (onChange) {
      onChange(newCategories);
    }
  };

  const removeCategory = (id: string) => {
    const newCategories = categories.filter((cat) => cat.id !== id);
    setCategories(newCategories);
    if (onChange) {
      onChange(newCategories);
    }
  };

  const autoDistribute = () => {
    const perCategory = totalBudget / categories.length;
    const newCategories = categories.map((cat) => ({
      ...cat,
      amount: perCategory,
      percentage: (perCategory / totalBudget) * 100,
    }));
    setCategories(newCategories);
    if (onChange) {
      onChange(newCategories);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(categories);
    }
  };

  const isOverBudget = totalAllocated > totalBudget;
  const allocationPercentage = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Budget Summary */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Total Budget</span>
          <span className="text-white font-semibold text-lg">
            ${totalBudget.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Total Allocated</span>
          <span
            className={`font-semibold text-lg ${
              isOverBudget
                ? "text-red-400"
                : totalAllocated === totalBudget
                  ? "text-green-400"
                  : "text-white"
            }`}
          >
            ${totalAllocated.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Remaining</span>
          <span
            className={`font-semibold text-lg ${
              isOverBudget
                ? "text-red-400"
                : remainingBudget === 0
                  ? "text-green-400"
                  : "text-amber-400"
            }`}
          >
            ${remainingBudget.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(allocationPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${
                isOverBudget
                  ? "bg-red-500"
                  : allocationPercentage === 100
                    ? "bg-green-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
          <div className="text-right text-xs text-white/40">
            {allocationPercentage.toFixed(1)}% allocated
          </div>
        </div>

        {isOverBudget && (
          <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Budget exceeded by ${Math.abs(remainingBudget).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={autoDistribute}
          className="text-white/60 hover:text-white"
        >
          Auto Distribute Evenly
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addCategory}
          className="text-white/60 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-white/80">Budget Categories</Label>

        <div className="space-y-3">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Color Indicator */}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: category.color }}
                  />

                  {/* Category Name */}
                  <div className="flex-1 space-y-2">
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(category.id, { name: e.target.value })
                      }
                      placeholder={`Category ${index + 1}`}
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />

                    {/* Amount Input */}
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        type="number"
                        value={category.amount || ""}
                        onChange={(e) =>
                          updateCategory(category.id, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>

                    {/* Percentage Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Percentage</span>
                        <span className="text-white font-medium">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Slider
                        value={[category.percentage]}
                        onValueChange={([value]) =>
                          updateCategory(category.id, { percentage: value })
                        }
                        max={100}
                        step={0.1}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(category.id)}
                    className="text-red-400 hover:text-red-300 h-10 w-10 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {categories.length === 0 && (
            <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/[0.1] rounded-lg">
              No categories added. Click "Add Category" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="pt-4 border-t border-white/[0.06]">
          <Button
            onClick={handleSave}
            disabled={isOverBudget}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOverBudget ? "Cannot Save - Over Budget" : "Save Budget Allocation"}
          </Button>
        </div>
      )}
    </div>
  );
}
