"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import { Plus, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Overview", href: "/campaigns" },
  { name: "Campaigns", href: "/campaigns/list" },
  { name: "Invitations", href: "/campaigns/invitations" },
  { name: "Analytics", href: "/campaigns/analytics" },
  { name: "Archived", href: "/campaigns/archived" },
];

export function CampaignNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/campaigns") {
      return pathname === "/campaigns";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-black border-b border-white/[0.08]" />

      <nav className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex h-14 items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/campaigns" className="flex items-center gap-2">
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Campaigns
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "relative px-3 py-1.5 text-[13px] font-medium transition-colors",
                        active
                          ? "text-white"
                          : "text-white/50 hover:text-white/80"
                      )}
                    >
                      {item.name}
                      {active && (
                        <motion.div
                          layoutId="navbar-underline"
                          className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-white"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Create Button */}
            <Link href="/campaigns/new">
              <Button
                size="sm"
                className="hidden sm:flex h-8 px-3 text-[12px] font-medium bg-white text-black hover:bg-white/90 rounded-md"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                New
              </Button>
            </Link>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-1 text-[13px] text-white/50 hover:text-white/80 transition-colors">
                  More
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-black border-white/10 rounded-lg"
              >
                <DropdownMenuItem className="text-[13px] text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[13px] text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin2"
                    className="text-[13px] text-white/50 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Back to Admin
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 rounded-full",
                },
              }}
            />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 text-white/50 hover:text-white hover:bg-white/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-white/[0.08]"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={cn(
                        "px-2 py-2 text-[14px] font-medium transition-colors rounded-md",
                        active
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              <Link href="/campaigns/new" onClick={() => setMobileMenuOpen(false)}>
                <div className="mt-3 px-3 py-2 text-center text-[13px] font-medium bg-white text-black rounded-md">
                  New Campaign
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
