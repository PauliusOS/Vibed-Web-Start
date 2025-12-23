"use client";

import { RosterCard } from "./RosterCard";
import { Doc } from "@/convex/_generated/dataModel";
import { Folder } from "lucide-react";

interface RosterListProps {
  rosters: (Doc<"creatorRosters"> & { isOwner?: boolean; canEdit?: boolean })[];
  onEdit?: (roster: Doc<"creatorRosters">) => void;
  onShare?: (roster: Doc<"creatorRosters">) => void;
  onDelete?: (roster: Doc<"creatorRosters">) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function RosterList({
  rosters,
  onEdit,
  onShare,
  onDelete,
  emptyMessage = "No rosters found",
  emptyDescription = "Create your first roster to organize creators",
}: RosterListProps) {
  if (rosters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rosters.map((roster) => (
        <RosterCard
          key={roster._id}
          roster={roster}
          onEdit={onEdit}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
