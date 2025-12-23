"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import {
  IconUsers,
  IconMessageCircle,
  IconPhoto,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconChevronRight,
} from "@tabler/icons-react";

// Mock creator roster data
const creatorRoster = [
  {
    name: "Emma Johnson",
    handle: "@stylebyemma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    platform: "instagram",
    followers: "2.4M",
    niche: "Fashion",
    location: "Los Angeles",
    tags: ["lifestyle", "fashion", "travel"],
  },
  {
    name: "Alex Chen",
    handle: "@techreviewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    platform: "youtube",
    followers: "890K",
    niche: "Tech",
    location: "San Francisco",
    tags: ["tech", "reviews", "gadgets"],
  },
  {
    name: "Sarah Miller",
    handle: "@fitnessguru",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    platform: "tiktok",
    followers: "3.1M",
    niche: "Fitness",
    location: "Miami",
    tags: ["fitness", "wellness", "nutrition"],
  },
  {
    name: "Marcus Brown",
    handle: "@foodiefaves",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    platform: "instagram",
    followers: "1.2M",
    niche: "Food",
    location: "New York",
    tags: ["food", "restaurants", "recipes"],
  },
];

// Mock engagement/comments
const engagementData = [
  { user: "@fashionlover", comment: "Love this look! Where is the jacket from?", sentiment: "positive" },
  { user: "@techfan2024", comment: "Great review, very detailed!", sentiment: "positive" },
  { user: "@fitlife_jane", comment: "This workout changed my routine", sentiment: "positive" },
  { user: "@skeptic_steve", comment: "Not sure about the price point", sentiment: "neutral" },
];

// Mock creator showcase cards
const showcaseCards = [
  {
    title: "Summer Collection Launch",
    creator: "@stylebyemma",
    image: "https://picsum.photos/seed/summer/400/300",
    stats: { views: "2.4M", engagement: "8.2%" },
  },
  {
    title: "Tech Unboxing Series",
    creator: "@techreviewer",
    image: "https://picsum.photos/seed/tech/400/300",
    stats: { views: "1.8M", engagement: "6.7%" },
  },
  {
    title: "30-Day Fitness Challenge",
    creator: "@fitnessguru",
    image: "https://picsum.photos/seed/fitness/400/300",
    stats: { views: "3.1M", engagement: "9.1%" },
  },
  {
    title: "Restaurant Reviews NYC",
    creator: "@foodiefaves",
    image: "https://picsum.photos/seed/food/400/300",
    stats: { views: "890K", engagement: "7.5%" },
  },
];

const platformIcons: { [key: string]: React.ReactNode } = {
  tiktok: <IconBrandTiktok className="w-4 h-4" />,
  instagram: <IconBrandInstagram className="w-4 h-4" />,
  youtube: <IconBrandYoutube className="w-4 h-4" />,
};

function SectionBadge({ icon: Icon, label }: { icon: typeof IconUsers; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
      <Icon className="w-3.5 h-3.5 text-white/50" />
      <span className="text-[12px] font-medium text-white/50 tracking-wide">{label}</span>
    </div>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] font-medium text-white/50 border border-white/[0.04]">
      {label}
    </span>
  );
}

function CreatorRosterTable() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
        <h4 className="font-medium text-[14px] text-white/90">Creator Roster</h4>
        <button className="text-[12px] text-white/40 hover:text-white/60 flex items-center gap-1 transition-colors duration-300">
          View all <IconChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Followers
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Niche
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {creatorRoster.map((creator, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors duration-300">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-white/90">{creator.name}</p>
                      <p className="text-[11px] text-white/40">{creator.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-white/40">
                    {platformIcons[creator.platform]}
                    <span className="text-[12px] capitalize">{creator.platform}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-white/70">{creator.followers}</td>
                <td className="px-4 py-3 text-[12px] text-white/50">{creator.niche}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {creator.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EngagementCard() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <IconMessageCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">Social Listening</h4>
          <p className="text-[12px] text-white/40">Real-time engagement</p>
        </div>
      </div>
      <div className="space-y-2">
        {engagementData.map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium text-white/50">{item.user}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  item.sentiment === "positive"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/[0.04] text-white/40"
                }`}
              >
                {item.sentiment}
              </span>
            </div>
            <p className="text-[12px] text-white/60">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowcaseCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <IconPhoto className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-[14px] text-white/90">Creator Showcase</h4>
            <p className="text-[12px] text-white/40">Top performing content</p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {showcaseCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[280px] snap-start"
          >
            <div className="relative rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/[0.06] group">
              <div className="aspect-[4/3] relative">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02] opacity-80 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[14px] text-white/90 font-medium mb-0.5">{card.title}</p>
                <p className="text-[12px] text-white/40 mb-3">{card.creator}</p>
                <div className="flex gap-4 text-[12px]">
                  <span className="text-white/40">
                    <span className="text-white/70 font-medium">{card.stats.views}</span> views
                  </span>
                  <span className="text-white/40">
                    <span className="text-white/70 font-medium">{card.stats.engagement}</span> eng
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CommunityShowcase() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-white/[0.02] via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <SectionBadge icon={IconUsers} label="Community" />
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-[44px] font-medium text-white tracking-[-0.02em] leading-[1.15]">
            Your creator network is essential
            <br />
            <span className="text-white/50">to your campaign success.</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/50 max-w-xl mx-auto leading-[1.7]">
            Manage relationships, track performance, and build lasting partnerships
            with creators who drive results.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["Content Tracking", "Engagement Metrics", "Creator CRM", "Performance History", "Collaboration Tools"].map(
              (label) => (
                <FeaturePill key={label} label={label} />
              )
            )}
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <CreatorRosterTable />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <EngagementCard />
          </motion.div>
        </div>

        {/* Showcase carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShowcaseCarousel />
        </motion.div>
      </div>
    </section>
  );
}
