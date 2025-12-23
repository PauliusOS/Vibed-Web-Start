"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Instagram, Loader2 } from "lucide-react";

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

interface DraftSubmissionFormProps {
  campaignId: Id<"campaigns">;
  dealId: Id<"campaignCreators">;
}

export function DraftSubmissionForm({ campaignId, dealId }: DraftSubmissionFormProps) {
  const { user } = useUser();
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [draftUrl, setDraftUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDraft = useMutation(api.creators.submitDraft);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("You must be logged in to submit a draft");
      return;
    }

    if (!draftUrl.trim()) {
      toast.error("Please provide a draft URL or file link");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDraft({
        dealId,
        platform,
        videoUrl: draftUrl.trim(),
      });

      toast.success("Draft submitted successfully! The team will review it soon.");
      setDraftUrl("");
      setNotes("");
    } catch (error) {
      toast.error("Failed to submit draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform Selection */}
      <div className="space-y-2">
        <Label className="text-white">Platform</Label>
        <RadioGroup
          value={platform}
          onValueChange={(val) => setPlatform(val as "instagram" | "tiktok")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instagram" id="draft-instagram" />
            <Label
              htmlFor="draft-instagram"
              className="flex items-center gap-2 text-white/80 cursor-pointer"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tiktok" id="draft-tiktok" />
            <Label
              htmlFor="draft-tiktok"
              className="flex items-center gap-2 text-white/80 cursor-pointer"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Draft URL */}
      <div className="space-y-2">
        <Label htmlFor="draft-url" className="text-white">
          Draft URL
        </Label>
        <Input
          id="draft-url"
          type="url"
          placeholder="Paste your draft link (Google Drive, Dropbox, etc.)"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <p className="text-xs text-white/40">
          Share your draft via Google Drive, Dropbox, or any file sharing service
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="draft-notes" className="text-white">
          Notes (Optional)
        </Label>
        <Textarea
          id="draft-notes"
          placeholder="Any context or questions for the review team..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[80px]"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !draftUrl.trim()}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit Draft for Review
          </>
        )}
      </Button>
    </form>
  );
}
