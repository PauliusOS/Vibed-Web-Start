"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { GlassSidebar, NavSection } from "./GlassSidebar";
import { GlassHeader, BreadcrumbItem } from "./GlassHeader";
import { pageVariants, containerVariants } from "./animations";

interface DashboardShellProps {
  children: React.ReactNode;
  // Sidebar props
  sidebarSections: NavSection[];
  sidebarLogo?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  sidebarCollapsible?: boolean;
  // Header props
  headerTitle?: string;
  headerSubtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  showSearch?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  userMenu?: React.ReactNode;
  // Layout props
  className?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  noPadding?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-[1400px]",
  full: "max-w-full",
};

const DashboardShell = ({
  children,
  sidebarSections,
  sidebarLogo,
  sidebarFooter,
  sidebarCollapsible = true,
  headerTitle,
  headerSubtitle,
  breadcrumbs,
  headerActions,
  showSearch = true,
  showNotifications = true,
  notificationCount = 0,
  onSearchClick,
  onNotificationClick,
  userMenu,
  className,
  contentClassName,
  maxWidth = "2xl",
  noPadding = false,
}: DashboardShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className={cn("flex min-h-screen bg-black", className)}>
      {/* Sidebar */}
      <GlassSidebar
        sections={sidebarSections}
        logo={sidebarLogo}
        footer={sidebarFooter}
        collapsed={sidebarCollapsed}
        onCollapsedChange={sidebarCollapsible ? setSidebarCollapsed : undefined}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <GlassHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          breadcrumbs={breadcrumbs}
          actions={headerActions}
          showSearch={showSearch}
          showNotifications={showNotifications}
          notificationCount={notificationCount}
          onSearchClick={onSearchClick}
          onNotificationClick={onNotificationClick}
          userMenu={userMenu}
        />

        {/* Page content */}
        <main
          className={cn(
            "flex-1",
            !noPadding && "p-4 sm:p-6 lg:p-8",
            contentClassName
          )}
        >
          <motion.div
            className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Section wrapper with animation
interface DashboardSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  delay?: number;
}

const DashboardSection = ({
  children,
  title,
  subtitle,
  actions,
  className,
  delay = 0,
}: DashboardSectionProps) => {
  return (
    <motion.section
      className={cn("mb-8", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.section>
  );
};

// Grid wrapper with staggered animation
interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const DashboardGrid = ({
  children,
  columns = 4,
  className,
}: DashboardGridProps) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={cn("grid gap-4 sm:gap-6", gridClasses[columns], className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

// Empty state component
interface DashboardEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const DashboardEmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: DashboardEmptyStateProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        "glass-dashboard-card",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-4">
          <div className="text-white/40 [&>svg]:h-8 [&>svg]:w-8">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/50 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </motion.div>
  );
};

// Loading skeleton for dashboard
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 glass-skeleton rounded-lg" />
          <div className="h-4 w-32 glass-skeleton rounded mt-2" />
        </div>
        <div className="h-10 w-32 glass-skeleton rounded-lg" />
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-metric-card">
            <div className="h-4 w-24 glass-skeleton rounded" />
            <div className="h-8 w-32 glass-skeleton rounded mt-2" />
            <div className="h-3 w-16 glass-skeleton rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="glass-dashboard-card p-6">
        <div className="h-5 w-32 glass-skeleton rounded mb-4" />
        <div className="h-64 w-full glass-skeleton rounded" />
      </div>

      {/* Table skeleton */}
      <div className="glass-dashboard-card p-6">
        <div className="h-5 w-32 glass-skeleton rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 glass-skeleton rounded" />
              <div className="flex-1">
                <div className="h-4 w-3/4 glass-skeleton rounded" />
                <div className="h-3 w-1/2 glass-skeleton rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export {
  DashboardShell,
  DashboardSection,
  DashboardGrid,
  DashboardEmptyState,
  DashboardSkeleton,
};
export type { DashboardShellProps, DashboardSectionProps, DashboardGridProps };
