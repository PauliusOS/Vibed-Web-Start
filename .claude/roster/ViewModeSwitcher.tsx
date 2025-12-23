"use client";

import { Grid3x3, List, UserCircle2, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list" | "stories" | "analytics" | "showcase";

interface ViewModeSwitcherProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeSwitcher({ mode, onChange }: ViewModeSwitcherProps) {
  const modes = [
    { id: "grid" as const, icon: Grid3x3, label: "Grid" },
    { id: "showcase" as const, icon: Sparkles, label: "Showcase" },
    { id: "list" as const, icon: List, label: "List" },
    { id: "stories" as const, icon: UserCircle2, label: "Stories" },
    { id: "analytics" as const, icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-lg p-1">
      {modes.map((viewMode) => (
        <Button
          key={viewMode.id}
          variant="ghost"
          size="sm"
          onClick={() => onChange(viewMode.id)}
          className={cn(
            "flex items-center gap-2 transition-colors",
            mode === viewMode.id
              ? "bg-white/[0.08] text-white"
              : "text-white/60 hover:text-white hover:bg-white/[0.05]"
          )}
          title={viewMode.label}
        >
          <viewMode.icon className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{viewMode.label}</span>
        </Button>
      ))}
    </div>
  );
}
