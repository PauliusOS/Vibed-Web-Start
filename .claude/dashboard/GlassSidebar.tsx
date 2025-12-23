"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { GlassIconButton } from "./GlassButton";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface GlassSidebarProps {
  sections: NavSection[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

const GlassSidebar = ({
  sections,
  logo,
  footer,
  collapsed = false,
  onCollapsedChange,
  className,
}: GlassSidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string, children?: NavItem[]) => {
    if (href && pathname === href) return true;
    if (children) {
      return children.some((child) => child.href === pathname);
    }
    return false;
  };

  const NavItemComponent = ({
    item,
    depth = 0,
  }: {
    item: NavItem;
    depth?: number;
  }) => {
    const active = isActive(item.href, item.children);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);

    const content = (
      <motion.div
        className={cn(
          "glass-nav-item",
          active && "active",
          depth > 0 && "ml-6",
          collapsed && depth === 0 && "justify-center px-2"
        )}
        whileHover={{ x: collapsed ? 0 : 2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Active indicator */}
        {active && !collapsed && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-blue-600"
            layoutId="activeIndicator"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* Icon */}
        <span
          className={cn(
            "flex-shrink-0 transition-colors duration-200",
            active ? "text-white" : "text-white/50 group-hover:text-white/70",
            "[&>svg]:h-5 [&>svg]:w-5"
          )}
        >
          {item.icon}
        </span>

        {/* Label */}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>

            {/* Badge */}
            {item.badge && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {item.badge}
              </span>
            )}

            {/* Expand arrow for items with children */}
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-white/40 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </motion.div>
    );

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => toggleExpanded(item.label)}
            className="w-full group"
          >
            {content}
          </button>
          <AnimatePresence>
            {isExpanded && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {item.children!.map((child) => (
                  <NavItemComponent key={child.label} item={child} depth={1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (item.href) {
      return (
        <Link href={item.href} className="block group">
          {content}
        </Link>
      );
    }

    return <div className="group">{content}</div>;
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      {logo && (
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-white/[0.06]",
            collapsed && "justify-center"
          )}
        >
          {logo}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={cn(sectionIndex > 0 && "mt-6")}>
            {/* Section title */}
            {section.title && !collapsed && (
              <div className="px-3 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">
                  {section.title}
                </span>
              </div>
            )}

            {/* Section items */}
            <nav className="space-y-1">
              {section.items.map((item) => (
                <NavItemComponent key={item.label} item={item} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-white/[0.06] p-4">{footer}</div>
      )}

      {/* Collapse toggle */}
      {onCollapsedChange && (
        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 hidden lg:block">
          <GlassIconButton
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className="shadow-lg"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </GlassIconButton>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <GlassIconButton onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </GlassIconButton>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.aside
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 glass-sidebar flex flex-col lg:hidden",
                className
              )}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <div className="absolute top-4 right-4">
                <GlassIconButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-4 w-4" />
                </GlassIconButton>
              </div>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        className={cn(
          "hidden lg:flex flex-col glass-sidebar relative",
          collapsed ? "w-[72px]" : "w-64",
          className
        )}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
};

export { GlassSidebar };
export type { NavItem, NavSection, GlassSidebarProps };
