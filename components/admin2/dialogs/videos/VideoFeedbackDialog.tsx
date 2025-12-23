"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  ThumbsUp,
  Reply,
  MoreVertical,
  Edit,
  Trash2,
  Pin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number;
  likes: number;
  likedBy: string[];
  isPinned: boolean;
  replies?: Comment[];
}

interface VideoFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  videoId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onToggleLike: (commentId: string) => Promise<void>;
  onTogglePin: (commentId: string) => Promise<void>;
}

export function VideoFeedbackDialog({
  open,
  onOpenChange,
  videoTitle,
  videoId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onToggleLike,
  onTogglePin,
}: VideoFeedbackDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      authorId: "user1",
      authorName: "Sarah Manager",
      authorAvatar: undefined,
      content: "Great video! The pacing is perfect and the message is clear. I think we can approve this one.",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      likes: 3,
      likedBy: ["user2", "user3", "user4"],
      isPinned: true,
      replies: [
        {
          id: "1-1",
          authorId: "user2",
          authorName: "Mike Admin",
          authorAvatar: undefined,
          content: "I agree! The creator did an excellent job following the brief.",
          timestamp: Date.now() - 1 * 60 * 60 * 1000,
          likes: 1,
          likedBy: ["user1"],
          isPinned: false,
        },
      ],
    },
    {
      id: "2",
      authorId: "user3",
      authorName: "John Reviewer",
      authorAvatar: undefined,
      content: "The audio quality could be better at the 0:45 mark. Maybe we should request a minor revision?",
      timestamp: Date.now() - 30 * 60 * 1000,
      likes: 1,
      likedBy: ["user4"],
      isPinned: false,
    },
  ]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await onAddComment(newComment, replyingTo || undefined);
      setNewComment("");
      setReplyingTo(null);

      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await onEditComment(commentId, editContent);
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = comment.authorId === currentUserId;
    const isLiked = comment.likedBy.includes(currentUserId);
    const isEditing = editingComment === comment.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? "ml-12" : ""} ${comment.isPinned ? "border-l-2 border-blue-500 pl-3" : ""}`}
      >
        <div className="flex items-start gap-3 group">
          {/* Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.authorAvatar} />
            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
              {comment.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white">
                {comment.authorName}
              </span>
              <span className="text-xs text-white/40">
                {formatTimestamp(comment.timestamp)}
              </span>
              {comment.isPinned && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white text-sm"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleEditComment(comment.id);
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-white/80">{comment.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => onToggleLike(comment.id)}
                    className={`flex items-center gap-1.5 text-xs ${
                      isLiked ? "text-blue-400" : "text-white/40 hover:text-white/60"
                    } transition-colors`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>

                  {!isReply && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  )}

                  {isAuthor && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-3.5 h-3.5 text-white/60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!isReply && (
                          <DropdownMenuItem onClick={() => onTogglePin(comment.id)}>
                            <Pin className="w-4 h-4 mr-2" />
                            {comment.isPinned ? "Unpin" : "Pin"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="ml-11 mt-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={currentUserAvatar} />
                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                  {currentUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Reply to ${comment.authorName}...`}
                className="flex-1 bg-white/[0.05] border-white/[0.1] text-white text-sm"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment("");
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Team Feedback</DialogTitle>
              <DialogDescription className="mt-1">{videoTitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Comments List */}
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            <AnimatePresence>
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-white/60 text-sm">
                    No comments yet. Be the first to share feedback!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* New Comment Input */}
        {!replyingTo && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUserAvatar} />
              <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                {currentUserName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/[0.05] border-white/[0.1] text-white"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
