"use client";

import { cn } from "@/lib/utils";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Admin3HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Admin3Header({ title, subtitle, actions }: Admin3HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            {title && (
              <div>
                <h1 className="text-[15px] font-semibold text-white">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[12px] text-white/40">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Search, Notifications, Actions */}
          <div className="flex items-center gap-3">
            {/* Search - Desktop only */}
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-white/30" />
              <Input
                type="search"
                placeholder="Search..."
                className={cn(
                  "w-64 h-9 pl-9 text-[13px]",
                  "bg-white/[0.04] border-white/[0.08] text-white",
                  "placeholder:text-white/30",
                  "focus:bg-white/[0.06] focus:border-white/[0.15]",
                  "transition-all duration-200"
                )}
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/[0.06]"
            >
              <Bell className="w-4 h-4" />
            </Button>

            {/* Custom actions */}
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
