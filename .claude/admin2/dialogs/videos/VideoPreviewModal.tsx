"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Check,
  XCircle,
  MessageCircle,
  Download,
  Share2,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoData {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  status: "pending" | "approved" | "rejected" | "revision";
  uploadedAt: number;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: VideoData;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestRevision?: () => void;
  onDownload?: () => void;
}

export function VideoPreviewModal({
  open,
  onOpenChange,
  video,
  onApprove,
  onReject,
  onRequestRevision,
  onDownload,
}: VideoPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] p-0 gap-0 bg-black border-white/[0.1]">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[95vh]">
          {/* Video Player - 2/3 width */}
          <div className="lg:col-span-2 relative bg-black flex items-center justify-center">
            {/* Video */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              {/* Placeholder for actual video */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <p className="text-white/40 text-sm">Video Player Placeholder</p>
                {/* In real app, use <video> element */}
                {/* <video
                  ref={videoRef}
                  src={video.url}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                /> */}
              </div>

              {/* Play Overlay */}
              {!isPlaying && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </motion.button>
              )}

              {/* Video Controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded hover:bg-white/20 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white" />
                        )}
                      </button>

                      <div className="flex-1 h-1 bg-white/20 rounded-full">
                        <div className="h-full w-1/3 bg-blue-500 rounded-full" />
                      </div>

                      <span className="text-white text-sm">
                        {formatDuration(video.duration)}
                      </span>

                      <button
                        onClick={toggleMute}
                        className="p-2 rounded hover:bg-white/20 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded hover:bg-white/20 transition-colors"
                      >
                        <Maximize className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors z-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="bg-white/[0.02] border-l border-white/[0.1] flex flex-col overflow-hidden">
            {/* Video Info */}
            <div className="p-6 border-b border-white/[0.06] space-y-4">
              <h2 className="text-xl font-semibold text-white leading-tight">
                {video.title}
              </h2>

              {/* Creator */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={video.creatorAvatar} />
                  <AvatarFallback className="bg-blue-500/20 text-blue-400">
                    {video.creatorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{video.creatorName}</p>
                  <p className="text-xs text-white/40">
                    Uploaded {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {video.status === "pending" && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onApprove}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Video
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={onRequestRevision}
                      variant="outline"
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                    <Button
                      onClick={onReject}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  onClick={onDownload}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full bg-white/[0.02] border-b border-white/[0.06] rounded-none">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex-1">
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex-1">
                  Feedback
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="details" className="p-6 space-y-4 m-0">
                  {video.description && (
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-2">
                        Description
                      </h3>
                      <p className="text-white/60 text-sm">{video.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-2">
                      Video Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/40">Duration</span>
                        <span className="text-white/80">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Status</span>
                        <span className="text-white/80 capitalize">
                          {video.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Uploaded</span>
                        <span className="text-white/80">
                          {new Date(video.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="p-6 space-y-4 m-0">
                  {video.status === "approved" ? (
                    <>
                      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-white/60 text-sm">Views</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {formatNumber(video.views)}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-white/60 text-xs">Likes</span>
                          </div>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(video.likes)}
                          </p>
                        </div>

                        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span className="text-white/60 text-xs">Comments</span>
                          </div>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(video.comments)}
                          </p>
                        </div>

                        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                          <div className="flex items-center gap-1 mb-1">
                            <Share2 className="w-3 h-3 text-green-400" />
                            <span className="text-white/60 text-xs">Shares</span>
                          </div>
                          <p className="text-lg font-bold text-white">
                            {formatNumber(video.shares)}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium text-sm">
                            Engagement Rate
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {((video.likes + video.comments) / video.views * 100).toFixed(1)}%
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-white/20" />
                      <p className="text-white/60 text-sm">
                        Metrics will be available after the video is approved and published
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="feedback" className="p-6 m-0">
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-white/20" />
                    <p className="text-white/60 text-sm">
                      No feedback yet
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
