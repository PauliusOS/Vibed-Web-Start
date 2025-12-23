"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FRAMER_TEXT_COLORS,
  FRAMER_TYPOGRAPHY,
  FRAMER_CHART_COLORS,
} from "./constants/colors";
import {
  MessageCircle,
  Send,
  Search,
  X,
  Minus,
  PanelRightOpen,
  PanelRightClose,
  Users,
  Hash,
  ArrowLeft,
  Sparkles,
  Bot,
  GripVertical,
  Move,
} from "lucide-react";

// Types
interface Message {
  id: string;
  content: string;
  timestamp: number;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  isAI?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  type: "direct" | "group" | "ai";
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
}

// Display modes
type DisplayMode = "floating" | "sidebar" | "inline";

interface FramerChatProps {
  conversations?: Conversation[];
  messages?: Message[];
  currentUserId?: string;
  onSendMessage?: (conversationId: string, content: string) => void;
  onSelectConversation?: (conversationId: string) => void;
  className?: string;
  /** Display mode: "floating" (draggable widget), "sidebar" (fixed right panel), "inline" (embedded) */
  mode?: DisplayMode;
  /** Initial open state for floating mode */
  defaultOpen?: boolean;
  /** Sidebar width in pixels */
  sidebarWidth?: number;
  /** Callback when mode changes (for layout coordination) */
  onModeChange?: (newMode: "floating" | "sidebar" | "closed") => void;
}

// Sample data for demo
const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    title: "AI Assistant",
    type: "ai",
    participants: [{ id: "ai", name: "Framer AI" }],
    lastMessage: "I can help you analyze your analytics data...",
    lastMessageTime: Date.now() - 1000 * 60 * 5,
    unreadCount: 2,
  },
  {
    id: "conv_2",
    title: "Analytics Team",
    type: "group",
    participants: [
      { id: "user_1", name: "Sarah Johnson" },
      { id: "user_2", name: "Mike Chen" },
      { id: "user_3", name: "Emma Wilson" },
    ],
    lastMessage: "The traffic spike looks interesting",
    lastMessageTime: Date.now() - 1000 * 60 * 30,
    unreadCount: 0,
  },
  {
    id: "conv_3",
    title: "Sarah Johnson",
    type: "direct",
    participants: [{ id: "user_1", name: "Sarah Johnson" }],
    lastMessage: "Can you share the report?",
    lastMessageTime: Date.now() - 1000 * 60 * 60 * 2,
    unreadCount: 1,
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "msg_1",
    content: "Hello! I noticed there's been a significant traffic spike in the last 24 hours. Would you like me to analyze the data?",
    timestamp: Date.now() - 1000 * 60 * 10,
    senderId: "ai",
    senderName: "Framer AI",
    isAI: true,
  },
  {
    id: "msg_2",
    content: "Yes, please! What's causing the increase?",
    timestamp: Date.now() - 1000 * 60 * 8,
    senderId: "current_user",
    senderName: "You",
  },
  {
    id: "msg_3",
    content: "Based on my analysis, the traffic increase is primarily from organic search. Your recent blog post about 'Advanced Analytics' is ranking well for several high-volume keywords. The bounce rate has also improved by 12%.",
    timestamp: Date.now() - 1000 * 60 * 5,
    senderId: "ai",
    senderName: "Framer AI",
    isAI: true,
  },
];

/**
 * FramerChat - Chat component matching Framer Analytics style
 * 
 * Display Modes:
 * - "floating": Draggable widget (default for isWidget)
 * - "sidebar": Fixed right sidebar panel
 * - "inline": Embedded in page layout
 */
export function FramerChat({
  conversations = SAMPLE_CONVERSATIONS,
  messages = SAMPLE_MESSAGES,
  currentUserId = "current_user",
  onSendMessage,
  onSelectConversation,
  className,
  mode = "floating",
  defaultOpen = true,
  sidebarWidth = 380,
  onModeChange,
}: FramerChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(mode);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Notify parent of mode changes
  const handleModeChange = (newMode: "floating" | "sidebar" | "closed") => {
    if (newMode === "closed") {
      setIsOpen(false);
    } else {
      setDisplayMode(newMode);
      setIsOpen(true);
    }
    onModeChange?.(newMode);
  };
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track when component has mounted for hydration-safe time display
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const dragControls = useDragControls();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversation = useMemo(() => 
    conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const filteredConversations = useMemo(() =>
    conversations.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [conversations, searchQuery]
  );

  const totalUnread = useMemo(() =>
    conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    [conversations]
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    onSendMessage?.(selectedConversationId, messageInput);
    setMessageInput("");
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    onSelectConversation?.(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
  };

  // Toggle between floating and sidebar modes
  const toggleDockMode = () => {
    if (displayMode === "sidebar") {
      handleModeChange("floating");
      setPosition({ x: 0, y: 0 }); // Reset position
    } else {
      handleModeChange("sidebar");
    }
  };

  // Close the chat
  const handleClose = () => {
    handleModeChange("closed");
  };

  const formatTime = useCallback((timestamp: number) => {
    // Return stable placeholder during SSR to avoid hydration mismatch
    if (!hasMounted) return "";
    
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  }, [hasMounted]);

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "ai":
        return <Bot className="w-4 h-4" />;
      case "group":
        return <Users className="w-4 h-4" />;
      case "direct":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  // Floating mode - closed state (just a button)
  if (displayMode === "floating" && !isOpen) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleModeChange("floating")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full"
        style={{
          backgroundColor: FRAMER_CHART_COLORS.primaryLine,
          boxShadow: `0 0 20px ${FRAMER_CHART_COLORS.primaryLine}40, 0 4px 12px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {totalUnread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold rounded-full px-1"
            style={{ backgroundColor: "#ef4444", color: "white" }}
          >
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </motion.button>
    );
  }

  // Floating mode - minimized state (header bar only)
  if (displayMode === "floating" && isMinimized) {
    return (
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x: position.x, y: position.y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50 w-64 rounded-lg overflow-hidden"
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(25, 125, 255, 0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 20px rgba(25, 125, 255, 0.1), 0 4px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="h-11 px-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5" style={{ color: FRAMER_TEXT_COLORS.muted }} />
              <Sparkles className="w-4 h-4" style={{ color: FRAMER_CHART_COLORS.primaryLine }} />
              <span className="text-sm font-medium" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                Chat
              </span>
              {totalUnread > 0 && (
                <span
                  className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium rounded-full"
                  style={{ backgroundColor: FRAMER_CHART_COLORS.primaryLine, color: "white" }}
                >
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="w-7 h-7 hover:bg-white/10"
                style={{ color: FRAMER_TEXT_COLORS.secondary }}
                title="Expand"
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="w-7 h-7 hover:bg-white/10"
                style={{ color: FRAMER_TEXT_COLORS.secondary }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Chat content (shared between all modes)
  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        onPointerDown={(e) => displayMode === "floating" && dragControls.start(e)}
        className={cn(
          "shrink-0 px-4 py-3 flex items-center justify-between",
          displayMode === "floating" && "cursor-grab active:cursor-grabbing"
        )}
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="flex items-center gap-2">
          {displayMode === "floating" && (
            <Move className="w-3.5 h-3.5 shrink-0" style={{ color: FRAMER_TEXT_COLORS.muted }} />
          )}
          {selectedConversationId ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversationId(null)}
                className="w-7 h-7 hover:bg-white/10"
                style={{ color: FRAMER_TEXT_COLORS.secondary }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: selectedConversation?.type === "ai"
                    ? `${FRAMER_CHART_COLORS.primaryLine}20`
                    : "rgba(255, 255, 255, 0.1)",
                }}
              >
                {selectedConversation && getConversationIcon(selectedConversation.type)}
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                  {selectedConversation?.title}
                </h3>
              </div>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" style={{ color: FRAMER_CHART_COLORS.primaryLine }} />
              <h3 className="text-sm font-semibold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                Messages
              </h3>
            </>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-0.5">
          {/* Dock/Undock button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDockMode}
            className="w-7 h-7 hover:bg-white/10"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
            title={displayMode === "sidebar" ? "Undock to floating" : "Dock to sidebar"}
          >
            {displayMode === "sidebar" ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </Button>
          
          {/* Minimize (floating only) */}
          {displayMode === "floating" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="w-7 h-7 hover:bg-white/10"
              style={{ color: FRAMER_TEXT_COLORS.secondary }}
              title="Minimize"
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
          
          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="w-7 h-7 hover:bg-white/10"
            style={{ color: FRAMER_TEXT_COLORS.secondary }}
            title="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedConversationId ? (
            // Messages View
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col"
            >
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.senderId === currentUserId ? "justify-end" : ""
                      )}
                    >
                      {message.senderId !== currentUserId && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: message.isAI
                              ? `${FRAMER_CHART_COLORS.primaryLine}20`
                              : "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          {message.isAI ? (
                            <Bot className="w-4 h-4" style={{ color: FRAMER_CHART_COLORS.primaryLine }} />
                          ) : message.senderAvatar ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <span style={{ color: FRAMER_TEXT_COLORS.secondary }}>
                              {message.senderName[0]}
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] px-4 py-3 rounded-2xl",
                          message.senderId === currentUserId ? "rounded-br-md" : "rounded-bl-md"
                        )}
                        style={{
                          backgroundColor: message.senderId === currentUserId
                            ? FRAMER_CHART_COLORS.primaryLine
                            : message.isAI
                              ? "rgba(25, 125, 255, 0.1)"
                              : "rgba(255, 255, 255, 0.08)",
                          border: message.isAI ? `1px solid ${FRAMER_CHART_COLORS.primaryLine}30` : "none",
                        }}
                      >
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: message.senderId === currentUserId ? "white" : FRAMER_TEXT_COLORS.primary,
                          }}
                        >
                          {message.content}
                        </p>
                        <span
                          className="text-[10px] mt-1 block text-right"
                          style={{
                            color: message.senderId === currentUserId
                              ? "rgba(255, 255, 255, 0.7)"
                              : FRAMER_TEXT_COLORS.muted,
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="shrink-0 p-4" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 h-10 rounded-xl border-0"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: FRAMER_TEXT_COLORS.primary,
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="h-10 w-10 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: messageInput.trim()
                        ? FRAMER_CHART_COLORS.primaryLine
                        : "rgba(255, 255, 255, 0.06)",
                      color: messageInput.trim() ? "white" : FRAMER_TEXT_COLORS.muted,
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Conversation List View
            <motion.div
              key="conversations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col"
            >
              {/* Search */}
              <div className="shrink-0 p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: FRAMER_TEXT_COLORS.muted }}
                  />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-0"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: FRAMER_TEXT_COLORS.primary,
                    }}
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <div className="px-2 pb-4 space-y-1">
                  {filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: conversation.type === "ai"
                            ? `${FRAMER_CHART_COLORS.primaryLine}20`
                            : "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {getConversationIcon(conversation.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                            {conversation.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {conversation.lastMessageTime && (
                              <span className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                            )}
                            {(conversation.unreadCount ?? 0) > 0 && (
                              <span
                                className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium rounded-full"
                                style={{ backgroundColor: FRAMER_CHART_COLORS.primaryLine, color: "white" }}
                              >
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs truncate mt-0.5" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // Sidebar mode - fixed right panel
  if (displayMode === "sidebar") {
    return (
      <motion.div
        initial={{ x: sidebarWidth, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: sidebarWidth, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("fixed top-0 right-0 z-50 h-full", className)}
        style={{ width: sidebarWidth }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            borderLeft: "1px solid rgba(25, 125, 255, 0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "-4px 0 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          {chatContent}
        </div>
      </motion.div>
    );
  }

  // Floating mode - draggable widget
  if (displayMode === "floating") {
    return (
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragListener={false}
        onDragEnd={handleDragEnd}
        style={{ x: position.x, y: position.y }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-lg overflow-hidden", className)}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(25, 125, 255, 0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(25, 125, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {chatContent}
        </div>
      </motion.div>
    );
  }

  // Inline mode - embedded in page
  return (
    <div
      className={cn("h-[500px] overflow-hidden", className)}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        border: "1px solid rgba(25, 125, 255, 0.15)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 20px rgba(25, 125, 255, 0.08)",
      }}
    >
      {chatContent}
    </div>
  );
}

export default FramerChat;
