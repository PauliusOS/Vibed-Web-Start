"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Bell,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  maxHeight?: number;
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    iconClass: "text-green-400",
    bgClass: "bg-green-500/10",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-400",
    bgClass: "bg-red-500/10",
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
  },
};

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative p-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors ${
        !notification.isRead ? "bg-white/[0.02]" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bgClass} flex items-center justify-center`}
        >
          <Icon className={`w-4 h-4 ${config.iconClass}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-white">{notification.title}</h4>
            {!notification.isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400" />
            )}
          </div>

          {notification.message && (
            <p className="text-sm text-white/60 mb-2 line-clamp-2">
              {notification.message}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/40">{notification.timestamp}</span>

            {notification.actionUrl && (
              <Link href={notification.actionUrl}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
                >
                  {notification.actionLabel || "View"}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 rounded hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1 rounded hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  maxHeight = 400,
  className = "",
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white/80" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-7 text-xs text-white/60 hover:text-white"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea style={{ maxHeight }}>
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-white/20" />
            <p className="text-white/60 text-sm">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDismiss={onDismiss}
              />
            ))}
          </AnimatePresence>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
          <Link href="/admin2/notifications">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-white/60 hover:text-white"
            >
              View all notifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Dropdown variant for use in header
export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: Omit<NotificationPanelProps, "className">) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
      >
        <Bell className="w-5 h-5 text-white/80" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-96 z-50"
            >
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onDismiss={onDismiss}
                maxHeight={500}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
