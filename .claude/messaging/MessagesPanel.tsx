"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Edit,
  ChevronDown,
  Image as ImageIcon,
  Heart,
  Smile,
  Phone,
  Video,
  Info,
  ArrowLeft,
  X,
  Users,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

interface MessagesPanelProps {
  organizationId?: Id<"organizations">;
  userRole?: "admin" | "creator" | "client";
  username?: string;
}

interface AvailableUser {
  id: string;
  role: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  platform?: string;
  assignedAt: number;
}

// Role badge colors
const roleBadgeColors: Record<string, string> = {
  super_admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  admin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  client: "bg-green-500/20 text-green-400 border-green-500/30",
  creator: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

// Main Messages Panel Component
export function MessagesPanel({ organizationId, userRole = "admin", username = "sylcroad" }: MessagesPanelProps) {
  const { user } = useUser();
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"conversations"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [messageInput, setMessageInput] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convex queries
  const conversations = useQuery(
    api.messaging.getConversations,
    organizationId ? { organizationId } : "skip"
  );
  const availableUsers = useQuery(
    api.messaging.getAvailableUsers,
    organizationId ? { organizationId } : "skip"
  );
  const messages = useQuery(
    api.messaging.getMessages,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );
  const currentConversation = useQuery(
    api.messaging.getConversation,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );

  // Convex mutations
  const sendMessage = useMutation(api.messaging.sendMessage);
  const createConversation = useMutation(api.messaging.createConversation);
  const markAsRead = useMutation(api.messaging.markAsRead);

  const filteredConversations = conversations?.filter(
    (conv) => {
      const searchLower = searchQuery.toLowerCase();
      const displayTitle = (conv as any).displayTitle || conv.title || "";
      const displayUsername = (conv as any).displayUsername || "";
      return (
        displayTitle.toLowerCase().includes(searchLower) ||
        displayUsername.toLowerCase().includes(searchLower) ||
        conv.lastMessagePreview?.toLowerCase().includes(searchLower)
      );
    }
  ) || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark as read when selecting a conversation
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead({ conversationId: selectedConversationId });
    }
  }, [selectedConversationId, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    try {
      await sendMessage({
        conversationId: selectedConversationId,
        content: messageInput,
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleStartConversation = async (participantIds: string[], isGroup: boolean, title?: string) => {
    if (!organizationId) return;

    try {
      const conversationId = await createConversation({
        organizationId,
        participantIds,
        type: isGroup ? "group" : "direct",
        title: isGroup ? title : undefined,
      });
      setSelectedConversationId(conversationId);
      setShowNewMessageDialog(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Show a message if no organization is selected
  if (!organizationId) {
    return (
      <div className="flex h-full bg-black rounded-xl overflow-hidden border border-white/10 items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/70 text-base font-medium mb-1">No organization found</p>
          <p className="text-white/40 text-sm">Please ensure you have admin access to an organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-black rounded-xl overflow-hidden border border-white/10">
      {/* Messages Sidebar */}
      <div className="w-[380px] border-r border-white/10 flex flex-col bg-black">
        {/* Header with user profile */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.firstName?.[0] || user?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">
                {user?.firstName || user?.username || username}
              </span>
              <span className="text-xs text-white/50 capitalize">{userRole}</span>
            </div>
          </div>
          <button
            onClick={() => setShowNewMessageDialog(true)}
            className="p-2 hover:bg-white/5 rounded-full"
          >
            <Edit className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-0 text-white placeholder:text-white/40 rounded-lg h-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Messages / Requests Tabs */}
        <div className="px-4 mb-2 flex items-center gap-4">
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "text-base font-semibold transition-colors",
              activeTab === "messages" ? "text-white" : "text-white/50"
            )}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "text-base font-normal transition-colors",
              activeTab === "requests" ? "text-white" : "text-white/50"
            )}
          >
            Requests
          </button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="px-2">
            {conversations === undefined ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-white/50 text-sm text-center">No messages yet</p>
                <Button
                  onClick={() => setShowNewMessageDialog(true)}
                  variant="ghost"
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                // Use display fields from the API
                const displayName = (conversation as any).displayTitle || conversation.title || "Conversation";
                const displayAvatar = (conversation as any).displayAvatar;
                const displayUsername = (conversation as any).displayUsername;
                const displayRole = (conversation as any).displayRole;

                return (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversationId(conversation._id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors",
                      selectedConversationId === conversation._id
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        {displayAvatar && <AvatarImage src={displayAvatar} />}
                        <AvatarFallback className={cn(
                          "text-white",
                          displayRole === "creator" 
                            ? "bg-gradient-to-br from-pink-500 to-purple-600"
                            : displayRole === "client"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        )}>
                          {displayName[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Role indicator dot */}
                      {displayRole && (
                        <div className={cn(
                          "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black",
                          displayRole === "creator" ? "bg-pink-500" :
                          displayRole === "client" ? "bg-green-500" :
                          displayRole === "admin" ? "bg-blue-500" : "bg-gray-500"
                        )} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold truncate",
                          conversation.unreadCount > 0 ? "text-white" : "text-white/90"
                        )}>
                          {displayName}
                        </span>
                        {conversation.type === "group" && (
                          <Users className="w-3 h-3 text-white/50" />
                        )}
                      </div>
                      {displayUsername && (
                        <div className="text-xs text-white/50 truncate">
                          @{displayUsername}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={cn(
                          "text-sm truncate",
                          conversation.unreadCount > 0 ? "text-white/80" : "text-white/50"
                        )}>
                          {conversation.lastMessagePreview || "No messages yet"}
                        </span>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId && currentConversation ? (
          <ConversationView
            conversation={currentConversation}
            messages={messages || []}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversationId(null)}
            messagesEndRef={messagesEndRef}
            currentUserId={user?.id || ""}
          />
        ) : (
          <EmptyState onNewMessage={() => setShowNewMessageDialog(true)} />
        )}
      </div>

      {/* New Message Dialog */}
      <NewMessageDialog
        open={showNewMessageDialog}
        onClose={() => setShowNewMessageDialog(false)}
        availableUsers={availableUsers || []}
        onStartConversation={handleStartConversation}
      />
    </div>
  );
}

// Empty State Component
function EmptyState({ onNewMessage }: { onNewMessage: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black">
      <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-white mb-1">Your messages</h2>
      <p className="text-sm text-white/50 mb-4">Send a message to start a chat.</p>
      <Button
        onClick={onNewMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4"
      >
        Send message
      </Button>
    </div>
  );
}

// New Message Dialog Component
function NewMessageDialog({
  open,
  onClose,
  availableUsers,
  onStartConversation,
}: {
  open: boolean;
  onClose: () => void;
  availableUsers: AvailableUser[];
  onStartConversation: (participantIds: string[], isGroup: boolean, title?: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isGroup = selectedUsers.length > 1;

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;
    // Require group name for group chats
    if (isGroup && !groupName.trim()) return;

    setIsCreating(true);
    try {
      await onStartConversation(selectedUsers, isGroup, isGroup ? groupName.trim() : undefined);
      setSelectedUsers([]);
      setGroupName("");
      setSearchQuery("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setGroupName("");
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">New message</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white/70 font-medium">To:</span>
            <div className="flex-1 flex flex-wrap gap-2">
              {selectedUsers.map((userId) => {
                const user = availableUsers.find((u) => u.id === userId);
                return (
                  <span
                    key={userId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {user?.name || "User"}
                    <button onClick={() => handleToggleUser(userId)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[100px] bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-0"
              />
            </div>
          </div>

          {/* Group name (if multiple selected) */}
          {isGroup && (
            <div className="mb-4">
              <Input
                placeholder="Group name (required)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          )}
        </div>

        {/* User List */}
        <ScrollArea className="h-[300px] -mx-6 px-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              {availableUsers.length === 0
                ? "No users available"
                : "No users found"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleToggleUser(user.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Avatar className="w-11 h-11">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                    <AvatarFallback className={cn(
                      "text-white",
                      user.role === "creator"
                        ? "bg-gradient-to-br from-pink-500 to-purple-600"
                        : user.role === "client"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    )}>
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{user.name}</p>
                    {user.username && (
                      <p className="text-xs text-white/50">@{user.username}</p>
                    )}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      roleBadgeColors[user.role] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    )}>
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Create Button */}
        <div className="mt-4">
          <Button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0 || isCreating || (isGroup && !groupName.trim())}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              `Chat${selectedUsers.length > 0 ? ` with ${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""}` : ""}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Conversation View Component
function ConversationView({
  conversation,
  messages,
  messageInput,
  setMessageInput,
  onSendMessage,
  onBack,
  messagesEndRef,
  currentUserId,
}: {
  conversation: {
    _id: string;
    title?: string;
    type: string;
    otherParticipants: string[];
    displayTitle?: string;
    displayAvatar?: string;
    displayUsername?: string;
    displayRole?: string;
  };
  messages: { _id: string; senderId: string; content: string; createdAt: number; isMe: boolean }[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentUserId: string;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Use display fields
  const displayName = conversation.displayTitle || conversation.title || "Conversation";
  const displayAvatar = conversation.displayAvatar;
  const displayUsername = conversation.displayUsername;
  const displayRole = conversation.displayRole;

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Header */}
      <div className="h-[75px] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="relative">
            <Avatar className="w-11 h-11">
              {displayAvatar && <AvatarImage src={displayAvatar} />}
              <AvatarFallback className={cn(
                "text-white",
                displayRole === "creator" 
                  ? "bg-gradient-to-br from-pink-500 to-purple-600"
                  : displayRole === "client"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              )}>
                {displayName[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Role indicator */}
            {displayRole && conversation.type === "direct" && (
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black",
                displayRole === "creator" ? "bg-pink-500" :
                displayRole === "client" ? "bg-green-500" :
                displayRole === "admin" ? "bg-blue-500" : "bg-gray-500"
              )} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {displayName}
              </span>
              {conversation.type === "group" && (
                <Users className="w-4 h-4 text-white/50" />
              )}
            </div>
            <span className="text-xs text-white/50">
              {displayUsername ? `@${displayUsername}` : `${conversation.otherParticipants.length} participant${conversation.otherParticipants.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full">
            <Phone className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full">
            <Video className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full">
            <Info className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-white/50 text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  "flex",
                  message.isMe ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex flex-col max-w-[70%]">
                  <div
                    className={cn(
                      "px-4 py-2 rounded-3xl",
                      message.isMe
                        ? "bg-blue-500 text-white"
                        : "bg-[#262626] text-white"
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] text-white/40 mt-1",
                    message.isMe ? "text-right" : "text-left"
                  )}>
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 bg-[#262626] rounded-full px-4 py-2">
          <button className="p-1 hover:bg-white/10 rounded-full">
            <Smile className="w-6 h-6 text-white" />
          </button>
          <Input
            placeholder="Message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
          {messageInput.trim() ? (
            <button
              onClick={onSendMessage}
              className="text-blue-500 font-semibold hover:text-blue-400"
            >
              Send
            </button>
          ) : (
            <>
              <button className="p-1 hover:bg-white/10 rounded-full">
                <ImageIcon className="w-6 h-6 text-white" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPanel;



