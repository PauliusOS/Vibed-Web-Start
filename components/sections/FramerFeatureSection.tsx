"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingOrb } from "@/components/ui/glowing-orb";

interface FeatureItem {
  title: string;
  description: string;
  cta: { label: string; href: string };
  visual: React.ReactNode;
}

interface FramerFeatureSectionProps {
  feature: FeatureItem;
  index: number;
  className?: string;
}

/**
 * FramerFeatureSection - A single feature section with alternating layout
 *
 * Features:
 * - Alternates text left/right based on index
 * - Bold headline with muted description
 * - Arrow CTA link
 * - Visual showcase with glowing orb behind
 */
export function FramerFeatureSection({
  feature,
  index,
  className,
}: FramerFeatureSectionProps) {
  const isEven = index % 2 === 0;

  return (
    <section
      className={cn(
        "relative w-full py-24 md:py-32 overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            !isEven && "lg:grid-flow-dense"
          )}
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(!isEven && "lg:col-start-2")}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {feature.title}
            </h2>
            <p className="mt-6 text-lg text-white/50 leading-relaxed max-w-lg">
              {feature.description}
            </p>
            <Link
              href={feature.cta.href}
              className="inline-flex items-center gap-2 mt-8 text-white font-medium hover:gap-3 transition-all group"
            >
              {feature.cta.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative",
              !isEven && "lg:col-start-1 lg:row-start-1"
            )}
          >
            {/* Glowing Orb Background */}
            <div className="absolute inset-0 -m-20 pointer-events-none">
              <GlowingOrb
                position={isEven ? "right" : "left"}
                size="lg"
                intensity="high"
              />
            </div>

            {/* Visual Container */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-sm overflow-hidden">
              {feature.visual}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * FramerFeaturesGrid - Multiple feature sections stacked
 */
interface FramerFeaturesGridProps {
  features: FeatureItem[];
  className?: string;
}

export function FramerFeaturesGrid({
  features,
  className,
}: FramerFeaturesGridProps) {
  return (
    <div id="features" className={cn("bg-black", className)}>
      {features.map((feature, index) => (
        <FramerFeatureSection
          key={index}
          feature={feature}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * Pre-built feature visual components
 */

// Metrics Preview Card
export function MetricsPreviewVisual() {
  const metrics = [
    { label: "Live Visitors", value: "127", isLive: true },
    { label: "Total Views", value: "45,892" },
    { label: "Unique Visitors", value: "31,456" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-6">
        <span className="text-sm text-white/60">Overview</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-1.5">
              {metric.isLive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span className="text-xs text-white/40">{metric.label}</span>
            </div>
            <span className="text-2xl font-semibold text-white">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      {/* Mini chart placeholder */}
      <div className="mt-6 h-32 rounded-lg bg-gradient-to-t from-cyan-500/10 to-transparent relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C50,70 100,85 150,60 C200,35 250,50 300,40 C350,30 380,45 400,35"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <path
            d="M0,90 C50,85 100,90 150,80 C200,70 250,75 300,65 C350,55 380,60 400,55"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

// Data Table Preview
export function DataTablePreviewVisual() {
  const data = [
    { page: "Home", views: "1.8M" },
    { page: "/pricing", views: "156K" },
    { page: "/gallery", views: "91K" },
    { page: "/updates", views: "44K" },
    { page: "/features/design", views: "39K" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white/80">Pages</span>
        <span className="text-xs text-white/40">All</span>
      </div>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-sm text-white/70">{item.page}</span>
            </div>
            <span className="text-sm text-white/60">{item.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Creator Grid Preview
export function CreatorGridPreviewVisual() {
  const creators = [
    { name: "Alex Rivera", followers: "2.4M", engagement: "8.2%" },
    { name: "Maya Chen", followers: "890K", engagement: "5.7%" },
    { name: "Jordan Ellis", followers: "1.8M", engagement: "9.1%" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white/80">Top Creators</span>
        <span className="text-xs text-cyan-400">View all</span>
      </div>
      <div className="space-y-3">
        {creators.map((creator, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
              <div>
                <span className="text-sm font-medium text-white">
                  {creator.name}
                </span>
                <span className="block text-xs text-white/40">
                  {creator.followers} followers
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-400">
              {creator.engagement}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
