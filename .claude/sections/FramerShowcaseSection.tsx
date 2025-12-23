"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Type definition for showcase items
interface ShowcaseItem {
  id: string;
  name: string; // Record label name
  subtitle: string; // Artist • Song
  gradient: string; // Tailwind gradient classes
  logoText: string; // Logo badge text
  metrics: {
    primaryValue: string;
    primaryLabel: string;
    secondaryValue: string;
    secondaryLabel: string;
    achievement?: string;
  };
}

// Mock data matching cobrand.com style
const showcaseItems: ShowcaseItem[] = [
  {
    id: "1",
    name: "RCA Records",
    subtitle: "Myles Smith • Stargazing",
    gradient: "from-amber-500/20 to-orange-600/20",
    logoText: "RCA",
    metrics: {
      primaryValue: "55M",
      primaryLabel: "Impressions",
      secondaryValue: "3.7M",
      secondaryLabel: "Likes",
      achievement: "#5 Single"
    }
  },
  {
    id: "2",
    name: "Method Music",
    subtitle: "Disclosure • Drop Links",
    gradient: "from-rose-500/20 to-pink-600/20",
    logoText: "MM",
    metrics: {
      primaryValue: "300",
      primaryLabel: "Sold Out Tickets",
      secondaryValue: "8K+",
      secondaryLabel: "Total Signups",
      achievement: "5K"
    }
  },
  {
    id: "3",
    name: "NotThat Records",
    subtitle: "Chase & Status • BACKBONE",
    gradient: "from-cyan-500/20 to-blue-600/20",
    logoText: "NTR",
    metrics: {
      primaryValue: "4K+",
      primaryLabel: "Total Drop Sign Ups",
      secondaryValue: "10M",
      secondaryLabel: "UGC Story Views",
      achievement: "#1 Single"
    }
  },
  {
    id: "4",
    name: "Atlantic Records",
    subtitle: "Ed Sheeran • Eyes Closed",
    gradient: "from-purple-500/20 to-violet-600/20",
    logoText: "ATL",
    metrics: {
      primaryValue: "82M",
      primaryLabel: "Impressions",
      secondaryValue: "5.2M",
      secondaryLabel: "Likes",
      achievement: "#2 Single"
    }
  },
  {
    id: "5",
    name: "Columbia Records",
    subtitle: "Harry Styles • As It Was",
    gradient: "from-emerald-500/20 to-teal-600/20",
    logoText: "COL",
    metrics: {
      primaryValue: "120M",
      primaryLabel: "Impressions",
      secondaryValue: "8.9M",
      secondaryLabel: "Likes",
      achievement: "#1 Single"
    }
  },
  {
    id: "6",
    name: "Republic Records",
    subtitle: "Taylor Swift • Anti-Hero",
    gradient: "from-indigo-500/20 to-purple-600/20",
    logoText: "REP",
    metrics: {
      primaryValue: "95M",
      primaryLabel: "Impressions",
      secondaryValue: "6.4M",
      secondaryLabel: "Likes",
      achievement: "#1 Single"
    }
  }
];

// Hero Heading Component
function ShowcaseHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
        Powering thousands of campaigns, daily.
      </h2>
    </motion.div>
  );
}

// Showcase Grid Component
function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <ShowcaseCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

// Showcase Card Component
function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-sm overflow-hidden group cursor-pointer"
    >
      {/* Logo Badge (top-left corner) */}
      <div className="absolute top-6 left-6 z-10">
        <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-sm font-bold text-white">{item.logoText}</span>
        </div>
      </div>

      {/* Gradient Placeholder "Image" */}
      <div className={cn(
        "relative aspect-[4/3] overflow-hidden",
        "bg-gradient-to-br",
        item.gradient
      )}>
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Name/Subtitle Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-white/90">{item.name}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">
            {item.subtitle}
          </h3>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Primary Metric */}
          <div>
            <p className="text-3xl font-bold text-white">
              {item.metrics.primaryValue}
            </p>
            <p className="text-xs text-white/40 mt-1">{item.metrics.primaryLabel}</p>
          </div>

          {/* Secondary Metric */}
          <div>
            <p className="text-3xl font-bold text-white">
              {item.metrics.secondaryValue}
            </p>
            <p className="text-xs text-white/40 mt-1">{item.metrics.secondaryLabel}</p>
          </div>

          {/* Achievement Badge */}
          {item.metrics.achievement && (
            <div>
              <p className="text-lg font-bold text-white">
                {item.metrics.achievement}
              </p>
              <p className="text-xs text-white/40 mt-1">Achievement</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Main Export Component
export function FramerShowcaseSection() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-black overflow-hidden">
      <ShowcaseHero />
      <ShowcaseGrid items={showcaseItems} />
    </section>
  );
}
