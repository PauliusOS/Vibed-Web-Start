"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Video,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Briefcase,
  Wallet,
  UserCheck,
  FileText,
  Calendar,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateCampaignDialog } from "./CreateCampaignDialog";
import { Button } from "@/components/ui/button";

// Sidebar navigation items for admin
const navItems = [
  { icon: Users, label: "Roster", href: "/admin6/roster" },
  { icon: FileText, label: "Invitations", href: "/admin6/invitations" },
  { icon: MessageCircle, label: "Messages", href: "/admin6/messages", hasNotification: true },
];

export function Admin6Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  // Get default organization for admin
  const defaultOrg = useQuery(api.creatorOnboarding.getDefaultOrganization);

  const isActive = (href: string) => {
    if (href === "/admin6") {
      return pathname === "/admin6";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-black border-r border-white/10 flex-col py-6 px-3 z-50">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/admin6">
          <h1
            className="text-[22px] font-bold tracking-tight text-white"
            style={{
              fontFamily: "'Euclid Circular A', system-ui, sans-serif",
            }}
          >
            SylcRoad
          </h1>
          <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase mt-0.5">
            Admin Portal
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
          {/* Profile - at the top */}
          <Link
            href="/admin6"
            className={cn(
              "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
              isActive("/admin6") && pathname === "/admin6"
                ? "bg-blue-500/10"
                : "hover:bg-white/5"
            )}
          >
            <Avatar className="w-5 h-5 ring-1 ring-white/20">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px]">
                {user?.firstName?.[0] || user?.username?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "text-sm transition-all",
                isActive("/admin6") && pathname === "/admin6"
                  ? "text-white font-medium"
                  : "text-white/70 font-normal group-hover:text-white/90"
              )}
              style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
            >
              Profile
            </span>
          </Link>

          {/* Campaigns */}
          <Link
            href="/admin6/campaigns"
            className={cn(
              "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
              isActive("/admin6/campaigns")
                ? "bg-blue-500/10"
                : "hover:bg-white/5"
            )}
          >
            <Briefcase
              className={cn(
                "w-5 h-5 transition-all",
                isActive("/admin6/campaigns")
                  ? "text-blue-400 stroke-[2]"
                  : "text-white/70 stroke-[1.5] group-hover:text-white/90 group-hover:scale-105"
              )}
            />
            <span
              className={cn(
                "text-sm transition-all",
                isActive("/admin6/campaigns")
                  ? "text-white font-medium"
                  : "text-white/70 font-normal group-hover:text-white/90"
              )}
              style={{ fontFamily: "'Euclid Circular A', system-ui, sans-serif" }}
            >
              Campaigns
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
          href="/admin6/settings"
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

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
        organizationId={defaultOrg?._id}
      />
    </aside>
  );
}
