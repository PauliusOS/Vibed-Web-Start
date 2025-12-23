"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";

interface RosterHeaderProps {
  totalCreators: number;
  filteredCount: number;
  onInviteCreator: () => void;
  onExport: () => void;
  onSettings?: () => void;
}

export function RosterHeader({
  totalCreators,
  filteredCount,
  onInviteCreator,
  onExport,
  onSettings,
}: RosterHeaderProps) {
  return (
    <div className="space-y-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Creator Roster
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your creators and track their performance across campaigns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {onSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}

          <Button
            size="sm"
            onClick={onInviteCreator}
            className="bg-white text-black hover:bg-white/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Invite Creator
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing <span className="font-medium text-white">{filteredCount}</span>{" "}
          of <span className="font-medium text-white">{totalCreators}</span>{" "}
          creators
        </span>
      </div>
    </div>
  );
}

