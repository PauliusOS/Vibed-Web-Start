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
import {
  FileText,
  FileSpreadsheet,
  Download,
  Check,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

export type ExportFormat = "pdf" | "csv" | "excel";

export interface DateRange {
  from: Date;
  to: Date;
}

interface ReportSection {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface ExportCampaignReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (
    format: ExportFormat,
    sections: string[],
    dateRange?: DateRange
  ) => Promise<void>;
  campaignName: string;
  defaultFormat?: ExportFormat;
}

const formatConfig = {
  pdf: {
    icon: FileText,
    label: "PDF Report",
    description: "Formatted report with charts and visuals",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  csv: {
    icon: FileSpreadsheet,
    label: "CSV Data",
    description: "Raw data for analysis in Excel",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  excel: {
    icon: FileSpreadsheet,
    label: "Excel Workbook",
    description: "Formatted spreadsheet with multiple sheets",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
};

const defaultSections: ReportSection[] = [
  {
    id: "overview",
    label: "Campaign Overview",
    description: "Name, dates, status, description",
    icon: Calendar,
    enabled: true,
  },
  {
    id: "performance",
    label: "Performance Metrics",
    description: "Views, engagement, reach, conversions",
    icon: TrendingUp,
    enabled: true,
  },
  {
    id: "creators",
    label: "Creator Breakdown",
    description: "Individual creator performance and stats",
    icon: Users,
    enabled: true,
  },
  {
    id: "budget",
    label: "Budget & Spending",
    description: "Budget allocation, spending, ROI",
    icon: DollarSign,
    enabled: true,
  },
  {
    id: "videos",
    label: "Video Performance",
    description: "Individual video metrics and rankings",
    icon: Video,
    enabled: false,
  },
  {
    id: "timeline",
    label: "Timeline Analysis",
    description: "Performance trends over time",
    icon: TrendingUp,
    enabled: false,
  },
];

export function ExportCampaignReportDialog({
  open,
  onOpenChange,
  onExport,
  campaignName,
  defaultFormat = "pdf",
}: ExportCampaignReportDialogProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>(defaultFormat);
  const [sections, setSections] = useState<ReportSection[]>(defaultSections);
  const [includeComparison, setIncludeComparison] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const enabledSections = sections.filter((s) => s.enabled).map((s) => s.id);
      await onExport(selectedFormat, enabledSections);
      setExportSuccess(true);

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

  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Campaign Report</DialogTitle>
          <DialogDescription>
            Generate a comprehensive report for {campaignName}
          </DialogDescription>
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
              {(Object.keys(formatConfig) as ExportFormat[]).map((format) => {
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

          {/* Report Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">Report Sections</Label>
              <span className="text-xs text-white/40">
                {enabledCount} of {sections.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      section.enabled
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <Checkbox
                      checked={section.enabled}
                      onCheckedChange={() => toggleSection(section.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <label className="text-sm text-white cursor-pointer font-medium">
                          {section.label}
                        </label>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Options */}
          {selectedFormat === "pdf" && (
            <div className="space-y-3">
              <Label className="text-white/80">Additional Options</Label>
              <div
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors"
                onClick={() => setIncludeComparison(!includeComparison)}
              >
                <Checkbox
                  checked={includeComparison}
                  onCheckedChange={setIncludeComparison}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label className="text-sm text-white cursor-pointer block mb-0.5">
                    Include Period Comparison
                  </label>
                  <p className="text-xs text-white/60">
                    Compare current period with previous period
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Info */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-blue-400 font-medium mb-1">
                  Report will include:
                </p>
                <ul className="text-white/80 space-y-0.5">
                  {sections
                    .filter((s) => s.enabled)
                    .map((s) => (
                      <li key={s.id}>• {s.label}</li>
                    ))}
                  {includeComparison && selectedFormat === "pdf" && (
                    <li>• Period comparison charts</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
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
            disabled={isExporting || enabledCount === 0}
            className={`${
              exportSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
