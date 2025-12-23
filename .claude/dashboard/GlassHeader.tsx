"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { GlassIconButton } from "./GlassButton";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showSearch?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  userMenu?: React.ReactNode;
  className?: string;
}

const GlassHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showSearch = true,
  showNotifications = true,
  notificationCount = 0,
  onSearchClick,
  onNotificationClick,
  userMenu,
  className,
}: GlassHeaderProps) => {
  const { scrollY } = useScroll();

  // Transform values based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.95)"]
  );

  const borderOpacity = useTransform(scrollY, [0, 50], [0.06, 0.1]);

  const blur = useTransform(scrollY, [0, 50], [24, 32]);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        className
      )}
      style={{
        backgroundColor,
        borderColor: useTransform(
          borderOpacity,
          (v) => `rgba(255, 255, 255, ${v})`
        ),
        backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        WebkitBackdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-1 text-sm mb-1">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-white/30 flex-shrink-0" />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/50 hover:text-white/80 transition-colors truncate"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-white/70 truncate">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title and subtitle */}
          {(title || subtitle) && (
            <div className="flex items-baseline gap-3">
              {title && (
                <h1 className="text-lg font-semibold text-white truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <span className="text-sm text-white/50 hidden sm:inline">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4">
          {/* Custom actions */}
          {actions}

          {/* Search button */}
          {showSearch && (
            <GlassIconButton
              variant="ghost"
              size="md"
              onClick={onSearchClick}
              tooltip="Search (⌘K)"
            >
              <Search className="h-5 w-5" />
            </GlassIconButton>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div className="relative">
              <GlassIconButton
                variant="ghost"
                size="md"
                onClick={onNotificationClick}
                tooltip="Notifications"
              >
                <Bell className="h-5 w-5" />
              </GlassIconButton>

              {/* Notification badge */}
              {notificationCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-medium text-white bg-blue-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </motion.span>
              )}
            </div>
          )}

          {/* User menu */}
          {userMenu && (
            <div className="ml-1 border-l border-white/[0.06] pl-3">
              {userMenu}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// Page header component for page titles
interface GlassPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const GlassPageHeader = ({
  title,
  subtitle,
  actions,
  className,
}: GlassPageHeaderProps) => {
  return (
    <motion.div
      className={cn("flex items-start justify-between mb-8", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-white/50 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 ml-4">{actions}</div>}
    </motion.div>
  );
};

export { GlassHeader, GlassPageHeader };
export type { GlassHeaderProps, BreadcrumbItem, GlassPageHeaderProps };
