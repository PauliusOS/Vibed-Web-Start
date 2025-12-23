"use client";

import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "./constants/colors";

export interface Creator {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  platform: "instagram" | "tiktok";
  color: string;
}

interface CreatorAvatarRowProps {
  creators: Creator[];
  activeCreators?: Set<string>;
  onToggleCreator?: (creatorId: string) => void;
  className?: string;
}

/**
 * CreatorAvatarRow - Animated row of creator avatars for toggling chart visibility
 *
 * Inspired by animate-ui's User Presence Avatar component
 * Features:
 * - Smooth animated transitions
 * - Colored ring around avatar matching chart line
 * - Click to toggle visibility
 * - Profile pictures from social media
 */
export function CreatorAvatarRow({
  creators,
  activeCreators,
  onToggleCreator,
  className,
}: CreatorAvatarRowProps) {
  // Default to all creators being active if no activeCreators set is provided
  const effectiveActiveCreators = activeCreators ?? new Set(creators.map(c => c.id));

  return (
    <div className={cn("flex items-center gap-1", className)}>
        <AnimatePresence mode="sync">
          {creators.map((creator, index) => {
            const isActive = effectiveActiveCreators.has(creator.id);

            return (
              <motion.button
                key={creator.id}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.08,
                }}
                onClick={() => onToggleCreator?.(creator.id)}
                className={cn(
                  "relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
                )}
                style={{
                  marginLeft: index > 0 ? "-8px" : "0",
                  zIndex: creators.length - index,
                }}
                whileHover={{
                  scale: 1.08,
                  zIndex: 100,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                {/* Colored Ring */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-200 group-hover:scale-105"
                  style={{
                    border: `2px solid ${creator.color}`,
                    opacity: isActive ? 1 : 0.3,
                    boxShadow: isActive ? `0 0 8px ${creator.color}40` : "none",
                  }}
                />

                {/* Avatar */}
                <Avatar
                  className={cn(
                    "w-10 h-10 border-2 border-black transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-50"
                  )}
                >
                  <AvatarImage
                    src={creator.profilePicture}
                    alt={creator.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className="text-xs font-medium"
                    style={{ backgroundColor: creator.color }}
                  >
                    {creator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Selection Indicator */}
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: creator.color, x: "-50%" }}
                  animate={{
                    scale: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                />

                {/* Tooltip */}
                <div
                  className={cn(
                    "absolute -top-12 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "pointer-events-none z-50"
                  )}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    color: FRAMER_TEXT_COLORS.primary,
                    border: `1px solid ${creator.color}40`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span>{creator.name}</span>
                    <span
                      className="text-[10px]"
                      style={{ color: FRAMER_TEXT_COLORS.secondary }}
                    >
                      @{creator.username}
                    </span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "4px solid rgba(0, 0, 0, 0.9)",
                    }}
                  />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
    </div>
  );
}

export default CreatorAvatarRow;


