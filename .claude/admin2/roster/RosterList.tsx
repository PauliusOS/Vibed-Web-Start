"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import type { Roster } from "./types";

interface RosterListProps {
  rosters: Roster[];
  onRosterClick?: (roster: Roster) => void;
  onEdit?: (roster: Roster) => void;
  onDuplicate?: (roster: Roster) => void;
  onDelete?: (roster: Roster) => void;
}

interface RosterListItemProps {
  roster: Roster;
  index: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

// Format the last updated date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function RosterListItem({
  roster,
  index,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
}: RosterListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassPanel
        className="p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer"
        onClick={onClick}
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: roster.color,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${roster.color}20` }}
          >
            {roster.icon}
          </div>

          {/* Name & Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">
              {roster.name}
            </h3>
            {roster.description && (
              <p className="text-sm text-white/60 truncate">
                {roster.description}
              </p>
            )}
          </div>

          {/* Tags (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            {roster.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/[0.06] text-white/70 border-0 text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {roster.tags.length > 2 && (
              <Badge
                variant="secondary"
                className="bg-white/[0.06] text-white/50 border-0 text-xs px-2 py-0.5"
              >
                +{roster.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="hidden lg:flex items-center gap-6 text-sm flex-shrink-0">
            <div className="flex items-center gap-1.5 text-white/60">
              <Users className="h-4 w-4" />
              <span className="font-medium text-white">
                {roster.totalCreators}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="font-medium text-white">
                {roster.averageEngagement.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Clock className="h-3 w-3" />
              {formatDate(roster.updatedAt)}
            </div>
          </div>

          {/* Actions */}
          <div
            className={`flex items-center gap-2 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white/60 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#0a0a0a] border-white/[0.06]"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="text-white/80 hover:text-white focus:text-white"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate?.();
                  }}
                  className="text-white/80 hover:text-white focus:text-white"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="text-red-400 hover:text-red-300 focus:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Chevron indicator */}
          <ChevronRight className="h-4 w-4 text-white/30 flex-shrink-0" />
        </div>
      </GlassPanel>
    </motion.div>
  );
}

export function RosterList({
  rosters,
  onRosterClick,
  onEdit,
  onDuplicate,
  onDelete,
}: RosterListProps) {
  return (
    <div className="space-y-3">
      {rosters.map((roster, index) => (
        <RosterListItem
          key={roster._id}
          roster={roster}
          index={index}
          onClick={() => onRosterClick?.(roster)}
          onEdit={() => onEdit?.(roster)}
          onDuplicate={() => onDuplicate?.(roster)}
          onDelete={() => onDelete?.(roster)}
        />
      ))}
    </div>
  );
}

// Loading skeleton for list items
export function RosterListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <GlassPanel className="p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-white/[0.06] rounded mb-2" />
                <div className="h-3 w-64 bg-white/[0.04] rounded" />
              </div>
              <div className="hidden md:flex gap-2">
                <div className="h-5 w-16 bg-white/[0.04] rounded-full" />
                <div className="h-5 w-16 bg-white/[0.04] rounded-full" />
              </div>
              <div className="h-4 w-4 bg-white/[0.04] rounded" />
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
