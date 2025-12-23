"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Mail,
  Settings,
  Plus,
  Archive,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { ChatPanel } from "../chat/ChatPanel";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin3",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Campaigns",
    href: "/admin3/list",
    icon: <FolderKanban className="w-5 h-5" />,
    subItems: [
      { label: "New Campaign", href: "/admin3/new" },
      { label: "Archived", href: "/admin3/archived" },
    ],
  },
  {
    label: "Analytics",
    href: "/admin3/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Invitations",
    href: "/admin3/invitations",
    icon: <Mail className="w-5 h-5" />,
  },
];

export function Admin3Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedOrganizationId } = useOrganization();

  const isActive = (href: string) => {
    if (href === "/admin3") {
      return pathname === "/admin3";
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      className={cn(
        "fixed right-0 top-0 h-screen z-50",
        "bg-[#0a0a0a] border-l border-white/[0.06]",
        "hidden md:flex flex-col",
        "transition-all duration-200 ease-out"
      )}
      initial={false}
      animate={{
        width: isExpanded ? 240 : 64,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedItem(null);
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Link href="/admin3" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-[15px] font-semibold text-white whitespace-nowrap overflow-hidden"
              >
                Sylcroad
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isItemExpanded = expandedItem === item.label;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-all duration-150",
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
                onMouseEnter={() => hasSubItems && setExpandedItem(item.label)}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-l"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}

                <span className="shrink-0">{item.icon}</span>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {hasSubItems && isExpanded && (
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isItemExpanded && "rotate-90"
                    )}
                  />
                )}
              </Link>

              {/* Sub items */}
              <AnimatePresence>
                {hasSubItems && isExpanded && isItemExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                  >
                    {item.subItems!.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-[12px]",
                          pathname === subItem.href
                            ? "text-white bg-white/[0.06]"
                            : "text-white/40 hover:text-white/70"
                        )}
                      >
                        {subItem.label === "New Campaign" ? (
                          <Plus className="w-3.5 h-3.5" />
                        ) : (
                          <Archive className="w-3.5 h-3.5" />
                        )}
                        {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-white/[0.06]">
        {/* Chat */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-white/50 hover:text-white hover:bg-white/[0.04]",
            "transition-all duration-150"
          )}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] font-medium whitespace-nowrap"
              >
                Chat
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Settings */}
        <Link
          href="/admin3/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-white/50 hover:text-white hover:bg-white/[0.04]",
            "transition-all duration-150"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] font-medium whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full",
              },
            }}
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] text-white/50 whitespace-nowrap"
              >
                Account
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Panel */}
      {selectedOrganizationId && (
        <ChatPanel
          organizationId={selectedOrganizationId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </motion.aside>
  );
}

// Mobile bottom navigation
export function Admin3MobileNav() {
  const pathname = usePathname();

  const mobileItems = [
    { label: "Home", href: "/admin3", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Campaigns", href: "/admin3/list", icon: <FolderKanban className="w-5 h-5" /> },
    { label: "Analytics", href: "/admin3/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "More", href: "/admin3/invitations", icon: <Mail className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/admin3") return pathname === "/admin3";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/[0.08]">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg",
                  "transition-colors duration-150",
                  active ? "text-blue-400" : "text-white/40"
                )}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
