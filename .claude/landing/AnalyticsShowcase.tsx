"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconChartBar,
  IconSearch,
  IconTrendingUp,
  IconUsers,
  IconDeviceAnalytics,
  IconMapPin,
} from "@tabler/icons-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";

// Mock data for campaign analytics table
const campaignData = [
  {
    campaign: "Summer Launch",
    creator: "@stylebyemma",
    views: "2.4M",
    engagement: "8.2%",
    conversions: "12.4K",
    status: "active",
  },
  {
    campaign: "Product Drop",
    creator: "@techreviewer",
    views: "1.8M",
    engagement: "6.7%",
    conversions: "8.9K",
    status: "active",
  },
  {
    campaign: "Brand Awareness",
    creator: "@fitnessguru",
    views: "3.1M",
    engagement: "9.1%",
    conversions: "15.2K",
    status: "completed",
  },
  {
    campaign: "Holiday Special",
    creator: "@foodiefaves",
    views: "890K",
    engagement: "7.5%",
    conversions: "4.2K",
    status: "pending",
  },
];

// Mock trending content
const trendingContent = [
  { title: "Product unboxing trend", growth: "+340%", category: "Lifestyle" },
  { title: "Day in my life", growth: "+280%", category: "Vlog" },
  { title: "Get ready with me", growth: "+195%", category: "Beauty" },
];

// Mock demographic data
const demographicData = {
  ageGroups: [
    { label: "18-24", value: 35 },
    { label: "25-34", value: 42 },
    { label: "35-44", value: 15 },
    { label: "45+", value: 8 },
  ],
  locations: [
    { country: "United States", percentage: 45 },
    { country: "United Kingdom", percentage: 18 },
    { country: "Canada", percentage: 12 },
    { country: "Australia", percentage: 8 },
    { country: "Other", percentage: 17 },
  ],
};

function SectionBadge({ icon: Icon, label }: { icon: typeof IconChartBar; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-pulse" />
      <span className="text-[12px] font-medium text-white/50 tracking-wide">{label}</span>
    </div>
  );
}

function DataTable() {
  return (
    <CardSpotlight
      radius={300}
      color="rgba(34, 211, 238, 0.03)"
      className="!p-0 !bg-[#0A0A0A]/80 !backdrop-blur-xl !border-white/[0.06] overflow-hidden"
    >
      <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
        <h4 className="font-medium text-[14px] text-white/90">Campaign Performance</h4>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <span className="text-[11px] text-white/40">Live</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Views
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Conversions
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {campaignData.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.03] transition-colors duration-300 group">
                <td className="px-4 py-3 text-[13px] font-medium text-white/90">
                  {row.campaign}
                </td>
                <td className="px-4 py-3 text-[13px] text-white/50 group-hover:text-white/70 transition-colors">{row.creator}</td>
                <td className="px-4 py-3 text-[13px] text-white/60">{row.views}</td>
                <td className="px-4 py-3 text-[13px] text-white/60">{row.engagement}</td>
                <td className="px-4 py-3 text-[13px] text-white/60">{row.conversions}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full border backdrop-blur-sm",
                      row.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : row.status === "completed"
                        ? "bg-white/[0.04] text-white/50 border-white/[0.06]"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardSpotlight>
  );
}

function SearchUI() {
  return (
    <CardSpotlight
      radius={200}
      color="rgba(255, 255, 255, 0.03)"
      className="!bg-[#0A0A0A]/80 !backdrop-blur-xl !border-white/[0.06] !p-5 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center backdrop-blur-sm">
          <IconSearch className="w-4 h-4 text-white/60" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">Creator Search</h4>
          <p className="text-[12px] text-white/40">Find the perfect match</p>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by niche, audience, or metrics..."
          className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-[13px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-white/[0.12] transition-colors"
          readOnly
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-white/[0.08] text-[10px] font-medium text-white/50 backdrop-blur-sm">
            AI
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {["Lifestyle", "Tech", "Fashion", "Fitness", "Food"].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.04] text-[11px] font-medium text-white/50 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </CardSpotlight>
  );
}

function TrendingCard() {
  return (
    <CardSpotlight
      radius={200}
      color="rgba(16, 185, 129, 0.03)"
      className="!bg-[#0A0A0A]/80 !backdrop-blur-xl !border-white/[0.06] !p-5 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
          <IconTrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">AI Trend Detection</h4>
          <p className="text-[12px] text-white/40">Real-time content trends</p>
        </div>
      </div>
      <div className="space-y-2">
        {trendingContent.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm hover:bg-white/[0.03] hover:border-white/[0.06] transition-all"
          >
            <div>
              <p className="text-[13px] font-medium text-white/80">{item.title}</p>
              <p className="text-[11px] text-white/40">{item.category}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">{item.growth}</span>
          </div>
        ))}
      </div>
    </CardSpotlight>
  );
}

function DemographicsCard() {
  return (
    <CardSpotlight
      radius={200}
      color="rgba(139, 92, 246, 0.03)"
      className="!bg-[#0A0A0A]/80 !backdrop-blur-xl !border-white/[0.06] !p-5 h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
          <IconDeviceAnalytics className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h4 className="font-medium text-[14px] text-white/90">Audience Insights</h4>
          <p className="text-[12px] text-white/40">Understand your reach</p>
        </div>
      </div>

      {/* Age distribution */}
      <div className="mb-5">
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3">
          Age Distribution
        </p>
        <div className="flex gap-2">
          {demographicData.ageGroups.map((group) => (
            <div key={group.label} className="flex-1">
              <div className="h-16 bg-white/[0.02] rounded-xl relative overflow-hidden border border-white/[0.04] backdrop-blur-sm">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${group.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500/20 to-purple-500/5 rounded-xl"
                />
              </div>
              <p className="text-[11px] text-center mt-1 text-white/40">{group.label}</p>
              <p className="text-[11px] text-center font-medium text-white/70">
                {group.value}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top locations */}
      <div>
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
          <IconMapPin className="w-3 h-3" /> Top Locations
        </p>
        <div className="space-y-2">
          {demographicData.locations.slice(0, 3).map((loc, i) => (
            <div key={loc.country} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[12px] text-white/50">{loc.country}</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-300">
                {loc.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardSpotlight>
  );
}

export function AnalyticsShowcase() {
  return (
    <section id="analytics" className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Spotlight effects for liquid glass ambiance */}
      <Spotlight
        className="-top-20 right-0"
        fill="rgba(34, 211, 238, 0.02)"
      />
      <Spotlight
        className="top-40 left-0"
        fill="rgba(139, 92, 246, 0.02)"
      />

      {/* Enhanced ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-cyan-500/[0.03] via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-500/[0.02] via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <SectionBadge icon={IconChartBar} label="Analytics" />
          <div className="mt-6">
            <TextGenerateEffect
              words="Decisions driven by data, not assumptions."
              className="!text-3xl md:!text-4xl lg:!text-[44px] !font-medium !tracking-[-0.02em] !leading-[1.15]"
              duration={0.4}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-[16px] text-white/50 max-w-xl mx-auto leading-[1.7]"
          >
            Track every metric that matters. From creator performance to campaign ROI,
            get real-time insights that drive results.
          </motion.p>
        </motion.div>

        {/* Main data table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <DataTable />
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <SearchUI />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <TrendingCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <DemographicsCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
