"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  UserCircle,
  Settings,
  Plus,
  Search,
  Command,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { ChatPanel } from "@/components/admin3/chat/ChatPanel";
import { NotificationBell } from "@/components/chat/NotificationBell";

const navItems = [
  { label: "Overview", href: "/admin69", icon: LayoutDashboard },
  { label: "Campaigns", href: "/admin69/campaigns", icon: FolderKanban },
  { label: "Creators", href: "/admin69/creators", icon: Users },
  { label: "Clients", href: "/admin69/clients", icon: UserCircle },
  { label: "Analytics", href: "/admin69/analytics", icon: BarChart3 },
];

export function Admin69Navbar() {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedOrganizationId } = useOrganization();

  const isActive = (href: string) => {
    if (href === "/admin69") return pathname === "/admin69";
    return pathname.startsWith(href);
  };

  // Get current page title for breadcrumb
  const getCurrentPage = () => {
    if (pathname === "/admin69") return null;
    const item = navItems.find(item => pathname.startsWith(item.href) && item.href !== "/admin69");
    return item?.label || null;
  };

  const currentPage = getCurrentPage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-[10px]">
      {/* Main navbar */}
      <div className="border-b border-white/[0.08]">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 gap-4">
          {/* Logo + Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link href="/admin69" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              </div>
            </Link>

            {currentPage && (
              <>
                <span className="text-white/20">/</span>
                <span className="text-sm text-white/50 font-medium">{currentPage}</span>
              </>
            )}
          </div>

          {/* Search - Center */}
          <div className="flex-1 flex justify-center max-w-xl mx-auto">
            <button
              onClick={() => setSearchFocused(true)}
              className={cn(
                "flex items-center gap-2.5 w-full max-w-sm px-3.5 py-2 rounded-lg transition-all",
                "bg-white/[0.04] border border-white/[0.08]",
                "text-white/40 text-sm",
                "hover:bg-white/[0.06] hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search campaigns...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/30">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* New Campaign */}
            <Link
              href="/admin69/campaigns/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </Link>

            {/* Notifications */}
            {selectedOrganizationId && (
              <NotificationBell organizationId={selectedOrganizationId} />
            )}

            {/* Chat */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2 rounded-lg transition-all text-white/50 hover:text-cyan-400 hover:bg-white/[0.04]"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Settings */}
            <Link
              href="/admin69/settings"
              className={cn(
                "p-2 rounded-lg transition-all",
                pathname.startsWith("/admin69/settings")
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* User */}
            <div className="ml-1">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-lg ring-1 ring-white/10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-white/[0.08]">
        <div className="flex items-center gap-0.5 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                )}
              </Link>
            );
          })}
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
    </header>
  );
}

// Mobile bottom navigation
export function Admin69MobileNav() {
  const pathname = usePathname();

  const mobileItems = [
    { label: "Home", href: "/admin69", icon: LayoutDashboard },
    { label: "Campaigns", href: "/admin69/campaigns", icon: FolderKanban },
    { label: "New", href: "/admin69/campaigns/new", icon: Plus, special: true },
    { label: "Analytics", href: "/admin69/analytics", icon: BarChart3 },
    { label: "Creators", href: "/admin69/creators", icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/admin69") return pathname === "/admin69";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/70 backdrop-blur-[10px] border-t border-white/[0.08]">
        <div className="flex items-center justify-around h-16 px-1">
          {mobileItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            if (item.special) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] -mt-4"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all",
                  active ? "text-cyan-400" : "text-white/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
