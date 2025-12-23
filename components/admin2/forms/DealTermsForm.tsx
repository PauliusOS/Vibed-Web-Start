"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Percent, Calendar, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Deliverable {
  id: string;
  description: string;
  dueDate?: string;
}

interface DealTerms {
  compensationType: "fixed" | "commission" | "hybrid";
  fixedAmount?: number;
  commissionRate?: number;
  bonusAmount?: number;
  paymentSchedule: "upfront" | "milestone" | "completion" | "net30";
  deliverables: Deliverable[];
  exclusivity: boolean;
  usageRights: "perpetual" | "limited" | "exclusive";
  usageDuration?: number; // months
  notes?: string;
}

interface DealTermsFormProps {
  initialValues?: Partial<DealTerms>;
  onChange?: (terms: DealTerms) => void;
  onSave?: (terms: DealTerms) => void;
  className?: string;
}

const DEFAULT_TERMS: DealTerms = {
  compensationType: "fixed",
  paymentSchedule: "completion",
  deliverables: [],
  exclusivity: false,
  usageRights: "perpetual",
};

export function DealTermsForm({
  initialValues,
  onChange,
  onSave,
  className = "",
}: DealTermsFormProps) {
  const [terms, setTerms] = useState<DealTerms>({
    ...DEFAULT_TERMS,
    ...initialValues,
  });

  const updateTerms = (updates: Partial<DealTerms>) => {
    const newTerms = { ...terms, ...updates };
    setTerms(newTerms);
    if (onChange) {
      onChange(newTerms);
    }
  };

  const addDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
    };
    updateTerms({
      deliverables: [...terms.deliverables, newDeliverable],
    });
  };

  const updateDeliverable = (id: string, updates: Partial<Deliverable>) => {
    updateTerms({
      deliverables: terms.deliverables.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    });
  };

  const removeDeliverable = (id: string) => {
    updateTerms({
      deliverables: terms.deliverables.filter((d) => d.id !== id),
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(terms);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Compensation Type */}
      <div className="space-y-3">
        <Label className="text-white/80">Compensation Type</Label>
        <Select
          value={terms.compensationType}
          onValueChange={(value: any) =>
            updateTerms({ compensationType: value })
          }
        >
          <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed Fee</SelectItem>
            <SelectItem value="commission">Commission Only</SelectItem>
            <SelectItem value="hybrid">Hybrid (Fixed + Commission)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fixed Amount */}
      {(terms.compensationType === "fixed" ||
        terms.compensationType === "hybrid") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <Label className="text-white/80">Fixed Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="number"
              value={terms.fixedAmount || ""}
              onChange={(e) =>
                updateTerms({ fixedAmount: parseFloat(e.target.value) })
              }
              placeholder="5000"
              className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
            />
          </div>
        </motion.div>
      )}

      {/* Commission Rate */}
      {(terms.compensationType === "commission" ||
        terms.compensationType === "hybrid") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <Label className="text-white/80">Commission Rate (%)</Label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="number"
              value={terms.commissionRate || ""}
              onChange={(e) =>
                updateTerms({ commissionRate: parseFloat(e.target.value) })
              }
              placeholder="10"
              min="0"
              max="100"
              step="0.5"
              className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
            />
          </div>
        </motion.div>
      )}

      {/* Bonus Amount */}
      <div className="space-y-2">
        <Label className="text-white/80">Bonus Amount (Optional)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="number"
            value={terms.bonusAmount || ""}
            onChange={(e) =>
              updateTerms({ bonusAmount: parseFloat(e.target.value) || undefined })
            }
            placeholder="Performance bonus"
            className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
          />
        </div>
        <p className="text-xs text-white/40">
          Additional compensation for exceeding targets
        </p>
      </div>

      {/* Payment Schedule */}
      <div className="space-y-3">
        <Label className="text-white/80">Payment Schedule</Label>
        <Select
          value={terms.paymentSchedule}
          onValueChange={(value: any) => updateTerms({ paymentSchedule: value })}
        >
          <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upfront">100% Upfront</SelectItem>
            <SelectItem value="milestone">Milestone-based</SelectItem>
            <SelectItem value="completion">Upon Completion</SelectItem>
            <SelectItem value="net30">Net 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deliverables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-white/80">Deliverables</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addDeliverable}
            className="text-blue-400 hover:text-blue-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {terms.deliverables.map((deliverable, index) => (
              <motion.div
                key={deliverable.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 items-start p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder={`Deliverable ${index + 1}`}
                    value={deliverable.description}
                    onChange={(e) =>
                      updateDeliverable(deliverable.id, {
                        description: e.target.value,
                      })
                    }
                    className="bg-white/[0.02] border-white/[0.06] text-white"
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="date"
                      value={deliverable.dueDate || ""}
                      onChange={(e) =>
                        updateDeliverable(deliverable.id, {
                          dueDate: e.target.value,
                        })
                      }
                      className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeliverable(deliverable.id)}
                  className="text-red-400 hover:text-red-300 h-10 w-10 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {terms.deliverables.length === 0 && (
            <div className="text-center py-6 text-white/40 text-sm border border-dashed border-white/[0.1] rounded-lg">
              No deliverables added. Click "Add" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Usage Rights */}
      <div className="space-y-3">
        <Label className="text-white/80">Usage Rights</Label>
        <Select
          value={terms.usageRights}
          onValueChange={(value: any) => updateTerms({ usageRights: value })}
        >
          <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="perpetual">Perpetual (Unlimited)</SelectItem>
            <SelectItem value="limited">Limited Duration</SelectItem>
            <SelectItem value="exclusive">Exclusive Rights</SelectItem>
          </SelectContent>
        </Select>

        {terms.usageRights === "limited" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="text-white/80 text-sm">Duration (months)</Label>
            <Input
              type="number"
              value={terms.usageDuration || ""}
              onChange={(e) =>
                updateTerms({ usageDuration: parseInt(e.target.value) })
              }
              placeholder="12"
              min="1"
              className="bg-white/[0.02] border-white/[0.06] text-white"
            />
          </motion.div>
        )}
      </div>

      {/* Exclusivity */}
      <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
        <input
          type="checkbox"
          id="exclusivity"
          checked={terms.exclusivity}
          onChange={(e) => updateTerms({ exclusivity: e.target.checked })}
          className="w-4 h-4 rounded border-white/[0.2] bg-white/[0.02] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
        />
        <div className="flex-1">
          <label
            htmlFor="exclusivity"
            className="text-white/80 cursor-pointer text-sm font-medium"
          >
            Exclusivity Agreement
          </label>
          <p className="text-xs text-white/40 mt-0.5">
            Creator cannot promote competing brands during campaign
          </p>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label className="text-white/80">Additional Notes</Label>
        <Textarea
          value={terms.notes || ""}
          onChange={(e) => updateTerms({ notes: e.target.value })}
          placeholder="Any additional terms or conditions..."
          className="bg-white/[0.02] border-white/[0.06] text-white min-h-[100px]"
        />
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="pt-4 border-t border-white/[0.06]">
          <Button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Deal Terms
          </Button>
        </div>
      )}
    </div>
  );
}
