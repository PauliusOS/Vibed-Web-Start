"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DualGlowingOrbs } from "@/components/ui/glowing-orb";
import { DemoRequestModal } from "./DemoRequestModal";
import { cn } from "@/lib/utils";

interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  description: string;
  metrics: {
    primary: { label: string; value: string };
    secondary: { label: string; value: string }[];
  };
  gradient: string;
}

export function FramerCaseStudiesSection() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  // TODO: Replace with real company data
  const caseStudies: CaseStudy[] = [
    {
      id: "client-1",
      company: "TechFlow Inc.",
      industry: "SaaS • Tech",
      description:
        "Scaled user acquisition through precision micro-targeting across 50+ creator partnerships.",
      metrics: {
        primary: { label: "New signups", value: "12K+" },
        secondary: [
          { label: "Campaign ROI", value: "425%" },
          { label: "Creators", value: "50+" },
          { label: "Ad spend", value: "$180K" },
        ],
      },
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      id: "client-2",
      company: "StyleHub",
      industry: "Fashion • Retail",
      description:
        "Drove record revenue through data-driven influencer selection and campaign optimization.",
      metrics: {
        primary: { label: "Revenue generated", value: "$2.4M" },
        secondary: [
          { label: "ROI", value: "380%" },
          { label: "Conversion rate", value: "8.2%" },
          { label: "Avg order value", value: "$156" },
        ],
      },
      gradient: "from-pink-500/20 to-purple-500/20",
    },
    {
      id: "client-3",
      company: "FitLife Nutrition",
      industry: "Health • Wellness",
      description:
        "Built engaged community and achieved viral reach with strategic creator collaborations.",
      metrics: {
        primary: { label: "Social mentions", value: "156K+" },
        secondary: [
          { label: "Campaign ROI", value: "512%" },
          { label: "Engagement rate", value: "12.8%" },
          { label: "New customers", value: "8.9K" },
        ],
      },
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: "client-4",
      company: "EdgeAI Labs",
      industry: "AI • Enterprise",
      description:
        "Generated high-quality B2B leads through targeted thought leader partnerships.",
      metrics: {
        primary: { label: "Qualified leads", value: "89" },
        secondary: [
          { label: "Pipeline ROI", value: "650%" },
          { label: "Demo conversion", value: "34%" },
          { label: "Avg deal size", value: "$47K" },
        ],
      },
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      id: "client-5",
      company: "GreenPath Energy",
      industry: "Clean Tech • Sustainability",
      description:
        "Educated market and built brand trust through authentic creator storytelling.",
      metrics: {
        primary: { label: "Community growth", value: "45K+" },
        secondary: [
          { label: "Brand awareness", value: "+68%" },
          { label: "Campaign ROI", value: "390%" },
          { label: "Content pieces", value: "127" },
        ],
      },
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background Glowing Orbs */}
      <DualGlowingOrbs size="xl" intensity="medium" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Real campaigns.
            <br />
            <span className="text-cyan-400">Real results.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto">
            See how leading brands achieved breakthrough results with data-driven
            micro-targeting and precision creator partnerships.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                // Make some cards span 2 columns for visual interest
                index === 0 || index === 3
                  ? "lg:col-span-2"
                  : "lg:col-span-1"
              )}
            >
              <CaseStudyCard
                study={study}
                onClick={() => setSelectedStudy(study)}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center"
        >
          <a
            href="/case-studies"
            className="inline-flex items-center gap-2 text-white/70 hover:text-cyan-400 transition-colors group"
          >
            <span>View all case studies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Demo Request Modal */}
      <DemoRequestModal
        isOpen={selectedStudy !== null}
        onClose={() => setSelectedStudy(null)}
        caseStudyCompany={selectedStudy?.company}
        caseStudyId={selectedStudy?.id}
      />
    </section>
  );
}

function CaseStudyCard({
  study,
  onClick,
}: {
  study: CaseStudy;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative h-full w-full p-8 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-sm hover:border-white/20 transition-all duration-300 text-left group min-h-[400px]"
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 opacity-10 bg-gradient-to-br rounded-2xl transition-opacity duration-300 group-hover:opacity-20",
          study.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {study.company}
          </h3>
          <p className="text-sm text-white/40">{study.industry}</p>
          <p className="text-white/70 text-base mt-4 leading-relaxed">
            {study.description}
          </p>
        </div>

        {/* Primary Metric - Featured */}
        <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-cyan-400/30 transition-colors">
          <p className="text-sm text-white/50 mb-2">
            {study.metrics.primary.label}
          </p>
          <p className="text-4xl md:text-5xl font-bold text-cyan-400">
            {study.metrics.primary.value}
          </p>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {study.metrics.secondary.map((metric, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs text-white/40 mb-1">{metric.label}</p>
              <p className="text-lg font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-cyan-400 group-hover:gap-3 transition-all">
          <span className="text-sm font-medium">Request demo</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}
