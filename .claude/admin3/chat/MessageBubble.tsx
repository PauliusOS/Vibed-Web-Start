"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  Smile,
  MoreHorizontal,
  FileIcon,
  ImageIcon,
  Video,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminBadge } from "@/components/chat/AdminBadge";

interface Message {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  senderId: string;
  content: string;
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
    storageId?: Id<"_storage">;
  }>;
  readBy: string[];
  isDeleted?: boolean;
  createdAt: number;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
  isSentByMe?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn?: boolean;
  isAdmin?: boolean;
}

// Common emoji reactions
const quickEmojis = ["thumbsup", "heart", "fire", "eyes", "clap", "100"];

export function MessageBubble({ message, isOwn = false, isAdmin = false }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const addReaction = useMutation(api.messaging.addReaction);

  const senderName = isOwn ? "You" : message.senderId.slice(-6);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddReaction = async (emoji: string) => {
    try {
      await addReaction({
        messageId: message._id,
        emoji,
      });
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith("image")) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith("video")) return <Video className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  return (
    <div
      className={cn(
        "group flex gap-3 relative",
        isOwn ? "flex-row-reverse" : ""
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-medium",
          isOwn
            ? "bg-blue-500 text-white"
            : "bg-white/10 text-white"
        )}
      >
        {senderName.slice(0, 2).toUpperCase()}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-[75%]", isOwn && "flex flex-col items-end")}>
        {/* Sender Info */}
        <div
          className={cn(
            "flex items-center gap-2 mb-1",
            isOwn ? "justify-end" : ""
          )}
        >
          <span className="text-xs font-medium text-white/70">
            {senderName}
          </span>
          {isAdmin && !isOwn && <AdminBadge />}
          <span className="text-[10px] text-white/30">
            {formatTime(message.createdAt)}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-3 py-2 rounded-2xl text-sm",
            isOwn
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white/[0.06] text-white/90 rounded-bl-md"
          )}
        >
          {message.content}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md",
                    "bg-black/20 hover:bg-black/30 transition-colors"
                  )}
                >
                  {getAttachmentIcon(attachment.type)}
                  <span className="text-xs truncate flex-1">{attachment.name}</span>
                  <Download className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleAddReaction(reaction.emoji)}
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full",
                  "bg-white/[0.06] hover:bg-white/[0.10]",
                  "text-xs text-white/70 transition-colors"
                )}
              >
                <span>{getEmojiDisplay(reaction.emoji)}</span>
                <span className="text-[10px] text-white/50">
                  {reaction.users.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={cn(
            "absolute -top-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "left-0" : "right-0"
          )}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-[#1a1a1a] border border-white/[0.08] hover:bg-white/[0.08]"
              >
                <Smile className="w-3 h-3 text-white/50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-1 bg-[#1a1a1a] border-white/[0.08]"
              align={isOwn ? "start" : "end"}
            >
              <div className="flex gap-0.5">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(emoji)}
                    className="p-1.5 hover:bg-white/[0.08] rounded transition-colors"
                  >
                    <span className="text-base">{getEmojiDisplay(emoji)}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-[#1a1a1a] border border-white/[0.08] hover:bg-white/[0.08]"
              >
                <MoreHorizontal className="w-3 h-3 text-white/50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-[#1a1a1a] border-white/[0.08]"
              align={isOwn ? "start" : "end"}
            >
              <DropdownMenuItem className="text-xs text-white/70 focus:text-white focus:bg-white/[0.08]">
                Copy text
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-white/70 focus:text-white focus:bg-white/[0.08]">
                Pin message
              </DropdownMenuItem>
              {isOwn && (
                <DropdownMenuItem className="text-xs text-red-400 focus:text-red-400 focus:bg-red-500/10">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Convert emoji names to actual emoji
function getEmojiDisplay(emoji: string): string {
  const emojiMap: Record<string, string> = {
    thumbsup: "👍",
    heart: "❤️",
    fire: "🔥",
    eyes: "👀",
    clap: "👏",
    "100": "💯",
    tada: "🎉",
    rocket: "🚀",
    thinking: "🤔",
    laugh: "😂",
    pray: "🙏",
  };

  return emojiMap[emoji] || emoji;
}
