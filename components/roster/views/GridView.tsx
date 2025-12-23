"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Video, Users, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { framerTransitions, framerShadow } from "@/lib/animations";

interface Creator {
  _id: string;
  userId: string;
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  platform: "tiktok" | "instagram";
  followerCount: number;
  medianViews7d?: number;
  engagementRate?: number;
  videoCount?: number;
}

interface GridViewProps {
  creators: Creator[];
  selectedCreators?: Set<string>;
  onToggleSelect?: (creatorId: string) => void;
  onRemoveCreator?: (creatorId: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function GridView({ creators, selectedCreators, onToggleSelect, onRemoveCreator }: GridViewProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (creatorId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(creatorId)) {
      newExpanded.delete(creatorId);
    } else {
      newExpanded.add(creatorId);
    }
    setExpandedCards(newExpanded);
  };

  // Debug logging
  console.log("GridView - creators:", creators);
  console.log("GridView - creators count:", creators?.length);
  
  if (!creators || creators.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-white/60">No creators in this roster yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {creators.map((creator, index) => {
        console.log(`Creator ${index}:`, creator);
        console.log(`Creator userId:`, creator.userId);
        console.log(`Creator _id:`, creator._id);
        
        const isSelected = selectedCreators?.has(creator.userId);
        const isExpanded = expandedCards.has(creator.userId);

        return (
          <motion.div
            key={creator.userId}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              height: isExpanded ? 'auto' : '320px'
            }}
            transition={isExpanded ? framerTransitions.state : { delay: index * 0.05 }}
          >
            <Card 
              className="relative overflow-hidden border-white/10 bg-white/[0.03] group"
              style={{
                borderTopLeftRadius: '44px',
                borderTopRightRadius: '44px',
                borderBottomLeftRadius: '34px',
                borderBottomRightRadius: '34px',
                boxShadow: framerShadow
              }}
            >
              {/* Avatar/Image Section */}
              <div className="relative h-[200px] overflow-hidden">
                <Avatar className="absolute inset-0 w-full h-full rounded-none">
                  <AvatarImage 
                    src={creator.profilePictureUrl} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-4xl rounded-none">
                    {creator.displayName?.[0] || creator.username[0]}
                  </AvatarFallback>
                </Avatar>
                
                {/* Progressive Blur Effect */}
                <ProgressiveBlur blurAmount={10} />
              </div>

              {/* Always-Visible Content Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-6 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={framerTransitions.spring(0)}
              >
                {/* Title & Username - Always Visible */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0)}
                >
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {creator.displayName || creator.username}
                  </h3>
                  <p className="text-sm text-white/60 mb-3">
                    @{creator.username}
                  </p>
                </motion.div>

                {/* Platform Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0.4)}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      creator.platform === "tiktok"
                        ? "border-white/20 text-white/70"
                        : "border-pink-500/30 text-pink-400"
                    )}
                  >
                    {creator.platform}
                  </Badge>
                </motion.div>

                {/* View/Expand Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={framerTransitions.spring(0.6)}
                  className="mt-4"
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(creator.userId);
                    }}
                    size="sm"
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                  >
                    {isExpanded ? 'Close' : 'View Details'}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Expanded Content Section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={framerTransitions.state}
                    className="bg-black/20 backdrop-blur-sm p-6 rounded-b-[34px]"
                  >
                    {/* Stats Grid with Staggered Animation */}
                    <motion.div 
                      className="grid grid-cols-2 gap-4 mb-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {[
                        { label: 'Followers', value: formatNumber(creator.followerCount), icon: Users },
                        { label: 'Median Views', value: formatNumber(creator.medianViews7d || 0), icon: Eye },
                        { label: 'Engagement', value: `${creator.engagementRate?.toFixed(1) || 0}%`, icon: TrendingUp },
                        { label: 'Videos', value: creator.videoCount || 0, icon: Video }
                      ].map((stat) => (
                        <motion.div
                          key={stat.label}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <stat.icon className="w-3 h-3 text-white/60" />
                            <span className="text-xs text-white/60">{stat.label}</span>
                          </div>
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Additional Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={framerTransitions.spring(0.8)}
                      className="flex gap-2"
                    >
                      <Button size="sm" variant="secondary" className="flex-1">
                        View Profile
                      </Button>
                      <Button size="sm" variant="secondary" className="flex-1">
                        Message
                      </Button>
                      {onRemoveCreator && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Delete button clicked for creator:", creator);
                            console.log("Creator userId:", creator.userId);
                            console.log("Creator _id:", creator._id);
                            
                            if (confirm(`Remove ${creator.displayName || creator.username} from this roster?`)) {
                              console.log("Confirmed, calling onRemoveCreator with:", creator.userId);
                              onRemoveCreator(creator.userId);
                            } else {
                              console.log("Delete cancelled by user");
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection Checkbox */}
              {onToggleSelect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(creator.userId);
                  }}
                  className={cn(
                    "absolute top-3 right-3 w-5 h-5 rounded border flex items-center justify-center transition-all z-20",
                    isSelected
                      ? "bg-cyan-500 border-cyan-500"
                      : "border-white/[0.2] hover:border-white/[0.4] opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
