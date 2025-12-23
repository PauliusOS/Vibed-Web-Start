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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Check,
  Video,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoForApproval {
  id: string;
  title: string;
  thumbnail: string;
  creatorName: string;
  creatorAvatar?: string;
  uploadedAt: number;
  duration: number;
}

interface BulkApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videos: VideoForApproval[];
  onApprove: (data: {
    videoIds: string[];
    sharedNotes: string;
    notifyCreators: boolean;
    schedulePublication: boolean;
    publicationDate?: Date;
  }) => Promise<void>;
}

export function BulkApprovalDialog({
  open,
  onOpenChange,
  videos,
  onApprove,
}: BulkApprovalDialogProps) {
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(
    new Set(videos.map((v) => v.id))
  );
  const [sharedNotes, setSharedNotes] = useState("");
  const [notifyCreators, setNotifyCreators] = useState(true);
  const [schedulePublication, setSchedulePublication] = useState(false);
  const [publicationDate, setPublicationDate] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  const toggleVideo = (videoId: string) => {
    const newSelection = new Set(selectedVideos);
    if (newSelection.has(videoId)) {
      newSelection.delete(videoId);
    } else {
      newSelection.add(videoId);
    }
    setSelectedVideos(newSelection);
  };

  const selectAll = () => {
    setSelectedVideos(new Set(videos.map((v) => v.id)));
  };

  const deselectAll = () => {
    setSelectedVideos(new Set());
  };

  const handleApprove = async () => {
    if (selectedVideos.size === 0) return;

    setIsApproving(true);
    setApprovalSuccess(false);

    try {
      await onApprove({
        videoIds: Array.from(selectedVideos),
        sharedNotes,
        notifyCreators,
        schedulePublication,
        publicationDate: publicationDate ? new Date(publicationDate) : undefined,
      });
      setApprovalSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setApprovalSuccess(false);
        // Reset form
        setSelectedVideos(new Set(videos.map((v) => v.id)));
        setSharedNotes("");
        setNotifyCreators(true);
        setSchedulePublication(false);
        setPublicationDate("");
      }, 1500);
    } catch (error) {
      console.error("Bulk approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Group videos by creator
  const videosByCreator = videos.reduce((acc, video) => {
    if (!acc[video.creatorName]) {
      acc[video.creatorName] = [];
    }
    acc[video.creatorName].push(video);
    return acc;
  }, {} as Record<string, VideoForApproval[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Bulk Approve Videos</DialogTitle>
              <DialogDescription className="mt-1">
                Approve multiple videos at once ({videos.length} videos)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Selection Controls */}
          <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white">
                {selectedVideos.size} of {videos.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                disabled={selectedVideos.size === videos.length}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                disabled={selectedVideos.size === 0}
              >
                Deselect All
              </Button>
            </div>
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            {Object.entries(videosByCreator).map(([creatorName, creatorVideos]) => (
              <div key={creatorName} className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <User className="w-4 h-4 text-white/60" />
                  <h3 className="text-sm font-medium text-white/80">
                    {creatorName} ({creatorVideos.length} video{creatorVideos.length !== 1 ? "s" : ""})
                  </h3>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {creatorVideos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedVideos.has(video.id)
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                        onClick={() => toggleVideo(video.id)}
                      >
                        <Checkbox
                          checked={selectedVideos.has(video.id)}
                          onCheckedChange={() => toggleVideo(video.id)}
                          className="mt-1"
                        />

                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-28 h-16 rounded bg-white/[0.05] overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white">
                            {formatDuration(video.duration)}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium line-clamp-2 leading-tight mb-1">
                            {video.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(video.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {selectedVideos.has(video.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* Shared Notes */}
          <div className="space-y-2">
            <Label htmlFor="shared-notes" className="text-white/80">
              Shared Approval Notes (Optional)
            </Label>
            <Textarea
              id="shared-notes"
              value={sharedNotes}
              onChange={(e) => setSharedNotes(e.target.value)}
              placeholder="Add notes that will be shared with all selected creators..."
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
            />
            <p className="text-xs text-white/40">
              These notes will be included in approval notifications
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-white/80">Approval Options</Label>

            {/* Notify Creators */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setNotifyCreators(!notifyCreators)}
            >
              <Checkbox
                checked={notifyCreators}
                onCheckedChange={setNotifyCreators}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm text-white cursor-pointer font-medium block mb-1">
                  Notify All Creators
                </label>
                <p className="text-xs text-white/60">
                  Send email notifications to all creators about their approved videos
                </p>
              </div>
            </div>

            {/* Schedule Publication */}
            <div
              className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setSchedulePublication(!schedulePublication)}
            >
              <Checkbox
                checked={schedulePublication}
                onCheckedChange={setSchedulePublication}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label className="text-sm text-white cursor-pointer font-medium block mb-1">
                  Schedule Publication
                </label>
                <p className="text-xs text-white/60 mb-2">
                  Set a common publication date for all approved videos
                </p>

                {schedulePublication && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="datetime-local"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Warning/Info */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-green-400 font-medium mb-1">
                  Bulk Approval Summary:
                </p>
                <ul className="text-white/80 space-y-1">
                  <li>• {selectedVideos.size} video{selectedVideos.size !== 1 ? "s" : ""} will be approved</li>
                  <li>• {new Set(videos.filter(v => selectedVideos.has(v.id)).map(v => v.creatorName)).size} creator{new Set(videos.filter(v => selectedVideos.has(v.id)).map(v => v.creatorName)).size !== 1 ? "s" : ""} affected</li>
                  {notifyCreators && (
                    <li>• All creators will receive approval notifications</li>
                  )}
                  {schedulePublication && publicationDate ? (
                    <li>
                      • Videos will be published on{" "}
                      {new Date(publicationDate).toLocaleString()}
                    </li>
                  ) : (
                    <li>• Videos will be immediately available for publication</li>
                  )}
                  <li>• Campaign metrics will be updated</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving || selectedVideos.size === 0 || (schedulePublication && !publicationDate)}
            className={`${
              approvalSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Approving {selectedVideos.size} videos...
              </>
            ) : approvalSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Approved!
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve {selectedVideos.size} Video{selectedVideos.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
