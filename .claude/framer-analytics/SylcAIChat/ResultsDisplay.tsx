"use client";

import { motion } from "motion/react";
import { FRAMER_TEXT_COLORS } from "../constants/colors";
import { 
  StackedInfluencerCards, 
  StackedVideoCards, 
  AnimatedReach,
  formatNumber,
  formatCurrency,
} from "../shared/AnimatedStats";
import type { ResultsData } from "./index";
import { Button } from "@/components/ui/button";

interface ResultsDisplayProps {
  data: ResultsData;
}

const TIER_COLOR = "rgba(139, 92, 246, 1)";

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-3 rounded-2xl rounded-bl-md"
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
        }}
      >
        <p className="text-sm" style={{ color: "rgb(34, 197, 94)" }}>
          Perfect match found! I&apos;ve identified {data.influencerCount} creators who align with your campaign goals.
        </p>
      </motion.div>
      
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 py-4"
      >
        <div className="flex flex-col items-center">
          <StackedInfluencerCards 
            count={data.influencerCount}
            creators={data.matchedCreators}
            tierColor={TIER_COLOR}
            showCount={false}
          />
          <motion.div 
            className="text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-2xl font-bold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
              {data.influencerCount}
            </p>
            <p className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              Influencers
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center">
          <StackedVideoCards count={Math.min(data.videoCount, 8)} showCount={false} />
          <motion.div 
            className="text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-2xl font-bold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
              {data.videoCount}
            </p>
            <p className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              Videos
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center">
          <AnimatedReach reach={data.totalReach} tierColor={TIER_COLOR} showCount={false} />
          <motion.div 
            className="text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-2xl font-bold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
              {formatNumber(data.totalReach)}
            </p>
            <p className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
              Reach
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-5 rounded-xl text-center"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: FRAMER_TEXT_COLORS.muted }}>
          Estimated Investment
        </p>
        <p className="text-3xl font-bold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
          {formatCurrency(data.priceRange.min, "$", true)} - {formatCurrency(data.priceRange.max, "$", true)}
        </p>
        <p className="text-xs mt-1" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
          CPM: ${data.cpm.toFixed(2)}
        </p>
      </motion.div>
      
      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="space-y-3"
      >
        <Button
          className="w-full py-6 text-base font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(99, 102, 241, 1) 100%)",
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Talk to Our Team
        </Button>
        <p className="text-center text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
          Usually responds within 2 hours
        </p>
      </motion.div>
    </motion.div>
  );
}
