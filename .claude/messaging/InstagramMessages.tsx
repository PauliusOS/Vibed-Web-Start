"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Edit,
  ChevronDown,
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react";

// Sample data for notes (stories-style)
const sampleNotes = [
  { id: "1", username: "Your note", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", note: "Note...", isCurrentUser: true },
  { id: "2", username: "zilla", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", note: "🦍 zilla 🦍", hasNote: true },
  { id: "3", username: "AA2X", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", note: "lll 5 us (fe...", hasNote: true },
];

// Sample conversations
const sampleConversations = [
  {
    id: "1",
    name: "| Bryce Wagner |",
    username: "brycewagner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "Reacted 🤔 to your message",
    time: "6h",
    isVerified: true,
    unread: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Laurin Sausgruber and Sascha",
    username: "laurin_sascha",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "Sascha sent a photo.",
    time: "8h",
    isGroup: true,
    unread: false,
  },
  {
    id: "3",
    name: "Laurin Sausgruber",
    username: "laurin.s",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "You sent an attachment.",
    time: "13h",
    unread: false,
  },
  {
    id: "4",
    name: "marawan",
    username: "marawan_",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "Reacted 👍 to your message",
    time: "1w",
    unread: false,
  },
  {
    id: "5",
    name: "Oskar Hansen",
    username: "oskar.hansen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: "You sent an attachment.",
    time: "2w",
    unread: false,
  },
  {
    id: "6",
    name: "Markus Trainer",
    username: "markus.trainer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    lastMessage: "You sent an attachment.",
    time: "2w",
    unread: false,
  },
  {
    id: "7",
    name: "Leonie",
    username: "leonie_",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    lastMessage: "Audio call ended",
    time: "3w",
    unread: false,
  },
  {
    id: "8",
    name: "Sascha",
    username: "sascha_m",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    lastMessage: "You: Hey! How's it going?",
    time: "3w",
    unread: false,
  },
];

// Sample messages for a conversation
const sampleMessages = [
  { id: "1", senderId: "other", content: "Hey! I saw your latest post 🔥", time: "2:30 PM", status: "read" },
  { id: "2", senderId: "me", content: "Thanks! Really appreciate it 🙏", time: "2:32 PM", status: "read" },
  { id: "3", senderId: "other", content: "Are you available for a collab next week?", time: "2:33 PM", status: "read" },
  { id: "4", senderId: "me", content: "Yeah definitely! Let me check my calendar", time: "2:35 PM", status: "read" },
  { id: "5", senderId: "other", content: "Perfect! I'll send over the details", time: "2:36 PM", status: "read" },
  { id: "6", senderId: "me", content: "Sounds good 👍", time: "2:38 PM", status: "delivered" },
];

interface Message {
  id: string;
  senderId: string;
  content: string;
  time: string;
  status: string;
}

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isVerified?: boolean;
  unread?: boolean;
  isOnline?: boolean;
  isGroup?: boolean;
}

// Main Messages Component
export function InstagramMessages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = sampleConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: String(messages.length + 1),
      senderId: "me",
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Icon Sidebar (Instagram-style) */}
      <IconSidebar />

      {/* Messages Sidebar */}
      <div className="w-[400px] border-r border-white/10 flex flex-col bg-black">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button className="flex items-center gap-1 hover:opacity-80">
            <span className="text-xl font-semibold text-white">sylcroad</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full">
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

        {/* Notes Section */}
        <div className="px-4 mb-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {sampleNotes.map((note) => (
              <button key={note.id} className="flex flex-col items-center gap-1 min-w-[68px]">
                <div className="relative">
                  <div className={cn(
                    "p-[2px] rounded-full",
                    note.hasNote && !note.isCurrentUser
                      ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                      : "bg-transparent"
                  )}>
                    <Avatar className="w-14 h-14 border-2 border-black">
                      <AvatarImage src={note.avatar} className="object-cover" />
                      <AvatarFallback className="bg-white/10 text-white text-sm">
                        {note.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {note.isCurrentUser && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#262626] text-white text-[10px] px-1.5 py-0.5 rounded">
                      {note.note}
                    </div>
                  )}
                  {note.hasNote && !note.isCurrentUser && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#262626] text-white text-[10px] px-1.5 py-0.5 rounded max-w-[60px] truncate">
                      {note.note}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-white/60 truncate max-w-[60px]">
                  {note.username}
                </span>
              </button>
            ))}
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
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors",
                  selectedConversation?.id === conversation.id
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                )}
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={conversation.avatar} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {conversation.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "font-semibold truncate",
                      conversation.unread ? "text-white" : "text-white/90"
                    )}>
                      {conversation.name}
                    </span>
                    {conversation.isVerified && (
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-sm truncate",
                      conversation.unread ? "text-white/80" : "text-white/50"
                    )}>
                      {conversation.lastMessage}
                    </span>
                    <span className="text-sm text-white/40 flex-shrink-0">· {conversation.time}</span>
                  </div>
                </div>

                {/* Unread Indicator */}
                {conversation.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ConversationView
            conversation={selectedConversation}
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// Icon Sidebar Component
function IconSidebar() {
  const navItems = [
    { icon: "instagram", label: "Instagram", active: false },
    { icon: "home", label: "Home", active: false },
    { icon: "search", label: "Search", active: false },
    { icon: "explore", label: "Explore", active: false },
    { icon: "reels", label: "Reels", active: false },
    { icon: "messages", label: "Messages", active: true, badge: 1 },
    { icon: "notifications", label: "Notifications", active: false },
    { icon: "create", label: "Create", active: false },
  ];

  return (
    <div className="w-[72px] border-r border-white/10 flex flex-col items-center py-6 bg-black">
      {/* Logo */}
      <div className="mb-8">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-4">
        {/* Home */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </button>

        {/* Search */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <Search className="w-7 h-7" />
        </button>

        {/* Explore */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" />
          </svg>
        </button>

        {/* Reels */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="10" y1="4" x2="8" y2="10" />
            <line x1="18" y1="4" x2="16" y2="10" />
            <polygon points="10,14 16,17 10,20" fill="currentColor" />
          </svg>
        </button>

        {/* Messages (Active) */}
        <button className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
            1
          </div>
        </button>

        {/* Notifications */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <Heart className="w-7 h-7" />
        </button>

        {/* Create */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </nav>

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-4 pt-4">
        {/* Menu */}
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-colors">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Profile */}
        <Avatar className="w-7 h-7 ring-2 ring-transparent hover:ring-white/50 cursor-pointer transition-all">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black">
      <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-white mb-1">Your messages</h2>
      <p className="text-sm text-white/50 mb-4">Send a message to start a chat.</p>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4">
        Send message
      </Button>
    </div>
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
}: {
  conversation: Conversation;
  messages: Message[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Header */}
      <div className="h-[75px] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <Avatar className="w-11 h-11">
            <AvatarImage src={conversation.avatar} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {conversation.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white">{conversation.name}</span>
              {conversation.isVerified && (
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>
            <span className="text-xs text-white/50">
              {conversation.isOnline ? "Active now" : `Active ${conversation.time} ago`}
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
          {/* Conversation intro */}
          <div className="flex flex-col items-center py-8">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={conversation.avatar} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                {conversation.name[0]}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold text-white">{conversation.name}</h3>
            <p className="text-sm text-white/50">@{conversation.username}</p>
            <p className="text-sm text-white/50 mt-1">Instagram</p>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.senderId === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] px-4 py-2 rounded-3xl",
                  message.senderId === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-[#262626] text-white"
                )}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
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

export default InstagramMessages;




