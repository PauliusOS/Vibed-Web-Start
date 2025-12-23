"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Upload,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  FileVideo,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitToSlotDialogProps {
  scheduledPostId: Id<"scheduledPosts">;
  campaignId: Id<"campaigns">;
  isRevision?: boolean;
  videoId?: Id<"videos">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SubmitToSlotDialog({
  scheduledPostId,
  campaignId,
  isRevision = false,
  videoId,
  open,
  onOpenChange,
  onSuccess,
}: SubmitToSlotDialogProps) {
  const [submissionType, setSubmissionType] = useState<"file" | "url">("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<Id<"_storage"> | null>(
    null
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.videoRevisions.generateUploadUrl);
  const submitDraft = useMutation(api.videoRevisions.submitDraftForSlot);
  const submitRevision = useMutation(api.videoRevisions.submitRevision);

  // Get existing video for revision context
  const existingVideo = useQuery(
    api.videos.getVideo,
    videoId ? { videoId } : "skip"
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file");
        return;
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }

      setIsUploading(true);
      try {
        // Get upload URL
        const uploadUrl = await generateUploadUrl({});

        // Upload file
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await response.json();
        setUploadedFileId(storageId);
        setUploadedFileName(file.name);
        toast.success("Video uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload video");
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleSubmit = async () => {
    // Validate
    if (submissionType === "url" && !videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }
    if (submissionType === "file" && !uploadedFileId) {
      toast.error("Please upload a video file");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRevision && videoId) {
        await submitRevision({
          videoId,
          fileId: submissionType === "file" && uploadedFileId ? uploadedFileId : undefined,
          videoUrl: submissionType === "url" ? videoUrl : undefined,
          notes: notes || undefined,
        });
        toast.success("Revision submitted for review");
      } else {
        await submitDraft({
          scheduledPostId,
          fileId: submissionType === "file" && uploadedFileId ? uploadedFileId : undefined,
          videoUrl: submissionType === "url" ? videoUrl : undefined,
          notes: notes || undefined,
          platform,
        });
        toast.success("Draft submitted for review");
      }

      // Reset form
      setVideoUrl("");
      setNotes("");
      setUploadedFileId(null);
      setUploadedFileName(null);

      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileId(null);
    setUploadedFileName(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isRevision ? "Submit Revision" : "Submit Draft"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Submission Type Tabs */}
          <Tabs
            value={submissionType}
            onValueChange={(v) => setSubmissionType(v as "file" | "url")}
          >
            <TabsList className="w-full bg-white/5 border border-white/10">
              <TabsTrigger
                value="url"
                className="flex-1 data-[state=active]:bg-white/10"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="flex-1 data-[state=active]:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-[12px] text-white/60">Video URL</Label>
                <Input
                  placeholder="https://drive.google.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="border-white/10 bg-transparent text-white"
                />
                <p className="text-[11px] text-white/40">
                  Google Drive, Dropbox, or any direct video link
                </p>
              </div>
            </TabsContent>

            <TabsContent value="file" className="mt-4 space-y-4">
              {uploadedFileId ? (
                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[13px] text-white truncate max-w-[200px]">
                          {uploadedFileName}
                        </p>
                        <p className="text-[11px] text-white/40">
                          Ready to submit
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearUploadedFile}
                      className="h-8 w-8 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    "p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                    isDragActive
                      ? "border-white/40 bg-white/[0.03]"
                      : "border-white/10 hover:border-white/20",
                    isUploading && "pointer-events-none opacity-50"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 mx-auto text-white/40 mb-3 animate-spin" />
                        <p className="text-[13px] text-white/60">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <FileVideo className="w-8 h-8 mx-auto text-white/30 mb-3" />
                        <p className="text-[13px] text-white/60 mb-1">
                          Drag & drop your video here
                        </p>
                        <p className="text-[11px] text-white/40">
                          or click to browse (max 100MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Platform Selection (only for new submissions) */}
          {!isRevision && (
            <div className="space-y-2">
              <Label className="text-[12px] text-white/60">Platform</Label>
              <Select
                value={platform}
                onValueChange={(v) => setPlatform(v as "instagram" | "tiktok")}
              >
                <SelectTrigger className="border-white/10 bg-transparent text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="instagram" className="text-white">
                    Instagram
                  </SelectItem>
                  <SelectItem value="tiktok" className="text-white">
                    TikTok
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[12px] text-white/60">
              Notes (Optional)
            </Label>
            <Textarea
              placeholder={
                isRevision
                  ? "Describe what you changed..."
                  : "Any notes for the reviewer..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-white/10 bg-transparent text-white min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="bg-white text-black hover:bg-white/90"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isRevision ? "Submit Revision" : "Submit Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
