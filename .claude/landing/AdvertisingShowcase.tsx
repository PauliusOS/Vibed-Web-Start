"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  IconAd,
  IconUser,
  IconSearch,
  IconLink,
  IconMail,
  IconBrandTiktok,
  IconCreditCard,
  IconFileCheck,
  IconCalendar,
  IconUsers,
  IconMoodSmile,
  IconChevronRight,
} from "@tabler/icons-react";

// Campaign timeline milestones
const timelineMilestones = [
  { label: "Campaign Brief", date: "Nov 15", status: "completed" },
  { label: "Creator Selection", date: "Nov 18", status: "completed" },
  { label: "Content Creation", date: "Nov 22", status: "active" },
  { label: "Draft Review", date: "Nov 28", status: "upcoming" },
  { label: "Go Live", date: "Dec 1", status: "upcoming" },
  { label: "Performance Report", date: "Dec 15", status: "upcoming" },
];

// Feature cards data
const featureCards = [
  {
    icon: IconBrandTiktok,
    title: "TikTok Spark Ads",
    description: "Boost organic content into paid campaigns seamlessly",
    color: "blue",
  },
  {
    icon: IconCreditCard,
    title: "Automated Payments",
    description: "Pay creators instantly with built-in invoicing",
    color: "green",
  },
  {
    icon: IconFileCheck,
    title: "Drafts & Approvals",
    description: "Review and approve content before it goes live",
    color: "purple",
  },
  {
    icon: IconCalendar,
    title: "Campaign Timeline",
    description: "Track milestones and deadlines in real-time",
    color: "orange",
  },
  {
    icon: IconUsers,
    title: "Creator Roster",
    description: "Manage your network of trusted creators",
    color: "pink",
  },
  {
    icon: IconMoodSmile,
    title: "Sentiment Analysis",
    description: "AI-powered comment and feedback tracking",
    color: "cyan",
  },
];

const colorMap: { [key: string]: { bg: string; text: string } } = {
  blue: { bg: "bg-white/[0.04]", text: "text-white/50" },
  green: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  orange: { bg: "bg-amber-500/10", text: "text-amber-400" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

function SectionBadge({ icon: Icon, label }: { icon: typeof IconAd; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
      <Icon className="w-3.5 h-3.5 text-white/50" />
      <span className="text-[12px] font-medium text-white/50 tracking-wide">{label}</span>
    </div>
  );
}

function CampaignTimeline() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] p-5 h-full">
      <h4 className="font-medium text-[14px] text-white/90 mb-5">Campaign Timeline</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-3.5 w-px bg-white/[0.06]" />

        <div className="space-y-5">
          {timelineMilestones.map((milestone, i) => (
            <div key={i} className="relative flex items-start gap-3">
              {/* Status dot */}
              <div
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center ${
                  milestone.status === "completed"
                    ? "bg-emerald-500/20"
                    : milestone.status === "active"
                    ? "bg-white/10 ring-2 ring-white/[0.08]"
                    : "bg-white/[0.04]"
                }`}
              >
                {milestone.status === "completed" ? (
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : milestone.status === "active" ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[13px] font-medium ${
                      milestone.status === "upcoming" ? "text-white/40" : "text-white/80"
                    }`}
                  >
                    {milestone.label}
                  </p>
                  <span className="text-[11px] text-white/40">{milestone.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorProfileCard() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <IconUser className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">Rich Creator Profiles</h4>
          <p className="text-[12px] text-white/40">Deep insights at a glance</p>
        </div>
      </div>

      {/* Mock profile card */}
      <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.04]">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=featured"
            alt="Creator"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-[13px] font-medium text-white/90">Emma Johnson</p>
            <p className="text-[11px] text-white/40">@stylebyemma</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <p className="text-[15px] font-semibold text-white/90">2.4M</p>
            <p className="text-[10px] text-white/40">Followers</p>
          </div>
          <div className="text-center p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <p className="text-[15px] font-semibold text-white/90">8.2%</p>
            <p className="text-[10px] text-white/40">Eng. Rate</p>
          </div>
          <div className="text-center p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <p className="text-[15px] font-semibold text-white/90">4.8</p>
            <p className="text-[10px] text-white/40">Rating</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {["Fashion", "Lifestyle", "Travel"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-medium text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorSearchCard() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <IconSearch className="w-4 h-4 text-white/50" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">AI Creator Search</h4>
          <p className="text-[12px] text-white/40">Find perfect matches instantly</p>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Find creators for summer fashion campaign..."
          className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] text-white/70 placeholder:text-white/30 focus:outline-none"
          readOnly
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="px-2 py-0.5 bg-white/10 text-white/50 text-[10px] rounded-md font-medium">
            AI
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-white/40 uppercase tracking-wider">Suggested filters:</p>
        <div className="flex flex-wrap gap-2">
          {["10K-100K followers", "Fashion niche", "US-based", "Female audience"].map((filter) => (
            <span
              key={filter}
              className="px-2.5 py-1 rounded-md border border-white/[0.06] text-[10px] text-white/50 hover:bg-white/[0.02] cursor-pointer transition-colors duration-300"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BulkOutreachCard() {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <IconMail className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">One-click Outreach</h4>
          <p className="text-[12px] text-white/40">Scale your creator recruitment</p>
        </div>
      </div>

      {/* Mock email composer */}
      <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.04]">
          <span className="text-[12px] text-white/40">To:</span>
          <div className="flex gap-1">
            {["@creator1", "@creator2", "+15 more"].map((recipient, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-white/50"
              >
                {recipient}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-white/50 line-clamp-2">
          Hi {`{name}`}, we&apos;d love to collaborate with you on our upcoming summer campaign...
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-[10px] text-white/40">Template: Summer Outreach</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-white text-black text-[11px] font-medium hover:bg-white/90 transition-colors duration-300">
            Send All
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdvertisingShowcase() {
  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/[0.02] via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <SectionBadge icon={IconAd} label="Advertising" />
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-[44px] font-medium text-white tracking-[-0.02em] leading-[1.15]">
            A new era of streamlined
            <br />
            <span className="text-white/50">creator marketing workflows.</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/50 max-w-xl mx-auto leading-[1.7]">
            From discovery to payment, manage every aspect of your creator campaigns
            in one powerful platform.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:row-span-2"
          >
            <CampaignTimeline />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <CreatorProfileCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <CreatorSearchCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <BulkOutreachCard />
          </motion.div>
        </div>

        {/* Feature cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featureCards.map((card, i) => {
              const colors = colorMap[card.color];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#0A0A0A] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <card.icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-[13px] text-white/90 mb-0.5">{card.title}</h4>
                    <p className="text-[12px] text-white/40">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
