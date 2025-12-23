"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, Info } from "lucide-react";

interface ArchiveCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ArchiveCampaignDialog({
  open,
  onOpenChange,
  campaignName,
  onConfirm,
  loading = false,
}: ArchiveCampaignDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-400" />
            Archive Campaign
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to archive "{campaignName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-400 mb-2">
                  What happens when you archive:
                </p>
                <ul className="text-xs text-blue-400/80 space-y-1 list-disc list-inside">
                  <li>Campaign will be hidden from active lists</li>
                  <li>All data will be preserved</li>
                  <li>You can restore it anytime</li>
                  <li>Creators will no longer see it in their dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? "Archiving..." : "Archive Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
