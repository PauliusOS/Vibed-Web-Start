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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, FileSpreadsheet, Download, Check } from "lucide-react";
import { motion } from "motion/react";

export type ExportFormat = "pdf" | "csv" | "excel";

interface ExportOption {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat, options: string[]) => Promise<void>;
  title?: string;
  description?: string;
  availableFormats?: ExportFormat[];
  exportOptions?: ExportOption[];
  defaultFormat?: ExportFormat;
}

const formatConfig = {
  pdf: {
    icon: FileText,
    label: "PDF Document",
    description: "Best for printing and sharing",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  csv: {
    icon: FileSpreadsheet,
    label: "CSV File",
    description: "Compatible with Excel and spreadsheets",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  excel: {
    icon: FileSpreadsheet,
    label: "Excel Workbook",
    description: "Full formatting and formulas",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
};

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  title = "Export Data",
  description = "Choose format and options for export",
  availableFormats = ["pdf", "csv", "excel"],
  exportOptions = [],
  defaultFormat = "pdf",
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(exportOptions.filter((opt) => opt.enabled).map((opt) => opt.id))
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const toggleOption = (optionId: string) => {
    const newOptions = new Set(selectedOptions);
    if (newOptions.has(optionId)) {
      newOptions.delete(optionId);
    } else {
      newOptions.add(optionId);
    }
    setSelectedOptions(newOptions);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await onExport(selectedFormat, Array.from(selectedOptions));
      setExportSuccess(true);

      // Close dialog after success
      setTimeout(() => {
        onOpenChange(false);
        setExportSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-white/80">Export Format</Label>
            <RadioGroup
              value={selectedFormat}
              onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
              className="space-y-2"
            >
              {availableFormats.map((format) => {
                const config = formatConfig[format];
                const Icon = config.icon;

                return (
                  <div
                    key={format}
                    className={`relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFormat === format
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                    onClick={() => setSelectedFormat(format)}
                  >
                    <RadioGroupItem
                      value={format}
                      id={format}
                      className="mt-1"
                    />

                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor={format}
                        className="text-sm font-medium text-white cursor-pointer block mb-1"
                      >
                        {config.label}
                      </label>
                      <p className="text-xs text-white/60">
                        {config.description}
                      </p>
                    </div>

                    {selectedFormat === format && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Export Options */}
          {exportOptions.length > 0 && (
            <div className="space-y-3">
              <Label className="text-white/80">Export Options</Label>
              <div className="space-y-2">
                {exportOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                  >
                    <Checkbox
                      id={option.id}
                      checked={selectedOptions.has(option.id)}
                      onCheckedChange={() => toggleOption(option.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="text-sm text-white cursor-pointer block mb-0.5"
                      >
                        {option.label}
                      </label>
                      {option.description && (
                        <p className="text-xs text-white/60">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              The export will be downloaded to your device automatically.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className={`${
              exportSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {formatConfig[selectedFormat].label}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
