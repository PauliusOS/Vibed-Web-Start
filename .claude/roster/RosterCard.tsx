"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Edit, Share2, Trash2, Eye } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { framerTransitions, framerShadow } from "@/lib/animations";

interface RosterCardProps {
  roster: Doc<"creatorRosters"> & {
    isOwner?: boolean;
    canEdit?: boolean;
  };
  onEdit?: (roster: Doc<"creatorRosters">) => void;
  onShare?: (roster: Doc<"creatorRosters">) => void;
  onDelete?: (roster: Doc<"creatorRosters">) => void;
}

export function RosterCard({ roster, onEdit, onShare, onDelete }: RosterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "border-primary";
      case "clientele":
        return "border-purple-500";
      case "organization":
        return "border-secondary";
      default:
        return "border-border";
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Badge variant="outline" className="bg-primary/10">Private</Badge>;
      case "clientele":
        return <Badge variant="outline" className="bg-purple-500/10">Clientele</Badge>;
      case "organization":
        return <Badge variant="outline" className="bg-secondary/10">Organization</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        height: isExpanded ? 'auto' : '280px'
      }}
      transition={framerTransitions.state}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "border-2",
          getVisibilityColor(roster.visibility)
        )}
        style={{
          borderTopLeftRadius: '44px',
          borderTopRightRadius: '44px',
          borderBottomLeftRadius: '34px',
          borderBottomRightRadius: '34px',
          boxShadow: framerShadow
        }}
      >
        {/* Visual Header Area */}
        <div className="relative h-[180px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          {roster.icon ? (
            <div className="text-6xl">{roster.icon}</div>
          ) : (
            <Users className="w-16 h-16 text-primary" />
          )}
          <ProgressiveBlur blurAmount={8} />
        </div>

        {/* Always-Visible Content */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={framerTransitions.spring(0)}
        >
          {/* Title & Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={framerTransitions.spring(0)}
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {roster.name}
            </h3>
            {getVisibilityBadge(roster.visibility)}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={framerTransitions.spring(0.4)}
            className="flex items-center gap-4 text-sm mt-3"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-white/60" />
              <span className="font-medium text-white">{roster.totalCreators}</span>
            </div>
            {roster.averageEngagement && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-white/60" />
                <span className="font-medium text-white">{roster.averageEngagement.toFixed(1)}%</span>
              </div>
            )}
          </motion.div>

          {/* Expand Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={framerTransitions.spring(0.6)}
            className="mt-4"
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              size="sm"
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              {isExpanded ? 'Close' : 'View Roster'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={framerTransitions.state}
              className="bg-black/20 backdrop-blur-sm p-6 rounded-b-[34px]"
            >
              {/* Description */}
              {roster.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0)}
                  className="text-sm text-white/80 mb-4"
                >
                  {roster.description}
                </motion.p>
              )}

              {/* Tags */}
              {roster.tags && roster.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0.4)}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {roster.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* Owner Badge */}
              {roster.isOwner && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0.6)}
                  className="mb-4"
                >
                  <Badge variant="outline" className="w-fit bg-primary/5">
                    <Eye className="w-3 h-3 mr-1" />
                    Owner
                  </Badge>
                </motion.div>
              )}

              {/* Actions */}
              {(roster.isOwner || roster.canEdit) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0.8)}
                  className="flex gap-2"
                >
                  {roster.canEdit && onEdit && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(roster);
                      }}
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {roster.isOwner && onShare && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onShare(roster);
                      }}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600 flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  )}
                  {roster.isOwner && onDelete && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(roster);
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link wrapper for navigation */}
        <Link 
          href={`/admin/tools/roster/${roster._id}`}
          className="absolute inset-0 z-0"
          onClick={(e) => {
            if (isExpanded) e.preventDefault();
          }}
        />
      </Card>
    </motion.div>
  );
}
