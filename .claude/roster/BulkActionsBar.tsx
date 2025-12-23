"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus,
  List,
  Mail,
  Download,
  Trash2,
  X,
} from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignToCampaign: () => void;
  onAddToRoster: () => void;
  onSendBrief: () => void;
  onExport: () => void;
  onRemove: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onAssignToCampaign,
  onAddToRoster,
  onSendBrief,
  onExport,
  onRemove,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Card className="bg-primary/5 border-primary/50 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">
            {selectedCount} creator{selectedCount > 1 ? "s" : ""} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-muted-foreground hover:text-white hover:bg-[#2a2a2a]"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Assign to Campaign */}
          <Button
            size="sm"
            variant="outline"
            onClick={onAssignToCampaign}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign to Campaign
          </Button>

          {/* Add to Roster */}
          <Button
            size="sm"
            variant="outline"
            onClick={onAddToRoster}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <List className="h-4 w-4 mr-2" />
            Add to Roster
          </Button>

          {/* Send Brief */}
          <Button
            size="sm"
            variant="outline"
            onClick={onSendBrief}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Brief
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white"
              >
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#1a1a1a] border-[#3a3a3a]"
            >
              <DropdownMenuItem
                onClick={onExport}
                className="text-white hover:bg-[#2a2a2a] cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onRemove}
                className="text-destructive hover:bg-[#2a2a2a] cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

