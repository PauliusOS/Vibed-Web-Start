"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  DollarSign,
  Star,
  Building,
  Settings,
  Contact,
  FileVideo,
  FlaskConical,
  Mail,
  MoreHorizontal,
  X,
  ChevronRight,
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
}

// Primary navigation items (first 5 shown in bottom bar)
const primaryItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    href: "/admin/campaigns",
    subItems: [
      { title: "All Campaigns", href: "/admin/campaigns" },
      { title: "Active", href: "/admin/campaigns?status=active" },
      { title: "Completed", href: "/admin/campaigns?status=completed" },
    ],
  },
  {
    title: "Creators",
    icon: Star,
    href: "/admin/creators",
    subItems: [
      { title: "All Creators", href: "/admin/creators" },
      { title: "Roster", href: "/admin/creators/roster" },
      { title: "Analytics", href: "/admin/creators/analytics" },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    href: "/admin/finance",
    subItems: [
      { title: "Overview", href: "/admin/finance" },
      { title: "Withdrawals", href: "/admin/withdrawals" },
      { title: "Payments", href: "/admin/finance/payments" },
      { title: "Invoices", href: "/admin/finance/invoices" },
      { title: "Transactions", href: "/admin/finance/transactions" },
    ],
  },
];

// Overflow items (shown in "More" sheet)
const overflowItems: NavItem[] = [
  {
    title: "Draft Reviews",
    icon: FileVideo,
    href: "/admin/drafts",
  },
  {
    title: "Clients",
    icon: Building,
    href: "/admin/clients",
    subItems: [
      { title: "All Clients", href: "/admin/clients" },
      { title: "Payments", href: "/admin/clients/payments" },
    ],
  },
  {
    title: "CRM",
    icon: Contact,
    href: "/admin/crm",
    subItems: [
      { title: "Overview", href: "/admin/crm" },
      { title: "Leads", href: "/crm/leads" },
      { title: "Pipeline", href: "/crm/pipeline" },
      { title: "Tasks", href: "/crm/tasks" },
    ],
  },
  {
    title: "Invitations",
    icon: Mail,
    href: "/admin/invitations",
  },
  {
    title: "Dev Tools",
    icon: FlaskConical,
    href: "/admin/dev-tools",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isItemActive = (item: NavItem) => {
    if (item.href === "/admin" && pathname === "/admin") return true;
    if (item.href !== "/admin" && pathname.startsWith(item.href.split("?")[0])) return true;
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
                <SheetTitle>Navigation</SheetTitle>
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
        "min-w-[56px]",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-lg transition-colors",
        isActive && "bg-primary/10"
      )}>
        <Icon className="w-5 h-5" />
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

