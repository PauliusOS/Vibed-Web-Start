"use client";

import { UserButton } from "@clerk/nextjs";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Admin2NotificationPanel } from "./Admin2NotificationPanel";
import { Admin2MessageCounter } from "./Admin2MessageCounter";

interface Admin2HeaderProps {
  title?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
  actions?: React.ReactNode;
}

export function Admin2Header({ title, breadcrumbs, actions }: Admin2HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
      {/* Logo/Brand for mobile */}
      <Link href="/admin2" className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-semibold">SylcRoad</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
          v2
        </span>
      </Link>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Title (if no breadcrumbs) */}
      {!breadcrumbs && title && (
        <div className="flex items-center gap-2 hidden md:block">
          <h1 className="text-lg font-semibold">{title}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
            Admin v2
          </span>
        </div>
      )}

      {/* Custom Actions */}
      {actions && <div className="hidden md:block">{actions}</div>}

      {/* Spacer */}
      <div className="ml-auto flex items-center gap-2">
        {/* Global Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search... (Cmd+K)"
            className="w-64 pl-8"
          />
        </div>

        {/* Search button for smaller screens */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Messages */}
        <Admin2MessageCounter />

        {/* Notifications */}
        <Admin2NotificationPanel />

        {/* User Menu */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
