"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, CheckCircle2 } from "lucide-react";

interface AssignToCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rosterId: Id<"creatorRosters">;
  organizationId: Id<"organizations">;
  onSuccess?: () => void;
}

export function AssignToCampaignDialog({
  open,
  onOpenChange,
  rosterId,
  organizationId,
  onSuccess,
}: AssignToCampaignDialogProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const assignRoster = useMutation(api.rosters.assignRosterToCampaign);

  // Get active campaigns
  const campaigns = useQuery(api.campaigns.listCampaigns, {
    organizationId,
    status: "active",
  });

  const handleAssign = async () => {
    if (!selectedCampaignId) return;

    setIsAssigning(true);

    try {
      await assignRoster({
        rosterId,
        campaignId: selectedCampaignId as Id<"campaigns">,
      });

      onSuccess?.();
      onOpenChange(false);
      setSelectedCampaignId("");
    } catch (err: any) {
      console.error("Failed to assign roster to campaign:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Link2 className="h-5 w-5 text-cyan-400" />
            Assign to Campaign
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Link this roster to a campaign for performance tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Campaign Selector */}
          <div className="space-y-2">
            <Label className="text-white/70">Select Campaign</Label>
            {!campaigns ? (
              <div className="h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="p-4 text-center text-white/50 text-sm bg-white/5 border border-white/10 rounded-lg">
                No active campaigns found
              </div>
            ) : (
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
                disabled={isAssigning}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Choose a campaign..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign._id} value={campaign._id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/70">
              All creators in this roster will be tracked under the selected campaign's
              analytics and performance metrics.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCampaignId || isAssigning}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isAssigning ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Assign Roster
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
