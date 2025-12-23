"use client";

import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FRAMER_TEXT_COLORS } from "../constants/colors";

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  reach: number;
}

export const DEFAULT_CREATORS: Creator[] = [
  { id: "1", name: "Emma R.", avatar: "https://i.pravatar.cc/150?img=1", reach: 2400000 },
  { id: "2", name: "James K.", avatar: "https://i.pravatar.cc/150?img=2", reach: 1800000 },
  { id: "3", name: "Sofia L.", avatar: "https://i.pravatar.cc/150?img=3", reach: 950000 },
  { id: "4", name: "Marcus W.", avatar: "https://i.pravatar.cc/150?img=4", reach: 720000 },
  { id: "5", name: "Aria C.", avatar: "https://i.pravatar.cc/150?img=5", reach: 1100000 },
  { id: "6", name: "David M.", avatar: "https://i.pravatar.cc/150?img=6", reach: 850000 },
  { id: "7", name: "Luna P.", avatar: "https://i.pravatar.cc/150?img=7", reach: 1500000 },
  { id: "8", name: "Noah T.", avatar: "https://i.pravatar.cc/150?img=8", reach: 620000 },
  { id: "9", name: "Mia H.", avatar: "https://i.pravatar.cc/150?img=9", reach: 2100000 },
  { id: "10", name: "Ethan G.", avatar: "https://i.pravatar.cc/150?img=10", reach: 780000 },
  { id: "11", name: "Zara B.", avatar: "https://i.pravatar.cc/150?img=11", reach: 1350000 },
  { id: "12", name: "Leo S.", avatar: "https://i.pravatar.cc/150?img=12", reach: 920000 },
];

export function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

export function formatCurrency(n: number, currency: string = "$", compact: boolean = false) {
  if (compact) {
    if (n >= 1000000) return `${currency}${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${currency}${(n / 1000).toFixed(0)}K`;
  }
  return `${currency}${n.toLocaleString()}`;
}

// Stacked Influencer Cards Component
export function StackedInfluencerCards({ 
  count, 
  creators, 
  tierColor,
  showCount = true,
}: { 
  count: number; 
  creators: Creator[]; 
  tierColor: string;
  showCount?: boolean;
}) {
  const displayCount = Math.min(count, 8);
  const activeCreators = creators.slice(0, displayCount);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-20 mb-3">
        <AnimatePresence mode="popLayout">
          {activeCreators.map((creator, index) => {
            const offset = index * 3;
            const rotation = (index - Math.floor(displayCount / 2)) * 4;
            const zIndex = displayCount - index;
            
            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 30, rotate: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: -offset, 
                  rotate: rotation,
                  scale: 1 - (index * 0.02),
                }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  delay: index * 0.03,
                }}
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{ 
                  zIndex,
                  backgroundColor: "rgba(30, 30, 35, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="p-2 flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback style={{ backgroundColor: tierColor }}>
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium truncate" style={{ color: FRAMER_TEXT_COLORS.primary }}>
                      {creator.name}
                    </p>
                    <p className="text-[8px]" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                      {formatNumber(creator.reach)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {showCount && (
        <motion.span 
          key={count}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tabular-nums"
          style={{ color: FRAMER_TEXT_COLORS.primary }}
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}

// Animated CPM Component
export function AnimatedCPM({ 
  cpm, 
  hasDiscount = false, 
  currency = "$",
}: { 
  cpm: number; 
  hasDiscount?: boolean; 
  currency?: string;
}) {
  return (
    <div className="flex flex-col items-center pt-6">
      <motion.div className="flex items-center gap-1">
        <motion.span
          key={cpm}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tabular-nums"
          style={{ color: hasDiscount ? "rgb(34, 197, 94)" : FRAMER_TEXT_COLORS.primary }}
        >
          {currency}{cpm.toFixed(2)}
        </motion.span>
        {hasDiscount && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xl"
            style={{ color: "rgb(34, 197, 94)" }}
          >
            ↓
          </motion.span>
        )}
      </motion.div>
      {hasDiscount && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] mt-1"
          style={{ color: "rgb(34, 197, 94)" }}
        >
          Volume Discount
        </motion.p>
      )}
    </div>
  );
}

// Stacked Video Cards Component
export function StackedVideoCards({ 
  count,
  showCount = true,
}: { 
  count: number;
  showCount?: boolean;
}) {
  const displayCount = Math.min(count, 8);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-28 mb-3">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: displayCount }).map((_, index) => {
            const offset = index * 4;
            const rotation = (index - Math.floor(displayCount / 2)) * 3;
            const zIndex = displayCount - index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotate: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: -offset, 
                  rotate: rotation,
                  scale: 1 - (index * 0.02),
                }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 350, 
                  damping: 25,
                  delay: index * 0.025,
                }}
                className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ 
                  zIndex,
                  backgroundColor: "rgba(30, 30, 35, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="w-full h-full relative">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <svg className="w-4 h-4 ml-0.5" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {showCount && (
        <motion.span 
          key={count}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tabular-nums"
          style={{ color: FRAMER_TEXT_COLORS.primary }}
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}

// Animated Reach Component - Pulsing network effect
export function AnimatedReach({ 
  reach, 
  tierColor,
  showCount = true,
}: { 
  reach: number; 
  tierColor: string;
  showCount?: boolean;
}) {
  const rings = 4;
  const percentage = Math.min(reach / 15000000, 1);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        {Array.from({ length: rings }).map((_, index) => {
          const size = 30 + (index * 18);
          const isActive = percentage > (index / rings);
          const delay = index * 0.15;
          
          return (
            <motion.div
              key={index}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `calc(50% - ${size / 2}px)`,
                top: `calc(50% - ${size / 2}px)`,
                border: `2px solid ${isActive ? tierColor : 'rgba(255,255,255,0.1)'}`,
                opacity: isActive ? 1 - (index * 0.2) : 0.3,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: isActive ? [1, 1.05, 1] : 1,
                opacity: isActive ? [1 - (index * 0.2), 0.8 - (index * 0.15), 1 - (index * 0.2)] : 0.3,
              }}
              transition={{
                delay,
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          );
        })}
        
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 16,
            height: 16,
            left: "calc(50% - 8px)",
            top: "calc(50% - 8px)",
            backgroundColor: tierColor,
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            boxShadow: [
              `0 0 0 0 ${tierColor}`,
              `0 0 20px 8px ${tierColor.replace('1)', '0.3)')}`,
              `0 0 0 0 ${tierColor}`,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 35;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={`particle-${index}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: tierColor,
                left: "calc(50% - 4px)",
                top: "calc(50% - 4px)",
              }}
              animate={{
                x: [x * 0.5, x, x * 0.5],
                y: [y * 0.5, y, y * 0.5],
                opacity: percentage > 0.3 ? [0.4, 0.8, 0.4] : 0,
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
      
      {showCount && (
        <motion.span 
          key={reach}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tabular-nums"
          style={{ color: FRAMER_TEXT_COLORS.primary }}
        >
          {formatNumber(reach)}
        </motion.span>
      )}
    </div>
  );
}
