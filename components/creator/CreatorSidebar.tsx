"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Video,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Briefcase,
  Wallet,
  Compass,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useClerk } from "@clerk/nextjs";

// Sidebar navigation items
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/creator" },
  { icon: Compass, label: "Discover", href: "/creator/discover" },
  { icon: Briefcase, label: "Campaigns", href: "/creator/campaigns" },
  { icon: Video, label: "Videos", href: "/creator/videos" },
  { icon: BarChart3, label: "Analytics", href: "/creator/analytics" },
  { icon: Wallet, label: "Wallet", href: "/creator/wallet" },
  { icon: MessageCircle, label: "Messages", href: "/creator/messages", hasNotification: true },
  { icon: Bell, label: "Notifications", href: "/creator/notifications" },
];

export function CreatorSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (href: string) => {
    if (href === "/creator") {
      return pathname === "/creator";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-black border-r border-white/10 flex-col py-6 px-3 z-50">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/creator">
          <h1
            className="text-[22px] font-bold tracking-tight text-white"
            style={{
              fontFamily: "'Euclid Circular A', system-ui, sans-serif",
            }}
          >
            SylcRoad
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {/* Profile - at the top */}
        <Link
          href="/creator"
          className={cn(
            "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
            isActive("/creator") && pathname === "/creator"
              ? "bg-blue-500/10"
              : "hover:bg-white/5"
          )}
        >
          <Avatar className="w-5 h-5 ring-1 ring-white/20">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px]">
              {user?.firstName?.[0] || user?.username?.[0] || "C"}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "text-sm transition-all",
              isActive("/creator") && pathname === "/creator"
                ? "text-white font-medium"
                : "text-white/70 font-normal group-hover:text-white/90"
            )}
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Profile
          </span>
        </Link>

        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
              isActive(item.href)
                ? "bg-blue-500/10"
                : "hover:bg-white/5"
            )}
          >
            <div className="relative">
              <item.icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive(item.href)
                    ? "text-blue-400 stroke-[2]"
                    : "text-white/70 stroke-[1.5] group-hover:text-white/90 group-hover:scale-105"
                )}
              />
              {item.hasNotification && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <span
              className={cn(
                "text-sm transition-all",
                isActive(item.href)
                  ? "text-white font-medium"
                  : "text-white/70 font-normal group-hover:text-white/90"
              )}
              style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 mt-auto pt-4 border-t border-white/5">
        <Link
          href="/creator/settings"
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/5 group"
        >
          <Settings className="w-5 h-5 text-white/50 stroke-[1.5] group-hover:text-white/70 group-hover:scale-105 transition-all" />
          <span
            className="text-sm text-white/50 font-normal group-hover:text-white/70"
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Settings
          </span>
        </Link>
        <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/5 group">
          <HelpCircle className="w-5 h-5 text-white/50 stroke-[1.5] group-hover:text-white/70 group-hover:scale-105 transition-all" />
          <span
            className="text-sm text-white/50 font-normal group-hover:text-white/70"
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Help
          </span>
        </button>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-white/5 group"
        >
          <LogOut className="w-5 h-5 text-white/50 stroke-[1.5] group-hover:text-white/70 group-hover:scale-105 transition-all" />
          <span
            className="text-sm text-white/50 font-normal group-hover:text-white/70"
            style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
          >
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
}

// Mobile bottom navigation for creators
export function CreatorMobileNav() {
  const pathname = usePathname();

  const mobileItems = [
    { label: "Home", href: "/creator", icon: LayoutDashboard },
    { label: "Campaigns", href: "/creator/campaigns", icon: Briefcase },
    { label: "Messages", href: "/creator/messages", icon: MessageCircle },
    { label: "Analytics", href: "/creator/analytics", icon: BarChart3 },
    { label: "Wallet", href: "/creator/wallet", icon: Wallet },
  ];

  const isActive = (href: string) => {
    if (href === "/creator") return pathname === "/creator";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around h-16 px-1">
          {mobileItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all",
                  active ? "text-blue-400" : "text-white/50"
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
