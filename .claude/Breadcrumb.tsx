"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2", className)}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home link */}
        <li>
          <Link
            href="/creator"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all group"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Separator */}
              <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />

              {/* Breadcrumb link or text */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  {item.icon && <span className="h-3.5 w-3.5">{item.icon}</span>}
                  <span className="max-w-[200px] truncate">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 text-sm",
                    isLast ? "text-white/90 font-medium" : "text-white/60"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <span className="h-3.5 w-3.5">{item.icon}</span>}
                  <span className="max-w-[200px] truncate">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

// Pre-configured breadcrumb variants for common pages
export function CampaignDetailBreadcrumb({ campaignName }: { campaignName: string }) {
  return (
    <Breadcrumb
      items={[
        { label: "Campaigns", href: "/creator/campaigns" },
        { label: campaignName },
      ]}
    />
  );
}

export function DealWorkspaceBreadcrumb({
  campaignName,
  campaignId,
}: {
  campaignName: string;
  campaignId: string;
}) {
  return (
    <Breadcrumb
      items={[
        { label: "Campaigns", href: "/creator/campaigns" },
        { label: campaignName, href: `/creator/campaigns/${campaignId}` },
        { label: "Deal Workspace" },
      ]}
    />
  );
}

export function VideoBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "My Videos" },
      ]}
    />
  );
}

export function WalletBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Wallet" },
      ]}
    />
  );
}

export function DiscoverBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Discover Creators" },
      ]}
    />
  );
}
