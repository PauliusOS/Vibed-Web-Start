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
} from "lucide-react";
import { motion } from "motion/react";
import type { Roster } from "./types";

interface RosterCardProps {
  roster: Roster;
  onClick?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function RosterCard({
  roster,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
}: RosterCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the last updated date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassPanel
        className="p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer group relative overflow-visible"
        onClick={onClick}
        style={{
          borderLeftWidth: "4px",
          borderLeftColor: roster.color,
        }}
      >
        {/* Header with Icon, Name, and Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Emoji Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${roster.color}20` }}
            >
              {roster.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                {roster.name}
              </h3>
              {roster.description && (
                <p className="text-sm text-white/60 line-clamp-1 mt-0.5">
                  {roster.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          <div
            className={`transition-opacity ${
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
        </div>

        {/* Tags */}
        {roster.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {roster.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-white/[0.06] text-white/70 border-0 text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {roster.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-white/[0.06] text-white/50 border-0 text-xs px-2 py-0.5"
              >
                +{roster.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            {/* Creator Count */}
            <div className="flex items-center gap-1.5 text-white/60">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium text-white">
                {roster.totalCreators}
              </span>
              <span className="text-xs">creators</span>
            </div>

            {/* Avg Engagement */}
            <div className="flex items-center gap-1.5 text-white/60">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">
                {roster.averageEngagement.toFixed(1)}%
              </span>
              <span className="text-xs">avg</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(roster.updatedAt)}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
