"use client";

import React from "react";
import { motion } from "motion/react";
import { Feature } from "@/components/ui/feature-slideshow";

export function ServicesSection() {
  const serviceFeatures = [
    {
      id: 1,
      title: "Creator Discovery & Matching",
      content: "AI-powered matching algorithm identifies the perfect creators for your brand across all four categories—from Generic to Niche Leaders. Audience alignment analysis, engagement quality scoring, and brand fit assessment.",
      image: "/placeholder-discovery.svg"
    },
    {
      id: 2,
      title: "Campaign Strategy & Planning",
      content: "We design your complete 4-week campaign strategy, including creator mix, content guidelines, and conversion optimization tactics. 4-week phased approach with creator category sequencing.",
      image: "/placeholder-strategy.svg"
    },
    {
      id: 3,
      title: "Performance Analytics & Optimization",
      content: "Real-time tracking of every metric that matters. From reach and engagement to conversions and ROI, we monitor it all with real-time dashboards and custom reporting.",
      image: "/placeholder-analytics.svg"
    },
    {
      id: 4,
      title: "A/B Testing & Iteration",
      content: "Weekly A/B tests across creator categories and sizes. Continuous optimization based on performance data to maximize results with performance-based pivots.",
      image: "/placeholder-testing.svg"
    },
    {
      id: 5,
      title: "Content Approval & Management",
      content: "Streamlined workflows for content review, approval, and publishing. Maintain brand consistency while empowering creator authenticity with approval workflows.",
      image: "/placeholder-content.svg"
    },
    {
      id: 6,
      title: "Scaling & Growth Strategy",
      content: "As we identify what works, we scale it aggressively. Double down on winning creator categories and expand successful campaigns with performance-based scaling.",
      image: "/placeholder-scaling.svg"
    }
  ];

  return (
    <section
      id="services"
      className="flex flex-col items-center justify-center w-full relative py-12 md:py-20 bg-tech-black"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="text-center mb-12 max-w-3xl px-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
          What We Do
        </h2>
        <p className="text-white/70 text-lg font-medium">
          End-to-end influencer marketing services designed to deliver measurable results
        </p>
      </motion.div>

      {/* Feature Slideshow - Auto-rotating every 5 seconds */}
      <div className="w-full h-full lg:h-[450px] flex items-center justify-center">
        <Feature
          collapseDelay={5000}
          linePosition="bottom"
          featureItems={serviceFeatures}
          lineColor="bg-blue-500"
        />
      </div>
    </section>
  );
}
