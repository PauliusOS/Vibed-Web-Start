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
import { DealTermsForm, type DealTerms } from "@/components/admin2/forms/DealTermsForm";
import { DollarSign, Check, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SetDealTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator: Creator;
  campaignName: string;
  existingTerms?: DealTerms;
  onSave: (dealTerms: DealTerms) => Promise<void>;
}

export function SetDealTermsDialog({
  open,
  onOpenChange,
  creator,
  campaignName,
  existingTerms,
  onSave,
}: SetDealTermsDialogProps) {
  const [dealTerms, setDealTerms] = useState<DealTerms | null>(
    existingTerms || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!dealTerms) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave(dealTerms);
      setSaveSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to save deal terms:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = dealTerms !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Set Deal Terms</DialogTitle>
              <DialogDescription className="mt-1">
                Configure compensation and deliverables for {creator.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Creator & Campaign Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-400">
                    {creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{creator.name}</p>
                  <p className="text-xs text-white/60">{creator.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{campaignName}</p>
                  <p className="text-xs text-white/60">Campaign</p>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Terms Form */}
          <DealTermsForm dealTerms={dealTerms} onChange={setDealTerms} />

          {/* Info Note */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              These deal terms will apply to {creator.name}'s work on {campaignName}.
              You can update these terms at any time.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !isValid}
            className={`${
              saveSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Save Deal Terms
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
