"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function CreatorTimeline() {
  const creatorCategories = [
    {
      title: "1. Generic Creators",
      description:
        "Broad, trend-based content that competes for attention in oversaturated spaces. These creators follow popular trends and produce general content that appeals to a wide audience but lacks deep specialization.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Reach</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Engagement</p>
            <p className="text-2xl font-bold text-white">Medium</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Trust</p>
            <p className="text-2xl font-bold text-white">Low</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Conversion</p>
            <p className="text-2xl font-bold text-white">Low</p>
          </div>
        </div>
      ),
    },
    {
      title: "2. Entertainer Creators",
      description:
        "Focus on personality, relatability, or humor to build strong parasocial followings. While they create deep connections with their audience, they often lack niche authority and specific expertise.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Reach</p>
            <p className="text-2xl font-bold text-white">Medium-High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Engagement</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Trust</p>
            <p className="text-2xl font-bold text-white">Medium</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Conversion</p>
            <p className="text-2xl font-bold text-white">Medium</p>
          </div>
        </div>
      ),
    },
    {
      title: "3. Sub-Niche Creators",
      description:
        "Deep expertise or unique perspective in a specific area. These creators command high engagement and strong loyalty within a smaller, highly targeted audience. Perfect for warm-up conversion strategies.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Reach</p>
            <p className="text-2xl font-bold text-white">Medium</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Engagement</p>
            <p className="text-2xl font-bold text-white">Very High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Trust</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Conversion</p>
            <p className="text-2xl font-bold text-white">High</p>
          </div>
        </div>
      ),
    },
    {
      title: "4. Niche Leaders",
      description:
        "Set trends and define standards for their entire category. These creators combine massive scale with deep trust and industry influence, making them the ultimate conversion drivers for your campaigns.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Reach</p>
            <p className="text-2xl font-bold text-white">Very High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Engagement</p>
            <p className="text-2xl font-bold text-white">Very High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Trust</p>
            <p className="text-2xl font-bold text-white">Very High</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Conversion</p>
            <p className="text-2xl font-bold text-white">Very High</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: "rgb(2, 6, 23)" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ letterSpacing: "-0.01em" }}>
            The Four Types of Creators
          </h2>
          <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
            Not all creators are equal. We categorize and test them systematically to maximize your campaign performance.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl">
          <Timeline
            data={creatorCategories}
            lineColor="rgb(37, 99, 235)"
            dotColor="rgba(255, 255, 255, 0.3)"
            activeDotColor="rgb(96, 165, 250)"
          />
        </div>

        {/* Bottom text */}
        <div className="mt-20 max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 p-8 border border-blue-500/30">
            <p className="text-xl text-white font-semibold">
              Every week we run A/B tests with these 4 categories in different sizes
            </p>
            <p className="text-base text-white/70 mt-3">
              This systematic approach allows us to continuously optimize your campaigns and identify which creator types drive the best results for your specific brand and objectives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
