"use client";

import { Plus, UserPlus, FileText, Calendar, Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}

const defaultActions: QuickAction[] = [
  {
    label: "New Campaign",
    description: "Create a new marketing campaign",
    icon: <Plus className="w-5 h-5" />,
    href: "/admin69/campaigns/new",
    variant: "primary",
  },
  {
    label: "Add Creator",
    description: "Invite a creator to join",
    icon: <UserPlus className="w-5 h-5" />,
    href: "/admin69/creators/invite",
    variant: "secondary",
  },
  {
    label: "Create Brief",
    description: "Draft a content brief",
    icon: <FileText className="w-5 h-5" />,
    href: "/admin69/briefs/new",
    variant: "secondary",
  },
  {
    label: "Schedule Post",
    description: "Add to content calendar",
    icon: <Calendar className="w-5 h-5" />,
    href: "/admin69/calendar",
    variant: "secondary",
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  compact?: boolean;
}

export function QuickActions({ actions = defaultActions, compact = false }: QuickActionsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              action.variant === "primary"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]"
            )}
          >
            {action.icon}
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "group p-4 rounded-lg border transition-all",
            action.variant === "primary"
              ? "bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all",
            action.variant === "primary"
              ? "bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30"
              : "bg-white/[0.05] text-white/60 group-hover:text-white/80"
          )}>
            {action.icon}
          </div>
          <h4 className={cn(
            "text-sm font-medium mb-0.5 transition-colors",
            action.variant === "primary"
              ? "text-white group-hover:text-cyan-400"
              : "text-white/90 group-hover:text-white"
          )}>
            {action.label}
          </h4>
          <p className="text-xs text-white/40">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default QuickActions;
