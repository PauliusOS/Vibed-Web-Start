"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, TrendingUp, Video } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ListViewProps {
  creators: Creator[];
  selectedCreators?: Set<string>;
  onToggleSelect?: (creatorId: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function ListView({ creators, selectedCreators, onToggleSelect }: ListViewProps) {
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
    <div className="space-y-2">
      {creators.map((creator, index) => {
        const isSelected = selectedCreators?.has(creator.userId);

        return (
          <motion.div
            key={creator.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  {onToggleSelect && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(creator.userId)}
                      className="border-white/30 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                    />
                  )}

                  {/* Avatar */}
                  <Avatar className="h-12 w-12 ring-2 ring-white/10">
                    <AvatarImage src={creator.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {creator.displayName?.[0] || creator.username[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white truncate">
                        {creator.displayName || creator.username}
                      </h3>
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
                    </div>
                    <p className="text-sm text-white/50 truncate">@{creator.username}</p>
                  </div>

                  {/* Metrics */}
                  <div className="hidden md:flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-white">
                        {formatNumber(creator.followerCount)}
                      </div>
                      <div className="text-white/40 text-xs">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {creator.medianViews7d ? formatNumber(creator.medianViews7d) : "0"}
                      </div>
                      <div className="text-white/40 text-xs">Median Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {creator.engagementRate
                          ? creator.engagementRate.toFixed(1) + "%"
                          : "0%"}
                      </div>
                      <div className="text-white/40 text-xs">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {creator.videoCount || 0}
                      </div>
                      <div className="text-white/40 text-xs">Videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
