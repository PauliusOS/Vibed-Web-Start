"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function ExportButton({
  data,
  filename,
  variant = "outline",
  size = "default",
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      // Get headers from first object
      const headers = Object.keys(data[0]);

      // Create CSV content
      const csvHeaders = headers.join(",");
      const csvRows = data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (value === null || value === undefined) {
              return "";
            }
            const stringValue = String(value);
            if (stringValue.includes(",") || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(",")
      );

      const csv = [csvHeaders, ...csvRows].join("\n");

      // Create blob and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={exportToCSV}
      disabled={disabled || isExporting || !data || data.length === 0}
      className="gap-2"
    >
      {isExporting ? (
        <FileDown className="h-4 w-4 animate-bounce" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {size !== "icon" && (isExporting ? "Exporting..." : "Export CSV")}
    </Button>
  );
}
