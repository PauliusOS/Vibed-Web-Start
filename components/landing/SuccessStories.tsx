"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { IconTrophy, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { cn } from "@/lib/utils";

// Success story data
const successStories = [
  {
    client: "TechBrand",
    title: "Summer Product Launch",
    image: "https://picsum.photos/seed/tech-launch/600/400",
    metrics: [
      { label: "Impressions", value: "55M" },
      { label: "Engagement Rate", value: "12.4%" },
      { label: "Conversions", value: "28K" },
      { label: "ROI", value: "4.2x" },
    ],
    quote: "OPA transformed how we approach creator marketing.",
  },
  {
    client: "FashionCo",
    title: "Fall Collection",
    image: "https://picsum.photos/seed/fashion-fall/600/400",
    metrics: [
      { label: "Total Views", value: "32M" },
      { label: "New Signups", value: "4.2K" },
      { label: "Sales Lift", value: "+180%" },
      { label: "Brand Mentions", value: "15K" },
    ],
    quote: "Best campaign performance we've ever seen.",
  },
  {
    client: "FitnessPro",
    title: "New Year Challenge",
    image: "https://picsum.photos/seed/fitness-new/600/400",
    metrics: [
      { label: "Video Views", value: "78M" },
      { label: "App Downloads", value: "125K" },
      { label: "Engagement", value: "9.8%" },
      { label: "Revenue", value: "$2.1M" },
    ],
    quote: "Exceeded all our KPIs in just 6 weeks.",
  },
  {
    client: "BeautyBrand",
    title: "Influencer Partnership",
    image: "https://picsum.photos/seed/beauty-brand/600/400",
    metrics: [
      { label: "Reach", value: "42M" },
      { label: "UGC Created", value: "850+" },
      { label: "Store Visits", value: "+220%" },
      { label: "Social Growth", value: "+45K" },
    ],
    quote: "OPA made scaling our creator program effortless.",
  },
  {
    client: "GameStudio",
    title: "Game Launch Campaign",
    image: "https://picsum.photos/seed/game-launch/600/400",
    metrics: [
      { label: "Streams", value: "12K+" },
      { label: "Peak Viewers", value: "180K" },
      { label: "Pre-orders", value: "95K" },
      { label: "Chart Position", value: "#1" },
    ],
    quote: "Our most successful game launch ever.",
  },
];

function SectionBadge({ icon: Icon, label }: { icon: typeof IconTrophy; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-pulse" />
      <span className="text-[12px] font-medium text-white/50 tracking-wide">{label}</span>
    </div>
  );
}

function StoryCard({ story, index = 0 }: { story: (typeof successStories)[0]; index?: number }) {
  return (
    <div className={cn(
      "relative w-[320px] md:w-[360px] flex-shrink-0 rounded-2xl overflow-hidden group",
      "bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/[0.06]",
      "hover:border-white/[0.12] transition-all duration-500"
    )}>
      {/* Background image */}
      <div className="aspect-[4/3] relative">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.03] opacity-70 group-hover:opacity-85"
        />
        {/* Enhanced gradient overlay for liquid glass feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        {/* Top shine effect */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Client badge */}
        <div className="mb-3">
          <span className="px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-[10px] font-medium text-white/70">
            {story.client}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-medium text-white/90 mb-3">{story.title}</h3>

        {/* Metrics grid with glass effect */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.04]">
          {story.metrics.map((metric, i) => (
            <div key={i} className="p-1">
              <EncryptedText
                text={metric.value}
                className="text-[17px] font-semibold text-white/90"
                revealDelayMs={40 + i * 20}
                flipDelayMs={25}
                charset="0123456789KM+%$xB"
                encryptedClassName="text-white/40"
                revealedClassName="text-white/90"
              />
              <p className="text-[10px] text-white/40 mt-0.5">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <p className="text-[12px] text-white/50 italic">&ldquo;{story.quote}&rdquo;</p>
      </div>

      {/* Liquid glass border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
      </div>
    </div>
  );
}

export function SuccessStories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="stories" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Spotlight effects for liquid glass ambiance */}
      <Spotlight
        className="-top-20 left-0"
        fill="rgba(251, 191, 36, 0.02)"
      />
      <Spotlight
        className="top-40 right-0"
        fill="rgba(255, 255, 255, 0.02)"
      />

      {/* Enhanced ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/[0.02] via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-white/[0.02] via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <SectionBadge icon={IconTrophy} label="Success Stories" />
            <div className="mt-6">
              <TextGenerateEffect
                words="Powering thousands of campaigns, daily."
                className="!text-3xl md:!text-4xl lg:!text-[44px] !font-medium !tracking-[-0.02em] !leading-[1.15]"
                duration={0.4}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 text-[16px] text-white/50 max-w-lg leading-[1.7]"
            >
              See how leading brands achieve exceptional results with OPA&apos;s
              creator marketing platform.
            </motion.p>
          </div>

          {/* Navigation buttons with glass effect */}
          <div className="flex gap-2 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <IconChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <IconChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-6 px-6"
          >
            {successStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="snap-start"
              >
                <StoryCard story={story} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats bar with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Campaigns Launched" },
              { value: "$50M+", label: "Creator Payments" },
              { value: "10K+", label: "Active Creators" },
              { value: "2B+", label: "Total Impressions" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <EncryptedText
                  text={stat.value}
                  className="text-2xl md:text-3xl font-semibold text-white/90"
                  revealDelayMs={50 + i * 30}
                  flipDelayMs={30}
                  charset="0123456789KMB+$"
                  encryptedClassName="text-white/40"
                  revealedClassName="text-white/90"
                />
                <p className="text-[12px] text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
