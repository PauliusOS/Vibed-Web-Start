"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";
import {
  Hash,
  MessageCircle,
  Send,
  Plus,
  Search,
  Star,
  MoreVertical,
  Users,
  ArrowLeft,
  User,
  Paperclip,
  X,
  FileIcon,
  ImageIcon,
  Video,
  Loader2,
} from "lucide-react";

interface ChatPanelProps {
  organizationId: Id<"organizations">;
  isOpen: boolean;
  onClose: () => void;
}

interface PendingAttachment {
  file: File;
  preview?: string;
}

export function ChatPanel({ organizationId, isOpen, onClose }: ChatPanelProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"conversations"> | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch conversations
  const conversations = useQuery(api.messaging.listConversations, {
    organizationId,
    search: searchQuery || undefined,
  });

  // Fetch messages for selected conversation
  const messages = useQuery(
    api.messaging.getMessages,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );

  // Fetch messageable users
  const users = useQuery(api.messaging.getMessageableUsers, {
    organizationId,
  });

  // Mutations
  const sendMessage = useMutation(api.messaging.sendMessage);
  const markAsRead = useMutation(api.messaging.markAsRead);
  const createConversation = useMutation(api.messaging.createConversation);
  const generateUploadUrl = useMutation(api.messaging.generateUploadUrl);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead({ conversationId: selectedConversationId });
    }
  }, [selectedConversationId, markAsRead]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversationId) return;

    setIsUploading(true);
    try {
      // Upload attachments first
      const uploadedAttachments: Array<{
        type: string;
        url: string;
        name: string;
        storageId?: Id<"_storage">;
      }> = [];

      for (const attachment of attachments) {
        const uploadUrl = await generateUploadUrl({});
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": attachment.file.type },
          body: attachment.file,
        });
        const { storageId } = await response.json();

        uploadedAttachments.push({
          type: attachment.file.type,
          url: `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`,
          name: attachment.file.name,
          storageId,
        });
      }

      await sendMessage({
        conversationId: selectedConversationId,
        content: newMessage.trim() || (attachments.length > 0 ? "Sent an attachment" : ""),
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      });
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const newAttachments: PendingAttachment[] = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const attachment = prev[index];
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async (userId: string) => {
    try {
      const conversationId = await createConversation({
        organizationId,
        participants: [userId],
        type: "direct",
        title: newConversationTitle || undefined,
      });
      setSelectedConversationId(conversationId);
      setIsNewMessageOpen(false);
      setNewConversationTitle("");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleCreateGroupChat = async () => {
    if (!newConversationTitle.trim()) return;

    try {
      const conversationId = await createConversation({
        organizationId,
        participants: [],
        type: "support",
        title: newConversationTitle,
      });
      setSelectedConversationId(conversationId);
      setIsNewMessageOpen(false);
      setNewConversationTitle("");
    } catch (error) {
      console.error("Failed to create group chat:", error);
    }
  };

  const selectedConversation = conversations?.find(
    (c) => c._id === selectedConversationId
  );

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "direct":
        return <MessageCircle className="w-3.5 h-3.5 shrink-0" />;
      case "campaign":
        return <Hash className="w-3.5 h-3.5 shrink-0" />;
      default:
        return <Users className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-[95vw] sm:w-[540px] p-0 bg-[#0a0a0a] border-l border-white/[0.08] flex"
        >
          {/* Conversation List */}
          <div className="w-[200px] border-r border-white/[0.08] flex flex-col">
            <div className="p-3 border-b border-white/[0.08]">
              <SheetTitle className="text-sm font-semibold text-white mb-3">
                Messages
              </SheetTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {conversations === undefined ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full bg-white/[0.04] rounded-md" />
                  ))
                ) : conversations.length === 0 ? (
                  <div className="px-3 py-8 text-center">
                    <p className="text-xs text-white/30">No conversations yet</p>
                    <p className="text-[10px] text-white/20 mt-1">
                      Start a new conversation
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation._id}
                      onClick={() => setSelectedConversationId(conversation._id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left",
                        "transition-colors duration-100",
                        selectedConversationId === conversation._id
                          ? "bg-white/[0.08] text-white"
                          : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      {getConversationIcon(conversation.type)}
                      <span className="text-xs truncate flex-1">
                        {conversation.title || "Conversation"}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-blue-500 text-white rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                      {conversation.isStarred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* New Conversation Button */}
            <div className="p-2 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewMessageOpen(true)}
                className="w-full justify-start gap-2 text-white/50 hover:text-white hover:bg-white/[0.04]"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">New Message</span>
              </Button>
            </div>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    {getConversationIcon(selectedConversation.type)}
                    <span className="text-sm font-medium text-white">
                      {selectedConversation.title || "Conversation"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white/50 hover:text-white">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white/50 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="py-4 space-y-4">
                    {messages === undefined ? (
                      // Loading state
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "" : "justify-end")}>
                          <Skeleton className="w-8 h-8 rounded-full bg-white/[0.04]" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-white/[0.04]" />
                            <Skeleton className="h-10 w-48 bg-white/[0.04] rounded-lg" />
                          </div>
                        </div>
                      ))
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageCircle className="w-10 h-10 text-white/20 mb-3" />
                        <p className="text-sm text-white/50">No messages yet</p>
                        <p className="text-xs text-white/30 mt-1">
                          Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <MessageBubble
                          key={message._id}
                          message={message}
                          isOwn={message.isSentByMe}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-3 border-t border-white/[0.08]">
                  {/* Attachment Preview */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative group flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.06]"
                        >
                          {attachment.preview ? (
                            <img
                              src={attachment.preview}
                              alt={attachment.file.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            getAttachmentIcon(attachment.file.type)
                          )}
                          <span className="text-xs text-white/70 max-w-[100px] truncate">
                            {attachment.file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="p-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/[0.08]"
                      disabled={isUploading}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 text-sm"
                      disabled={isUploading}
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={(!newMessage.trim() && attachments.length === 0) || isUploading}
                      className="h-10 w-10 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-black" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // No conversation selected
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-white/50 max-w-xs">
                  Choose a conversation from the list or start a new one to begin chatting.
                </p>
                <Button
                  onClick={() => setIsNewMessageOpen(true)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* New Message Dialog */}
      <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/[0.08] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">New Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Group chat name input */}
            <div>
              <Input
                placeholder="Conversation name (optional for DMs)"
                value={newConversationTitle}
                onChange={(e) => setNewConversationTitle(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
              />
            </div>

            {/* Create group button */}
            {newConversationTitle.trim() && (
              <Button
                onClick={handleCreateGroupChat}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Users className="w-4 h-4 mr-2" />
                Create Group: {newConversationTitle}
              </Button>
            )}

            {/* Users list */}
            <div className="border-t border-white/[0.08] pt-4">
              <p className="text-xs text-white/50 mb-3">Or start a direct message:</p>
              <ScrollArea className="h-[200px]">
                <div className="space-y-1">
                  {users === undefined ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full bg-white/[0.04] rounded-md" />
                    ))
                  ) : users.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-4">
                      No other users in this organization
                    </p>
                  ) : (
                    users.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => handleStartConversation(user.userId)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{user.userId.slice(-8)}</p>
                          <p className="text-[10px] text-white/40 capitalize">{user.role}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
