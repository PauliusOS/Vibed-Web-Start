"use client";

import { motion } from "motion/react";
import { GlowingOrb } from "@/components/ui/glowing-orb";
import { cn } from "@/lib/utils";

// Type definitions
interface TimelineStep {
  number: number;
  title: string;
  description: string;
}

// Step data - Part 1: Narrative Engine Pipeline
const narrativePipelineSteps: TimelineStep[] = [
  {
    number: 1,
    title: "Create Core Narrative",
    description:
      "Build the foundational story the campaign is built around.",
  },
  {
    number: 2,
    title: "Tailor Narrative to Creator Groups",
    description:
      "Adapt the core narrative to each cluster/segment of creators.",
  },
  {
    number: 3,
    title: "Tailor to Specific Creators",
    description:
      "Refine it further so each individual creator gets a narrative aligned with their tone, style, audience, and past performance.",
  },
  {
    number: 4,
    title: "A/B Test Narratives",
    description:
      "Run variations across groups to identify the best-performing framing.",
  },
  {
    number: 5,
    title: "Feedback Loop",
    description:
      "Use performance data from A/B tests to refine group-level narratives.",
  },
  {
    number: 6,
    title: "Apply Improvements & Repeat",
    description:
      "Iterate until the optimal narrative is found for each creator and group.",
  },
];

// Step data - Part 2: Narrative Manipulation Layer (Hijack Engine)
const hijackEngineSteps: TimelineStep[] = [
  {
    number: 7,
    title: "Hijack an Existing Narrative",
    description:
      "Tap into an already-trending or culturally familiar story.",
  },
  {
    number: 8,
    title: "Insert Consequences (Fear Factor)",
    description:
      "Introduce stakes—what happens if the audience does not act.",
  },
  {
    number: 9,
    title: "Insert Proof",
    description:
      "Provide evidence, validation, or social proof supporting the narrative.",
  },
  {
    number: 10,
    title: "Normalisation",
    description:
      "Frame the message as expected, accepted, and natural within the creator's audience culture.",
  },
];

// Easing curve consistent with site
const easing = [0.16, 1, 0.3, 1] as const;

/**
 * StepNumberBadge - Circular badge with gradient and glow effect
 */
function StepNumberBadge({
  number,
  index,
}: {
  number: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1 + 0.2,
        ease: easing,
      }}
      viewport={{ once: true }}
      className="relative z-10 flex-shrink-0"
    >
      <div
        className={cn(
          "w-12 h-12 md:w-16 md:h-16 rounded-full",
          "bg-gradient-to-br from-cyan-400 to-blue-500",
          "flex items-center justify-center",
          "text-white font-bold text-lg md:text-xl",
          "shadow-[0_0_30px_rgba(56,189,248,0.4)]",
          "border-4 border-black"
        )}
      >
        {number}
      </div>
    </motion.div>
  );
}

/**
 * TimelineSteps - Renders a vertical timeline with steps
 */
function TimelineSteps({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative">
      {/* Vertical gradient line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 to-blue-500" />

      {/* Steps */}
      <div className="space-y-12 md:space-y-16">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: easing,
            }}
            viewport={{ once: true }}
            className="relative flex items-start gap-6 md:gap-12"
          >
            {/* Step Number Badge */}
            <StepNumberBadge number={step.number} index={index} />

            {/* Step Content */}
            <div className="flex-1 pb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * TimelinePartDivider - Visual separator between pipeline parts
 */
function TimelinePartDivider({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: easing }}
      className="relative py-12 md:py-16"
    >
      {/* Horizontal gradient line */}
      <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />

      {/* Central badge */}
      <div className="relative flex justify-center">
        <div
          className={cn(
            "bg-black px-6 py-3 rounded-full",
            "border-2 border-cyan-400/30",
            "shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          )}
        >
          <span className="text-cyan-400 font-semibold text-sm md:text-base uppercase tracking-wide">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * NarrativeEngineTimeline - Main section component
 *
 * Displays the 10-step Narrative Engine Pipeline & Hijack Structure
 * with smooth animations, glowing orbs, and premium styling.
 */
export function NarrativeEngineTimeline({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative w-full py-24 md:py-32 bg-black overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Background Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb
            position="left"
            size="lg"
            intensity="medium"
            className="top-[20%]"
          />
          <GlowingOrb
            position="right"
            size="lg"
            intensity="medium"
            className="top-[70%]"
          />
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            The Narrative Engine
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed">
            A systematic approach to narrative creation and manipulation that
            transforms campaign storytelling into a data-driven science.
          </p>
        </motion.div>

        {/* Part 1: Narrative Engine Pipeline */}
        <div className="relative z-10">
          <TimelineSteps steps={narrativePipelineSteps} />
        </div>

        {/* Visual Divider */}
        <div className="relative z-10">
          <TimelinePartDivider label="Narrative Manipulation Layer (Hijack Engine)" />
        </div>

        {/* Part 2: Hijack Engine */}
        <div className="relative z-10">
          <TimelineSteps steps={hijackEngineSteps} />
        </div>
      </div>
    </section>
  );
}
