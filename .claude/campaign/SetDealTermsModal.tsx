"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, TrendingUp, Video, FileText } from "lucide-react";

interface SetDealTermsModalProps {
  campaignId: Id<"campaigns">;
  creatorId: string;
  creatorName: string;
  existingTerms?: {
    flatRatePerVideo?: number;
    rpmRate?: number;
    requiredVideos: number;
    dealNotes?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SetDealTermsModal({
  campaignId,
  creatorId,
  creatorName,
  existingTerms,
  open,
  onOpenChange,
  onSuccess,
}: SetDealTermsModalProps) {
  const [flatRatePerVideo, setFlatRatePerVideo] = useState(
    existingTerms?.flatRatePerVideo?.toString() || ""
  );
  const [rpmRate, setRpmRate] = useState(
    existingTerms?.rpmRate?.toString() || ""
  );
  const [requiredVideos, setRequiredVideos] = useState(
    existingTerms?.requiredVideos?.toString() || "1"
  );
  const [dealNotes, setDealNotes] = useState(existingTerms?.dealNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setDealTerms = useMutation(api.creators.setCreatorDealTerms);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const flatRate = parseFloat(flatRatePerVideo) || 0;
    const rpm = parseFloat(rpmRate) || 0;
    const videos = parseInt(requiredVideos) || 1;

    if (flatRate <= 0 && rpm <= 0) {
      toast.error("Please set either a flat rate or RPM rate");
      return;
    }

    if (videos <= 0) {
      toast.error("Required videos must be at least 1");
      return;
    }

    setIsSubmitting(true);

    try {
      await setDealTerms({
        campaignId,
        creatorId,
        flatRatePerVideo: flatRate,
        rpmRate: rpm,
        requiredVideos: videos,
        dealNotes: dealNotes || undefined,
      });

      toast.success("Deal terms saved successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save deal terms");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate potential earnings
  const potentialFlatEarnings =
    (parseFloat(flatRatePerVideo) || 0) * (parseInt(requiredVideos) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Deal Terms</DialogTitle>
          <DialogDescription>
            Configure payment terms for {creatorName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flat Rate */}
          <div className="space-y-2">
            <Label htmlFor="flatRate" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Flat Rate Per Video
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="flatRate"
                type="number"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={flatRatePerVideo}
                onChange={(e) => setFlatRatePerVideo(e.target.value)}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Fixed payment per live video posted
            </p>
          </div>

          {/* RPM Rate */}
          <div className="space-y-2">
            <Label htmlFor="rpmRate" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              RPM Rate (Revenue Per 1000 Views)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="rpmRate"
                type="number"
                step="0.01"
                min="0"
                placeholder="5.00"
                value={rpmRate}
                onChange={(e) => setRpmRate(e.target.value)}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Additional earnings based on video views
            </p>
          </div>

          {/* Required Videos */}
          <div className="space-y-2">
            <Label htmlFor="requiredVideos" className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              Required Videos
            </Label>
            <Input
              id="requiredVideos"
              type="number"
              min="1"
              placeholder="1"
              value={requiredVideos}
              onChange={(e) => setRequiredVideos(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Number of live videos required for this deal
            </p>
          </div>

          {/* Deal Notes */}
          <div className="space-y-2">
            <Label htmlFor="dealNotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Deal Notes (Optional)
            </Label>
            <Textarea
              id="dealNotes"
              placeholder="Any special terms or notes for this deal..."
              value={dealNotes}
              onChange={(e) => setDealNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {potentialFlatEarnings > 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="text-sm font-medium mb-2">Deal Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Potential Flat Rate Earnings
                  </span>
                  <span className="font-medium">
                    ${potentialFlatEarnings.toLocaleString()}
                  </span>
                </div>
                {parseFloat(rpmRate) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      RPM Earnings
                    </span>
                    <span className="font-medium text-muted-foreground">
                      + variable based on views
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Deal Terms"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
