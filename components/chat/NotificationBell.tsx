"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/contexts/ChatContext";
import {
  Bell,
  MessageCircle,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Clock,
  Check,
  X,
} from "lucide-react";

interface NotificationBellProps {
  organizationId: Id<"organizations">;
}

interface Notification {
  _id: Id<"notifications">;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

export function NotificationBell({ organizationId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { openChat } = useChat();

  const unreadCount = useQuery(api.notifications.getUnreadCount, {
    organizationId,
  });

  const notifications = useQuery(api.notifications.getNotifications, {
    organizationId,
    limit: 20,
  });

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleNotificationClick = async (notification: {
    _id: Id<"notifications">;
    type: string;
    isRead: boolean;
    metadata?: { conversationId?: Id<"conversations"> };
  }) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }

    // Handle navigation based on type
    if (notification.type === "message" && notification.metadata?.conversationId) {
      openChat(notification.metadata.conversationId as Id<"conversations">);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({ organizationId });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-4 h-4 text-cyan-400" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-400" />;
      case "approval":
      case "video_approved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "video_submitted":
        return <Video className="w-4 h-4 text-blue-400" />;
      case "revision_requested":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "brief_assigned":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "deadline_reminder":
        return <Clock className="w-4 h-4 text-orange-400" />;
      default:
        return <Bell className="w-4 h-4 text-white/50" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-white/60 hover:text-white hover:bg-white/[0.08]"
        >
          <Bell className="w-4 h-4" />
          {unreadCount && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-[#0a0a0a] border-white/[0.08]"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[320px]">
          <div className="p-2">
            {notifications === undefined ? (
              // Loading state
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <Skeleton className="w-8 h-8 rounded-full bg-white/[0.04]" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
                    <Skeleton className="h-3 w-1/2 bg-white/[0.04]" />
                  </div>
                </div>
              ))
            ) : notifications.notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-sm text-white/50">No notifications</p>
                <p className="text-xs text-white/30 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "w-full flex gap-3 p-2.5 rounded-lg text-left transition-colors",
                    notification.isRead
                      ? "hover:bg-white/[0.04]"
                      : "bg-cyan-500/5 hover:bg-cyan-500/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      notification.isRead ? "bg-white/[0.06]" : "bg-cyan-500/10"
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm line-clamp-1",
                          notification.isRead ? "text-white/70" : "text-white font-medium"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {notifications && notifications.notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-white/[0.08]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs text-white/50 hover:text-white hover:bg-white/[0.04]"
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
