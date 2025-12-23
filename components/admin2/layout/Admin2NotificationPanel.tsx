"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Check,
  CheckCheck,
  DollarSign,
  Video,
  MessageSquare,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";

export function Admin2NotificationPanel() {
  const { selectedOrganizationId } = useOrganization();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  // Real-time subscription to unread notifications
  const unreadNotifications = useQuery(
    api.notifications.getUnreadNotifications,
    selectedOrganizationId
      ? { organizationId: selectedOrganizationId }
      : "skip"
  );

  // Real-time subscription to all notifications (for the panel)
  const allNotifications = useQuery(
    api.notifications.getNotifications,
    selectedOrganizationId && open
      ? {
          organizationId: selectedOrganizationId,
          limit: 20,
        }
      : "skip"
  );

  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const unreadCount = unreadNotifications?.length || 0;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationId: notificationId as any });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!selectedOrganizationId) return;
    try {
      await markAllAsRead({ organizationId: selectedOrganizationId });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification({ notificationId: notificationId as any });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case "approval":
      case "video":
        return <Video className="w-4 h-4 text-blue-400" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-white/60" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-white/60 hover:text-white hover:bg-white/[0.05]"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-[#0a0a0a] border-white/[0.06]"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <p className="text-xs text-white/60 mt-0.5">
              {unreadCount === 0
                ? "You're all caught up"
                : `${unreadCount} unread`}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {!allNotifications || allNotifications.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm text-white/60 text-center">
                No notifications yet
              </p>
              <p className="text-xs text-white/40 text-center mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              <AnimatePresence mode="popLayout">
                {allNotifications.notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.02 }}
                    className={`group relative p-4 transition-colors ${
                      !notification.isRead
                        ? "bg-blue-500/5 hover:bg-blue-500/10"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          notification.type === "payment"
                            ? "bg-green-500/20"
                            : notification.type === "approval" ||
                              notification.type === "video"
                            ? "bg-blue-500/20"
                            : notification.type === "message"
                            ? "bg-purple-500/20"
                            : "bg-amber-500/20"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-white/40">
                            {formatDistanceToNow(notification.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              View →
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions (visible on hover) */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleMarkAsRead(notification._id)
                            }
                            className="h-7 w-7 p-0 hover:bg-white/[0.1]"
                          >
                            <Check className="w-3 h-3 text-white/60" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification._id)}
                          className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {allNotifications && allNotifications.notifications.length > 0 && (
          <div className="p-3 border-t border-white/[0.06]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              onClick={() => {
                setOpen(false);
                window.location.href = "/admin2/notifications";
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
