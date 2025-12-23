"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Star,
  Building,
  Settings,
  FileVideo,
  DollarSign,
  BarChart3,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  subItems?: SubItem[];
  badge?: number;
}

// Primary navigation items (first 5 shown in bottom bar)
const primaryItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin2",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    href: "/admin2/campaigns",
    subItems: [
      { title: "All Campaigns", href: "/admin2/campaigns" },
      { title: "Create New", href: "/admin2/campaigns/new" },
      { title: "Archived", href: "/admin2/campaigns/archived" },
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin2/messages",
    badge: 3,
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin2/notifications",
    badge: 5,
  },
];

// Overflow items (shown in "More" sheet)
const overflowItems: NavItem[] = [
  {
    title: "Draft Reviews",
    icon: FileVideo,
    href: "/admin2/drafts",
  },
  {
    title: "Creators",
    icon: Star,
    href: "/admin2/creators",
    subItems: [
      { title: "All Creators", href: "/admin2/creators" },
      { title: "Roster", href: "/admin2/creators/roster" },
      { title: "Analytics", href: "/admin2/creators/analytics" },
      { title: "Invitations", href: "/admin2/creators/invitations" },
    ],
  },
  {
    title: "Clients",
    icon: Building,
    href: "/admin2/clients",
    subItems: [
      { title: "All Clients", href: "/admin2/clients" },
      { title: "Permissions", href: "/admin2/clients/permissions" },
    ],
  },
  {
    title: "Invitations",
    icon: UserPlus,
    href: "/admin2/invitations",
  },
  {
    title: "Finance",
    icon: DollarSign,
    href: "/admin2/finance",
    subItems: [
      { title: "Overview", href: "/admin2/finance" },
      { title: "Invoices", href: "/admin2/finance/invoices" },
      { title: "Payments", href: "/admin2/finance/payments" },
      { title: "Withdrawals", href: "/admin2/finance/withdrawals" },
      { title: "Transactions", href: "/admin2/finance/transactions" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin2/analytics",
    subItems: [
      { title: "Overview", href: "/admin2/analytics" },
      { title: "Campaigns", href: "/admin2/analytics/campaigns" },
      { title: "Creators", href: "/admin2/analytics/creators" },
      { title: "ROI Analysis", href: "/admin2/analytics/roi" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin2/settings",
    subItems: [
      { title: "Organization", href: "/admin2/settings/organization" },
      { title: "Team", href: "/admin2/settings/team" },
      { title: "Integrations", href: "/admin2/settings/integrations" },
      { title: "Branding", href: "/admin2/settings/branding" },
    ],
  },
];

export function Admin2MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isItemActive = (item: NavItem) => {
    if (item.href === "/admin2" && pathname === "/admin2") return true;
    if (item.href !== "/admin2" && pathname.startsWith(item.href.split("?")[0])) return true;
    if (item.subItems?.some((sub) => pathname === sub.href.split("?")[0] || pathname.startsWith(sub.href.split("?")[0]))) return true;
    return false;
  };

  // Check if any overflow item is active
  const isOverflowActive = overflowItems.some(isItemActive);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Bottom bar container */}
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {/* Primary items */}
          {primaryItems.map((item) => (
            <MobileNavItem
              key={item.title}
              item={item}
              isActive={isItemActive(item)}
              onNavigate={() => setMoreOpen(false)}
            />
          ))}

          {/* More button */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                  "min-w-[56px]",
                  isOverflowActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isOverflowActive && "bg-primary/10"
                )}>
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  Navigation
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                    Admin v2
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto -mx-6 px-6 pb-safe">
                <div className="space-y-1">
                  {overflowItems.map((item) => (
                    <MobileNavSheetItem
                      key={item.title}
                      item={item}
                      isActive={isItemActive(item)}
                      onNavigate={() => setMoreOpen(false)}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function MobileNavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
        "min-w-[56px] relative",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-lg transition-colors relative",
        isActive && "bg-primary/10"
      )}>
        <Icon className="w-5 h-5" />
        {item.badge && item.badge > 0 && (
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-medium text-white flex items-center justify-center">
            {item.badge > 9 ? '9+' : item.badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium truncate max-w-[56px]">
        {item.title}
      </span>
    </Link>
  );
}

function MobileNavSheetItem({
  item,
  isActive,
  onNavigate,
  pathname,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [expanded, setExpanded] = React.useState(isActive && hasSubItems);

  if (hasSubItems) {
    return (
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors",
              "hover:bg-muted",
              isActive && "bg-muted"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg",
              isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "flex-1 text-left font-medium",
              isActive && "text-primary"
            )}>
              {item.title}
            </span>
            <ChevronRight className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              expanded && "rotate-90"
            )} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-14 mt-1 space-y-1 pb-2">
            {item.subItems?.map((subItem) => {
              const subIsActive = pathname === subItem.href.split("?")[0] ||
                pathname.startsWith(subItem.href.split("?")[0]);

              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={onNavigate}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    "hover:bg-muted",
                    subIsActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                  )}
                >
                  {subItem.title}
                </Link>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        "hover:bg-muted",
        isActive && "bg-muted"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg",
        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={cn(
        "font-medium",
        isActive && "text-primary"
      )}>
        {item.title}
      </span>
    </Link>
  );
}
