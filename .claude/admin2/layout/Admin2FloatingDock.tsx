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
  ChevronRight,
  BarChart3,
  Bell,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubItem {
  title: string;
  href: string;
}

interface DockItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  subItems?: SubItem[];
}

// Primary navigation items
const primaryItems: DockItem[] = [
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
    title: "Notifications",
    icon: Bell,
    href: "/admin2/notifications",
    subItems: [
      { title: "All Notifications", href: "/admin2/notifications" },
      { title: "Settings", href: "/admin2/notifications/settings" },
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin2/messages",
  },
];

// Secondary navigation items
const secondaryItems: DockItem[] = [
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

export function Admin2FloatingDock() {
  const mouseY = useMotionValue(Infinity);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.nav
        onMouseMove={(e) => mouseY.set(e.pageY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        className={cn(
          "fixed left-3 top-1/2 -translate-y-1/2 z-50",
          "hidden md:flex flex-col items-center gap-2",
          "rounded-2xl bg-background/90 backdrop-blur-xl border border-border/50",
          "px-2 py-4 floating-dock-shadow"
        )}
      >
        {/* Primary Items */}
        <div className="flex flex-col items-center gap-1">
          {primaryItems.map((item) => (
            <DockIconContainer
              key={item.title}
              mouseY={mouseY}
              item={item}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-8 h-px bg-border/50 my-2" />

        {/* Secondary Items */}
        <div className="flex flex-col items-center gap-1">
          {secondaryItems.map((item) => (
            <DockIconContainer
              key={item.title}
              mouseY={mouseY}
              item={item}
            />
          ))}
        </div>
      </motion.nav>
    </TooltipProvider>
  );
}

function DockIconContainer({
  mouseY,
  item,
}: {
  mouseY: MotionValue;
  item: DockItem;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hovered, setHovered] = React.useState(false);

  // Check if this item or any of its sub-items are active
  const isActive = React.useMemo(() => {
    if (item.href === "/admin2" && pathname === "/admin2") return true;
    if (item.href !== "/admin2" && pathname.startsWith(item.href.split("?")[0])) return true;
    if (item.subItems?.some((sub) => pathname === sub.href.split("?")[0] || pathname.startsWith(sub.href.split("?")[0]))) return true;
    return false;
  }, [pathname, item]);

  // Motion transforms for the dock magnification effect
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const sizeTransform = useTransform(distance, [-100, 0, 100], [40, 52, 40]);
  const iconSizeTransform = useTransform(distance, [-100, 0, 100], [18, 24, 18]);

  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconSize = useSpring(iconSizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href}>
            <motion.div
              ref={ref}
              style={{ width: size, height: size }}
              className={cn(
                "relative flex items-center justify-center rounded-xl transition-colors",
                "bg-muted/50 hover:bg-muted",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <motion.div
                style={{ width: iconSize, height: iconSize }}
                className="flex items-center justify-center"
              >
                <Icon className="w-full h-full" />
              </motion.div>

              {/* Sub-items indicator */}
              {hasSubItems && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2">
                  <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          </Link>
        </TooltipTrigger>
        {!hasSubItems && (
          <TooltipContent side="right" sideOffset={8}>
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>

      {/* Sub-items popup */}
      <AnimatePresence>
        {hovered && hasSubItems && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-full top-0 ml-3 z-50",
              "min-w-[180px] rounded-xl",
              "bg-background/95 backdrop-blur-xl border border-border/50",
              "shadow-xl p-2"
            )}
          >
            {/* Arrow pointer */}
            <div className="absolute left-0 top-3 -translate-x-1 w-2 h-2 rotate-45 bg-background/95 border-l border-b border-border/50" />

            <div className="relative">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {item.title}
              </div>
              <div className="space-y-0.5">
                {item.subItems?.map((subItem) => {
                  const subIsActive = pathname === subItem.href.split("?")[0] ||
                    (pathname.startsWith(subItem.href.split("?")[0]) && subItem.href !== item.href);

                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm",
                        "transition-colors hover:bg-muted",
                        subIsActive && "bg-muted font-medium"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
