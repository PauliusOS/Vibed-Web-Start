"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconRefresh, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type MetricType = "creatorsOnline" | "totalCreators" | "activeCampaigns" | "totalViews" | "totalVideos";

interface MetricControlProps {
  metricType: MetricType;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  formatValue?: (value: number) => string;
}

export function MetricControl({
  metricType,
  label,
  description,
  min,
  max,
  step,
  defaultValue,
  formatValue,
}: MetricControlProps) {
  const updateMetric = useMutation(api.platformStats.updateMetric);
  const stats = useQuery(api.platformStats.getLatestStats);

  const currentValue = stats?.[metricType] ?? defaultValue;
  const [localValue, setLocalValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState(currentValue.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync local state when backend updates
  useEffect(() => {
    if (stats?.[metricType] !== undefined) {
      setLocalValue(stats[metricType]);
      setInputValue(stats[metricType].toString());
    }
  }, [stats, metricType]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0]!;
    setLocalValue(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setLocalValue(numValue);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMetric({
        metricType,
        value: localValue,
      });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (error) {
      console.error("Failed to update metric:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalValue(defaultValue);
    setInputValue(defaultValue.toString());
  };

  const hasChanges = localValue !== currentValue;
  const displayValue = formatValue ? formatValue(localValue) : localValue.toLocaleString();

  return (
    <div className="space-y-3 p-4 rounded-lg border bg-card">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Label htmlFor={`metric-${metricType}`} className="text-base font-medium">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={localValue === defaultValue}
            className="h-8 px-2"
          >
            <IconRefresh className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Value Display */}
      <div className="text-2xl font-bold text-primary">{displayValue}</div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          id={`metric-${metricType}`}
          value={[localValue]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatValue ? formatValue(min) : min.toLocaleString()}</span>
          <span>{formatValue ? formatValue(max) : max.toLocaleString()}</span>
        </div>
      </div>

      {/* Input + Save Button */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="flex-1"
          placeholder="Enter value"
        />
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={cn(
            "min-w-[100px]",
            justSaved && "bg-green-600 hover:bg-green-700"
          )}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving
            </>
          ) : justSaved ? (
            <>
              <IconCheck className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      {hasChanges && !isSaving && !justSaved && (
        <p className="text-xs text-amber-600 dark:text-amber-500">
          Unsaved changes. Click Save to apply.
        </p>
      )}
    </div>
  );
}
