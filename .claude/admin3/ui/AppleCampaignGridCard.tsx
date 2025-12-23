"use client";

import { useMotionValue, useMotionTemplate, motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Users, Archive, Trash2 } from "lucide-react";

interface AppleCampaignGridCardProps {
  id: string;
  name: string;
  status: "active" | "draft" | "paused" | "completed" | "archived";
  videoCount?: number;
  totalViews?: number;
  budget?: number;
  index?: number;
  onArchive?: () => void;
  onDelete?: () => void;
  onAssignCreator?: () => void;
}

export function AppleCampaignGridCard({
  id,
  name,
  status,
  videoCount = 0,
  totalViews = 0,
  budget,
  index = 0,
  onArchive,
  onDelete,
  onAssignCreator,
}: AppleCampaignGridCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const statusConfig = {
    active: { label: "Active", dot: "bg-emerald-400", ring: "ring-emerald-400/20" },
    draft: { label: "Draft", dot: "bg-white/40", ring: "ring-white/10" },
    paused: { label: "Paused", dot: "bg-amber-400", ring: "ring-amber-400/20" },
    completed: { label: "Completed", dot: "bg-blue-400", ring: "ring-blue-400/20" },
    archived: { label: "Archived", dot: "bg-white/20", ring: "ring-white/5" },
  };

  const { label: statusLabel, dot: statusDot, ring: statusRing } = statusConfig[status];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl bg-[#141414] border border-white/[0.08] overflow-hidden h-full"
    >
      {/* Gradient follow cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              280px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.04),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Initial with status ring */}
          <div className={cn(
            "w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06] ring-2",
            statusRing
          )}>
            <span className="text-[16px] font-semibold text-white/70">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/20 hover:text-white/60 hover:bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-[#1a1a1a] border-white/10"
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin3/${id}`}
                  className="text-[13px] text-white/70 hover:text-white cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin3/${id}/edit`}
                  className="text-[13px] text-white/70 hover:text-white cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onAssignCreator && (
                <DropdownMenuItem
                  onClick={onAssignCreator}
                  className="text-[13px] text-white/70 hover:text-white cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 mr-2" />
                  Assign Creator
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              {onArchive && (
                <DropdownMenuItem
                  onClick={onArchive}
                  className="text-[13px] text-white/50 hover:text-white cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-[13px] text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Campaign info */}
        <Link href={`/admin3/${id}`} className="block flex-1">
          <h3 className="text-[15px] font-medium text-white group-hover:text-white/90 transition-colors mb-2 line-clamp-1">
            {name}
          </h3>

          {/* Status badge */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className={cn("w-1.5 h-1.5 rounded-full", statusDot)} />
            <span className="text-[12px] text-white/40">{statusLabel}</span>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
              Videos
            </p>
            <p className="text-[14px] font-medium text-white tabular-nums">
              {videoCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
              Views
            </p>
            <p className="text-[14px] font-medium text-white tabular-nums">
              {formatNumber(totalViews)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
              Budget
            </p>
            <p className="text-[14px] font-medium text-white tabular-nums">
              {budget ? `$${formatNumber(budget)}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
