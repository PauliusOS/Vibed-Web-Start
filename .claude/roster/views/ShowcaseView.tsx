"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CreatorShowcaseCard, Creator } from "@/components/roster/CreatorShowcaseCard";

interface ShowcaseViewProps {
  creators: Creator[];
  selectedCreators?: Set<string>;
  onToggleSelect?: (creatorId: string) => void;
  onViewProfile?: (creator: Creator) => void;
  onMessage?: (creator: Creator) => void;
}

export function ShowcaseView({
  creators,
  selectedCreators,
  onToggleSelect,
  onViewProfile,
  onMessage,
}: ShowcaseViewProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleExpandChange = (creatorId: string, expanded: boolean) => {
    const newExpanded = new Set(expandedCards);
    if (expanded) {
      newExpanded.add(creatorId);
    } else {
      newExpanded.delete(creatorId);
    }
    setExpandedCards(newExpanded);
  };

  if (creators.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-white/60">No creators in this roster yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator, index) => (
        <motion.div
          key={creator.userId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <CreatorShowcaseCard
            creator={creator}
            isSelected={selectedCreators?.has(creator.userId)}
            onToggleSelect={onToggleSelect}
            isExpanded={expandedCards.has(creator.userId)}
            onExpandChange={(expanded) => handleExpandChange(creator.userId, expanded)}
            onViewProfile={onViewProfile}
            onMessage={onMessage}
          />
        </motion.div>
      ))}
    </div>
  );
}
