"use client";

import { RosterCard } from "./RosterCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { motion } from "motion/react";
import type { Roster } from "./types";

interface RosterGridProps {
  rosters: Roster[];
  isLoading?: boolean;
  onRosterClick?: (roster: Roster) => void;
  onEdit?: (roster: Roster) => void;
  onDuplicate?: (roster: Roster) => void;
  onDelete?: (roster: Roster) => void;
  onCreateNew?: () => void;
}

// Loading skeleton for roster cards
function RosterCardSkeleton() {
  return (
    <GlassPanel className="p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-white/[0.06] rounded mb-2" />
          <div className="h-4 w-48 bg-white/[0.04] rounded" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-white/[0.04] rounded-full" />
        <div className="h-5 w-20 bg-white/[0.04] rounded-full" />
      </div>
      <div className="pt-3 border-t border-white/[0.06] flex justify-between">
        <div className="h-4 w-24 bg-white/[0.04] rounded" />
        <div className="h-4 w-16 bg-white/[0.04] rounded" />
      </div>
    </GlassPanel>
  );
}

// Empty state when no rosters exist
function EmptyState({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <GlassPanel className="p-12">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Users className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-30" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No rosters yet
        </h3>
        <p className="text-white/60 mb-6 max-w-sm mx-auto">
          Create your first roster to organize creators into custom lists for
          easy management and bulk actions.
        </p>
        {onCreateNew && (
          <Button
            onClick={onCreateNew}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Roster
          </Button>
        )}
      </div>
    </GlassPanel>
  );
}

// Empty state when search yields no results
function NoResultsState() {
  return (
    <GlassPanel className="p-12">
      <div className="text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-white/20" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No rosters found
        </h3>
        <p className="text-white/60">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    </GlassPanel>
  );
}

export function RosterGrid({
  rosters,
  isLoading = false,
  onRosterClick,
  onEdit,
  onDuplicate,
  onDelete,
  onCreateNew,
}: RosterGridProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <RosterCardSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  // Show empty state if no rosters at all
  if (rosters.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  // Grid view of roster cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rosters.map((roster, index) => (
        <motion.div
          key={roster._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <RosterCard
            roster={roster}
            onClick={() => onRosterClick?.(roster)}
            onEdit={() => onEdit?.(roster)}
            onDuplicate={() => onDuplicate?.(roster)}
            onDelete={() => onDelete?.(roster)}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Also export the empty states for use in parent components
RosterGrid.EmptyState = EmptyState;
RosterGrid.NoResultsState = NoResultsState;
RosterGrid.Skeleton = RosterCardSkeleton;
