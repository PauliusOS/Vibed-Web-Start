"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, AlertCircle, Instagram, Video as VideoIcon, Sparkles, Link2, FileVideo, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VideoSubmissionModalProps {
  campaignId?: Id<"campaigns">;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preselectedCampaignId?: Id<"campaigns">;
}

type Platform = "instagram" | "tiktok";
type SubmissionMode = "file" | "url";

export function VideoSubmissionModal({
  campaignId: initialCampaignId,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  preselectedCampaignId,
}: VideoSubmissionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const [mode, setMode] = useState<SubmissionMode>("file");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    preselectedCampaignId || initialCampaignId || ""
  );
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState<string>("");

  // URL submission state
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState<string>("");

  // Query campaigns if no campaign is pre-selected
  const campaigns = useQuery(
    api.creators.getMyCampaigns,
    !initialCampaignId ? {} : "skip"
  );

  // Mutations
  const generateUploadUrl = useMutation(api.videos.generateVideoUploadUrl);
  const submitVideoFile = useMutation(api.videos.submitVideoFile);
  const submitVideoUrl = useMutation(api.videos.submitVideo);
  const parseVideoUrl = useAction(api.ensembleData.parseVideoUrl);

  // File validation
  const validateFile = (file: File): string | null => {
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];

    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 500MB";
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload MP4, MOV, AVI, or WebM";
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  // Handle file upload submission
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const campaignToSubmit = initialCampaignId || selectedCampaignId;

    if (!campaignToSubmit) {
      toast.error("Please select a campaign");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      });

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.addEventListener("load", async () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.storageId);
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Content-Type", selectedFile.type);
        xhr.send(selectedFile);
      });

      const storageId = await uploadPromise;

      // Step 3: Submit video metadata
      await submitVideoFile({
        campaignId: campaignToSubmit as Id<"campaigns">,
        platform,
        fileId: storageId as Id<"_storage">,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      // Success - reset and close
      setSelectedFile(null);
      setUploadProgress(0);
      setOpen(false);
      toast.success("Video uploaded successfully! It will be reviewed by an admin.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload video";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Validate URL format client-side
  const validateUrlFormat = (url: string, selectedPlatform: Platform): boolean => {
    const trimmedUrl = url.trim();

    if (selectedPlatform === "instagram") {
      return (
        trimmedUrl.includes("instagram.com/reel/") ||
        trimmedUrl.includes("instagram.com/p/")
      );
    } else {
      return (
        trimmedUrl.includes("tiktok.com/@") ||
        trimmedUrl.includes("vm.tiktok.com/")
      );
    }
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setUrlError("");
  };

  // Handle URL submission
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const campaignToSubmit = initialCampaignId || selectedCampaignId;

    if (!campaignToSubmit) {
      toast.error("Please select a campaign");
      return;
    }

    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    // Validate URL format
    if (!validateUrlFormat(videoUrl, platform)) {
      const errorMsg =
        platform === "instagram"
          ? "Please enter a valid Instagram Reel or Post URL"
          : "Please enter a valid TikTok video URL";
      setUrlError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse the video URL to extract videoId
      const parsedVideo = await parseVideoUrl({ url: videoUrl.trim() });

      if (!parsedVideo) {
        throw new Error(
          "Could not parse video URL. Please check the format and try again."
        );
      }

      // Submit the video
      await submitVideoUrl({
        campaignId: campaignToSubmit as Id<"campaigns">,
        videoUrl: videoUrl.trim(),
        platform: parsedVideo.platform,
        videoId: parsedVideo.videoId,
      });

      // Reset form and close modal
      setVideoUrl("");
      setUrlError("");
      setOpen(false);
      toast.success(
        "Video submitted for approval! You'll be notified once it's reviewed."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit video";
      setUrlError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-[#2a2a2a]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold">
                Submit Your Video
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Upload a file or paste a social media link
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as SubmissionMode)} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="file" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <FileVideo className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Link2 className="h-4 w-4 mr-2" />
              Paste URL
            </TabsTrigger>
          </TabsList>

          {/* FILE UPLOAD TAB */}
          <TabsContent value="file" className="space-y-4 mt-4">
            <form onSubmit={handleFileUpload} className="space-y-5">
              {/* Campaign Selection */}
              {!initialCampaignId && (
                <div className="space-y-2.5">
                  <Label htmlFor="campaign" className="text-sm font-medium">
                    Campaign
                  </Label>
                  {campaigns === undefined ? (
                    <div className="h-11 bg-muted/50 rounded-lg animate-pulse" />
                  ) : campaigns.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-500">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>No campaigns available. Contact your campaign manager.</p>
                    </div>
                  ) : (
                    <Select
                      value={selectedCampaignId}
                      onValueChange={setSelectedCampaignId}
                    >
                      <SelectTrigger className="h-11 bg-muted/50 border-border/50 hover:bg-muted transition-colors">
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign._id} value={campaign._id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Platform Selection */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Platform</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                      platform === "instagram"
                        ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-600/10 shadow-lg shadow-blue-500/20"
                        : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2.5">
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-colors",
                          platform === "instagram"
                            ? "bg-blue-500"
                            : "bg-muted"
                        )}
                      >
                        <Instagram
                          className={cn(
                            "h-5 w-5",
                            platform === "instagram" ? "text-white" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm",
                          platform === "instagram"
                            ? "text-blue-400"
                            : "text-muted-foreground"
                        )}
                      >
                        Instagram
                      </span>
                    </div>
                    {platform === "instagram" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform("tiktok")}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                      platform === "tiktok"
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/20"
                        : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2.5">
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-colors",
                          platform === "tiktok"
                            ? "bg-gradient-to-br from-cyan-500 to-blue-500"
                            : "bg-muted"
                        )}
                      >
                        <VideoIcon
                          className={cn(
                            "h-5 w-5",
                            platform === "tiktok" ? "text-white" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm",
                          platform === "tiktok"
                            ? "text-cyan-400"
                            : "text-muted-foreground"
                        )}
                      >
                        TikTok
                      </span>
                    </div>
                    {platform === "tiktok" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Video File</Label>

                {!selectedFile ? (
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5",
                      fileError ? "border-destructive" : "border-border/50"
                    )}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                      <div className="p-3 rounded-full bg-blue-500/10">
                        <Upload className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Drop your video here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP4, MOV, AVI, or WebM (max 500MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-blue-500 rounded-xl p-4 bg-blue-500/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <FileVideo className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {fileError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{fileError}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 border-border/50 hover:bg-muted/50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedFile ||
                    (!initialCampaignId && (!campaigns || campaigns.length === 0))
                  }
                  className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground/70">
                Your video will be reviewed by an admin before going live
              </p>
            </form>
          </TabsContent>

          {/* URL SUBMISSION TAB */}
          <TabsContent value="url" className="space-y-4 mt-4">
            <form onSubmit={handleUrlSubmit} className="space-y-5">
              {/* Campaign Selection */}
              {!initialCampaignId && (
                <div className="space-y-2.5">
                  <Label htmlFor="campaign-url" className="text-sm font-medium">
                    Campaign
                  </Label>
                  {campaigns === undefined ? (
                    <div className="h-11 bg-muted/50 rounded-lg animate-pulse" />
                  ) : campaigns.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-500">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>No campaigns available. Contact your campaign manager.</p>
                    </div>
                  ) : (
                    <Select
                      value={selectedCampaignId}
                      onValueChange={setSelectedCampaignId}
                    >
                      <SelectTrigger className="h-11 bg-muted/50 border-border/50 hover:bg-muted transition-colors">
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign._id} value={campaign._id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Platform Selection */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">Platform</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPlatform("instagram")}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                      platform === "instagram"
                        ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-600/10 shadow-lg shadow-blue-500/20"
                        : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2.5">
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-colors",
                          platform === "instagram"
                            ? "bg-blue-500"
                            : "bg-muted"
                        )}
                      >
                        <Instagram
                          className={cn(
                            "h-5 w-5",
                            platform === "instagram" ? "text-white" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm",
                          platform === "instagram"
                            ? "text-blue-400"
                            : "text-muted-foreground"
                        )}
                      >
                        Instagram
                      </span>
                    </div>
                    {platform === "instagram" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform("tiktok")}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                      platform === "tiktok"
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/20"
                        : "border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2.5">
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-colors",
                          platform === "tiktok"
                            ? "bg-gradient-to-br from-cyan-500 to-blue-500"
                            : "bg-muted"
                        )}
                      >
                        <VideoIcon
                          className={cn(
                            "h-5 w-5",
                            platform === "tiktok" ? "text-white" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm",
                          platform === "tiktok"
                            ? "text-cyan-400"
                            : "text-muted-foreground"
                        )}
                      >
                        TikTok
                      </span>
                    </div>
                    {platform === "tiktok" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Video URL Input */}
              <div className="space-y-2.5">
                <Label htmlFor="videoUrl" className="text-sm font-medium">
                  Video URL
                </Label>
                <div className="relative">
                  <Input
                    id="videoUrl"
                    type="url"
                    placeholder={
                      platform === "instagram"
                        ? "https://www.instagram.com/reel/..."
                        : "https://www.tiktok.com/@username/video/..."
                    }
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={cn(
                      "h-12 bg-muted/50 border-border/50 transition-all duration-200 pr-10",
                      "focus:bg-muted focus:border-primary/50",
                      urlError && "border-destructive focus:border-destructive"
                    )}
                    required
                  />
                  <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {urlError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{urlError}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {platform === "instagram"
                    ? "Paste a link to your Instagram Reel or Post"
                    : "Paste a link to your TikTok video"}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 border-border/50 hover:bg-muted/50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (!initialCampaignId && (!campaigns || campaigns.length === 0))
                  }
                  className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Submit Video
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground/70">
                Your video will be reviewed by an admin before tracking begins
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
