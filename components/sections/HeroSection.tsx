"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Avatar images from ShadCN Studio
const avatars = [
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
];

// Tech stack logos
const techLogos = [
  { name: "Next.js", icon: "N" },
  { name: "React", icon: "R" },
  { name: "Tailwind CSS", icon: "T" },
  { name: "Motion", icon: "M" },
];

// Influencer showcase data
const influencers = [
  {
    name: "Alex Rivera",
    handle: "@alexcreates",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    platform: "tiktok",
    followers: "2.4M",
    engagement: "8.2%",
  },
  {
    name: "Maya Chen",
    handle: "@mayalifestyle",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    platform: "instagram",
    followers: "890K",
    engagement: "5.7%",
  },
  {
    name: "Jordan Ellis",
    handle: "@jordantech",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    platform: "tiktok",
    followers: "1.8M",
    engagement: "9.1%",
  },
  {
    name: "Sophie Adams",
    handle: "@sophietravel",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    platform: "instagram",
    followers: "1.2M",
    engagement: "6.3%",
  },
  {
    name: "Marcus Lee",
    handle: "@marcusfits",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    platform: "tiktok",
    followers: "3.1M",
    engagement: "7.8%",
  },
  {
    name: "Emma Wilson",
    handle: "@emmacooks",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    platform: "instagram",
    followers: "650K",
    engagement: "10.2%",
  },
];

// Platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "tiktok") {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
};

// Influencer Card Component
const InfluencerCard = ({
  influencer,
  index,
}: {
  influencer: (typeof influencers)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      className={cn(
        "group relative p-4 rounded-2xl",
        "bg-white/[0.03] backdrop-blur-sm",
        "border border-white/[0.08]",
        "hover:bg-white/[0.06] hover:border-white/[0.12]",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={influencer.avatar}
            alt={influencer.name}
            width={48}
            height={48}
            className="rounded-full ring-2 ring-white/10"
          />
          <div
            className={cn(
              "absolute -bottom-1 -right-1 p-1 rounded-full",
              influencer.platform === "tiktok" ? "bg-black" : "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
            )}
          >
            <PlatformIcon platform={influencer.platform} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{influencer.name}</p>
          <p className="text-xs text-white/40 truncate">{influencer.handle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
        <div>
          <p className="text-xs text-white/40">Followers</p>
          <p className="text-sm font-semibold text-white">{influencer.followers}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">Engagement</p>
          <p className="text-sm font-semibold text-emerald-400">{influencer.engagement}</p>
        </div>
      </div>
    </motion.div>
  );
};

export function HeroSection() {
  return (
    <section id="hero" className="relative w-full bg-background overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] rounded-full bg-gradient-to-b from-white/[0.02] via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[400px] rounded-full bg-gradient-to-l from-emerald-500/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 md:pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/70">
                  Now tracking 10K+ creator campaigns
                </span>
                <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            >
              Build world class
              <br />
              campaigns at{" "}
              <span className="relative inline-block">
                <span className="relative z-10">warp speed</span>
                {/* Gradient border highlight */}
                <span className="absolute -inset-1 rounded-lg border border-dashed border-white/20" />
                <span className="absolute -inset-1 rounded-lg bg-white/[0.03]" />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-white/50 max-w-xl mb-10 leading-relaxed"
            >
              Access an ever-growing network of premium creators. Save time and
              focus on what matters—building campaigns that captivate your audience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-sm font-medium rounded-full bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/30"
                >
                  Explore Features
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  className="h-12 px-6 text-sm font-medium rounded-full bg-white text-black hover:bg-white/90"
                >
                  Get Started Free
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof Section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-6"
            >
              {/* Avatar Stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {avatars.map((avatar, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-black overflow-hidden"
                    >
                      <Image
                        src={avatar}
                        alt={`User ${i + 1}`}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-white/40">
                  Trusted by Founders and Entrepreneurs
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-white/10" />

              {/* Tech Stack Logos */}
              <div className="flex items-center gap-4">
                {techLogos.map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-white/40"
                  >
                    <span className="text-sm font-medium">{tech.icon}</span>
                    <span className="text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Influencer Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:pt-8"
          >
            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-4"
            >
              <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                Featured Creators
              </span>
            </motion.div>

            {/* Influencer Grid */}
            <div className="grid grid-cols-2 gap-4">
              {influencers.map((influencer, index) => (
                <InfluencerCard key={influencer.handle} influencer={influencer} index={index} />
              ))}
            </div>

            {/* Bottom Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-white">10K+</p>
                  <p className="text-xs text-white/40">Creators</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-white">500M+</p>
                  <p className="text-xs text-white/40">Total Reach</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-emerald-400">8.5%</p>
                  <p className="text-xs text-white/40">Avg. Engagement</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
