"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useDragControls, PanInfo } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat, useChatOptional } from "@/lib/contexts/ChatContext";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Send,
  Plus,
  Search,
  X,
  Minus,
  Maximize2,
  GripVertical,
  Users,
  Hash,
  Star,
  ArrowLeft,
  User,
} from "lucide-react";

export function FloatingChatWidget() {
  const chatContext = useChatOptional();
  const { selectedOrganizationId } = useOrganization();

  // If no chat context or no organization, don't render
  if (!chatContext || !selectedOrganizationId) {
    return null;
  }

  return <FloatingChatWidgetInner organizationId={selectedOrganizationId} />;
}

interface FloatingChatWidgetInnerProps {
  organizationId: Id<"organizations">;
}

function FloatingChatWidgetInner({ organizationId }: FloatingChatWidgetInnerProps) {
  const {
    isWidgetOpen,
    setIsWidgetOpen,
    isMinimized,
    setIsMinimized,
    position,
    setPosition,
    selectedConversationId,
    setSelectedConversationId,
    draftMessages,
    setDraftMessage,
    clearDraftMessage,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Get message from draft or empty
  const currentDraft = selectedConversationId
    ? draftMessages[selectedConversationId] || ""
    : "";

  // Fetch data
  const conversations = useQuery(api.messaging.listConversations, {
    organizationId,
    search: searchQuery || undefined,
  });

  const messages = useQuery(
    api.messaging.getMessages,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );

  const unreadCount = useQuery(api.messaging.getUnreadCount, { organizationId });

  const users = useQuery(api.messaging.getMessageableUsers, { organizationId });

  const canInitiate = useQuery(api.messaging.canUserInitiateConversation, {
    organizationId,
  });

  // Mutations
  const sendMessage = useMutation(api.messaging.sendMessage);
  const markAsRead = useMutation(api.messaging.markAsRead);
  const createConversation = useMutation(api.messaging.createConversation);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead({ conversationId: selectedConversationId });
    }
  }, [selectedConversationId, markAsRead]);

  const handleSendMessage = async () => {
    if (!currentDraft.trim() || !selectedConversationId) return;

    try {
      await sendMessage({
        conversationId: selectedConversationId,
        content: currentDraft.trim(),
      });
      clearDraftMessage(selectedConversationId);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
      });
      setSelectedConversationId(conversationId);
      setIsNewMessageOpen(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
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
      case "group":
        return <Users className="w-3.5 h-3.5 shrink-0" />;
      default:
        return <Users className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  // Collapsed state - just a floating button
  if (!isWidgetOpen) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsWidgetOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25 flex items-center justify-center transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-black" />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </motion.button>
    );
  }

  // Minimized state - small header bar
  if (isMinimized) {
    return (
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x: position.x, y: position.y }}
        className="fixed bottom-6 right-6 z-50 w-72 bg-[#0a0a0a] border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden"
      >
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="h-10 px-3 flex items-center justify-between bg-white/[0.02] border-b border-white/[0.08] cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-white/30" />
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Messages</span>
            {unreadCount && unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-cyan-500 text-black rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(false)}
              className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/[0.08]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWidgetOpen(false)}
              className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full expanded state
  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onDragEnd={handleDragEnd}
      style={{ x: position.x, y: position.y }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50 w-[420px] h-[520px] bg-[#0a0a0a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header - Draggable */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="h-12 px-3 flex items-center justify-between bg-white/[0.02] border-b border-white/[0.08] cursor-grab active:cursor-grabbing shrink-0"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-white/30" />
          {selectedConversationId ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversationId(null)}
                className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/[0.08]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-white truncate max-w-[200px]">
                {selectedConversation?.title || "Conversation"}
              </span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">Messages</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/[0.08]"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsWidgetOpen(false)}
            className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {selectedConversationId ? (
        // Message View
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {messages === undefined ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={cn("flex gap-2", i % 2 === 0 ? "" : "justify-end")}>
                    <Skeleton className="w-6 h-6 rounded-full bg-white/[0.04]" />
                    <Skeleton className="h-8 w-32 bg-white/[0.04] rounded-lg" />
                  </div>
                ))
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageCircle className="w-8 h-8 text-white/20 mb-2" />
                  <p className="text-xs text-white/50">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "flex gap-2",
                      message.isSentByMe ? "justify-end" : ""
                    )}
                  >
                    {!message.isSentByMe && (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-white/50" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] px-3 py-2 rounded-xl text-sm",
                        message.isSentByMe
                          ? "bg-cyan-500 text-black"
                          : "bg-white/[0.08] text-white"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={currentDraft}
                onChange={(e) =>
                  selectedConversationId &&
                  setDraftMessage(selectedConversationId, e.target.value)
                }
                onKeyDown={handleKeyPress}
                className="flex-1 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 text-sm"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!currentDraft.trim()}
                className="h-9 w-9 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-black" />
              </Button>
            </div>
          </div>
        </div>
      ) : isNewMessageOpen ? (
        // New Message View
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3 border-b border-white/[0.08]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNewMessageOpen(false)}
              className="text-white/50 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3">
              <p className="text-xs text-white/50 mb-3">Select a user to message:</p>
              <div className="space-y-1">
                {users === undefined ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full bg-white/[0.04] rounded-md" />
                  ))
                ) : users.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-4">
                    No users available
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
            </div>
          </ScrollArea>
        </div>
      ) : (
        // Conversation List View
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="p-3 border-b border-white/[0.08] shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-0.5">
              {conversations === undefined ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/[0.04] rounded-md" />
                ))
              ) : conversations.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-xs text-white/30">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversationId(conversation._id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                      "transition-colors duration-100",
                      selectedConversationId === conversation._id
                        ? "bg-white/[0.08] text-white"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      {getConversationIcon(conversation.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {conversation.title || "Conversation"}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium bg-cyan-500 text-black rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessagePreview && (
                        <p className="text-xs text-white/40 truncate">
                          {conversation.lastMessagePreview}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* New Message Button - only show for admins */}
          {canInitiate && (
            <div className="p-2 border-t border-white/[0.08] shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewMessageOpen(true)}
                className="w-full justify-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">New Message</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
