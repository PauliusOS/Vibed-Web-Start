"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "card" | "table";
  onViewChange: (view: "card" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border p-1 bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("card")}
        className={cn(
          "gap-2",
          view === "card" &&
            "bg-background shadow-sm hover:bg-background"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Card</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("table")}
        className={cn(
          "gap-2",
          view === "table" &&
            "bg-background shadow-sm hover:bg-background"
        )}
      >
        <Table className="w-4 h-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  );
}
