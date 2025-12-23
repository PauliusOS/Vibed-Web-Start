"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { EncryptedText } from "@/components/ui/encrypted-text";

interface FloatingCardProps {
  username: string;
  platform: "tiktok" | "instagram" | "youtube";
  avatarUrl?: string;
  followerCount?: number;
  thumbnailUrl?: string;
  className?: string;
  delay?: number;
}

const platformConfig = {
  tiktok: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    color: "bg-black text-white",
    gradient: "from-[#ff0050] via-[#00f2ea] to-[#ff0050]",
  },
  instagram: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
  },
  youtube: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: "bg-red-600 text-white",
    gradient: "from-red-600 to-red-700",
  },
};

function formatFollowerCount(count?: number): string {
  if (!count) return "0";
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function FloatingCard({
  username,
  platform,
  avatarUrl,
  followerCount,
  thumbnailUrl,
  className,
  delay = 0,
}: FloatingCardProps) {
  const config = platformConfig[platform];

  // Generate a placeholder thumbnail if none provided
  const displayThumbnail = thumbnailUrl || `https://picsum.photos/seed/${username}/300/400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn("w-[160px] md:w-[180px]", className)}
    >
      <CardSpotlight
        radius={200}
        color="rgba(255, 255, 255, 0.03)"
        className={cn(
          "!p-0 !bg-[#0A0A0A]/80 !backdrop-blur-xl !border-white/[0.06]",
          "aspect-[3/4] cursor-pointer group relative overflow-hidden"
        )}
      >
        {/* Thumbnail Image */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src={displayThumbnail}
            alt={`@${username}'s content`}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-[1.03] opacity-75 group-hover:opacity-90"
            sizes="180px"
          />
          {/* Enhanced gradient overlay for liquid glass feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
          {/* Top shine effect */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Platform Badge with glass effect */}
        <div className="absolute top-2.5 left-2.5 z-[2]">
          <div className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/[0.08] text-white/90 shadow-lg">
            {config.icon}
          </div>
        </div>

        {/* Follower Count Badge with Encrypted Text */}
        <div className="absolute top-2.5 right-2.5 z-[2]">
          <div className="px-2.5 py-1.5 bg-black/40 backdrop-blur-md border border-white/[0.08] rounded-lg shadow-lg">
            <EncryptedText
              text={formatFollowerCount(followerCount)}
              className="text-[11px] font-semibold text-white/90 tracking-wide"
              revealDelayMs={40}
              flipDelayMs={30}
              charset="0123456789KMkm."
              encryptedClassName="text-white/40"
              revealedClassName="text-white/90"
            />
          </div>
        </div>

        {/* Bottom Info with enhanced glass */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-[2]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/[0.06]">
            {avatarUrl && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-lg">
                <Image
                  src={avatarUrl}
                  alt={username}
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white/95 text-[12px] font-medium truncate">
                @{username}
              </p>
            </div>
          </div>
        </div>

        {/* Liquid glass border glow on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-[3]">
          <div className="absolute inset-0 rounded-xl border border-white/[0.15]" />
          <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
        </div>
      </CardSpotlight>
    </motion.div>
  );
}
