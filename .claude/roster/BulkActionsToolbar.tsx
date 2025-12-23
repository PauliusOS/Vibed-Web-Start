"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link2, X, UserPlus, Trash2, Mail } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAssignCampaign?: () => void;
  onAddToRoster?: () => void;
  onInvite?: () => void;
  onRemoveFromRoster?: () => void;
  onClearSelection?: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onAssignCampaign,
  onAddToRoster,
  onInvite,
  onRemoveFromRoster,
  onClearSelection,
}: BulkActionsToolbarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white">
                {selectedCount} creator{selectedCount !== 1 ? "s" : ""} selected
              </span>

              <div className="h-6 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                {onAssignCampaign && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onAssignCampaign}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Assign to Campaign
                  </Button>
                )}

                {onAddToRoster && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onAddToRoster}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add to Roster
                  </Button>
                )}

                {onInvite && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onInvite}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invite
                  </Button>
                )}

                {onRemoveFromRoster && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRemoveFromRoster}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}

                <div className="h-6 w-px bg-white/10" />

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClearSelection}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
