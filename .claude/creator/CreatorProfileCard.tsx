"use client";

import { motion } from "motion/react";
import { Users, Flame, TrendingUp, ExternalLink, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CreatorProfile {
  platform: "instagram" | "tiktok";
  username: string;
  profileUrl: string;
  followerCount: number;
  lastAnalyzedAt: number;
}

interface CreatorProfileCardProps {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  };
  creatorProfiles?: CreatorProfile[] | null;
  insights?: {
    totalFollowers?: number;
    avgEngagementRate?: number;
  };
  streak?: {
    currentStreak: number;
    longestStreak: number;
  };
}

export function CreatorProfileCard({
  user,
  creatorProfiles,
  insights,
  streak,
}: CreatorProfileCardProps) {
  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || "Creator";

  const totalFollowers = insights?.totalFollowers || 0;
  const engagementRate = insights?.avgEngagementRate || 0;
  const currentStreak = streak?.currentStreak || 0;
  const isStreakActive = currentStreak > 0;

  // Calculate goal completion percentage (example: toward 10K followers)
  const goalTarget = 10000;
  const goalProgress = Math.min((totalFollowers / goalTarget) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-400"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

      {/* Content */}
      <div className="relative p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-center lg:justify-between">

          {/* Left: Avatar Section */}
          <div className="flex-shrink-0">
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-2xl opacity-60" />

              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-full border-2 border-white/[0.1] bg-white/[0.02] overflow-hidden">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <span className="text-2xl font-bold text-white/80">
                      {fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Active streak indicator */}
              {isStreakActive && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 border-2 border-background flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Flame className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Middle: Creator Info & Platforms */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 flex-1 text-center lg:text-left min-w-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name */}
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-white/90 tracking-tight">
                {fullName}
              </h2>
              <p className="text-xs text-white/40 mt-0.5">Content Creator</p>
            </div>

            {/* Platform Badges */}
            <div className="flex items-center gap-2 justify-center lg:justify-start flex-wrap flex-1">
              {creatorProfiles && creatorProfiles.length > 0 ? (
                creatorProfiles.map((profile, index) => (
                  <motion.a
                    key={index}
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {profile.platform === "instagram" ? (
                      <Instagram className="h-3.5 w-3.5 text-pink-400" />
                    ) : (
                      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                    )}
                    <span className="text-xs font-medium text-white/70 group-hover:text-white/90">
                      @{profile.username}
                    </span>
                    <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white/60" />
                  </motion.a>
                ))
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-xs text-white/40">No profiles connected</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Key Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Followers */}
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors min-w-[90px]">
              <div className="flex items-center gap-1 mb-0.5">
                <Users className="h-3 w-3 text-cyan-400" />
                <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">Followers</span>
              </div>
              <p className="text-base font-bold text-white/90 font-mono">
                {totalFollowers >= 1000000
                  ? `${(totalFollowers / 1000000).toFixed(1)}M`
                  : totalFollowers >= 1000
                  ? `${(totalFollowers / 1000).toFixed(1)}K`
                  : totalFollowers.toLocaleString()}
              </p>
            </div>

            {/* Streak */}
            <div className={cn(
              "p-2 rounded-lg border transition-colors min-w-[90px]",
              isStreakActive
                ? "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
            )}>
              <div className="flex items-center gap-1 mb-0.5">
                <Flame className={cn(
                  "h-3 w-3",
                  isStreakActive ? "text-orange-400" : "text-white/30"
                )} />
                <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">Streak</span>
              </div>
              <p className={cn(
                "text-base font-bold font-mono truncate",
                isStreakActive ? "text-orange-400" : "text-white/40"
              )}>
                {currentStreak}d
              </p>
            </div>

            {/* Engagement */}
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors min-w-[90px]">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-3 w-3 text-blue-400" />
                <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">Engage</span>
              </div>
              <p className="text-base font-bold text-white/90 font-mono">
                {engagementRate.toFixed(1)}%
              </p>
            </div>

            {/* Goal Progress */}
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors min-w-[90px]">
              <div className="flex items-center gap-1 mb-0.5">
                <svg className="h-3 w-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">Goal</span>
              </div>
              <p className="text-base font-bold text-white/90 font-mono">
                {goalProgress.toFixed(0)}%
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom shine line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-400" />
    </motion.div>
  );
}
