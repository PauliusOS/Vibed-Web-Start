"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DatePreset {
  label: string;
  getValue: () => DateRange;
}

interface DateRangePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (range: DateRange) => void;
  initialRange?: DateRange;
  title?: string;
  description?: string;
  customPresets?: DatePreset[];
}

const defaultPresets: DatePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "Last 90 Days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from, to };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { from, to };
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from, to };
    },
  },
  {
    label: "This Year",
    getValue: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = new Date(now.getFullYear(), 11, 31);
      return { from, to };
    },
  },
];

export function DateRangePickerDialog({
  open,
  onOpenChange,
  onSelect,
  initialRange,
  title = "Select Date Range",
  description = "Choose a preset or custom date range",
  customPresets,
}: DateRangePickerDialogProps) {
  const presets = customPresets || defaultPresets;

  const [selectedRange, setSelectedRange] = useState<DateRange | null>(
    initialRange || null
  );
  const [customFrom, setCustomFrom] = useState(
    initialRange?.from.toISOString().split("T")[0] || ""
  );
  const [customTo, setCustomTo] = useState(
    initialRange?.to.toISOString().split("T")[0] || ""
  );
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePresetClick = (preset: DatePreset, label: string) => {
    const range = preset.getValue();
    setSelectedRange(range);
    setCustomFrom(range.from.toISOString().split("T")[0]);
    setCustomTo(range.to.toISOString().split("T")[0]);
    setSelectedPreset(label);
  };

  const handleCustomDateChange = () => {
    if (customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);

      if (from <= to) {
        setSelectedRange({ from, to });
        setSelectedPreset(null);
      }
    }
  };

  const handleApply = () => {
    if (selectedRange) {
      onSelect(selectedRange);
      onOpenChange(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-white/80">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePresetClick(preset, preset.label)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPreset === preset.label
                      ? "bg-blue-500 text-white"
                      : "bg-white/[0.02] border border-white/[0.06] text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="space-y-4">
            <Label className="text-white/80">Custom Range</Label>

            <div className="space-y-3">
              <div>
                <Label htmlFor="from-date" className="text-sm text-white/60 mb-2 block">
                  From Date
                </Label>
                <input
                  id="from-date"
                  type="date"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    handleCustomDateChange();
                  }}
                  className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="to-date" className="text-sm text-white/60 mb-2 block">
                  To Date
                </Label>
                <input
                  id="to-date"
                  type="date"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    handleCustomDateChange();
                  }}
                  min={customFrom}
                  className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Range Preview */}
        {selectedRange && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Selected Range:</span>
              <span className="text-white">
                {formatDate(selectedRange.from)} - {formatDate(selectedRange.to)}
              </span>
              <span className="text-white/60 ml-auto">
                ({Math.ceil((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24))} days)
              </span>
            </div>
          </motion.div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedRange}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Apply Range
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
