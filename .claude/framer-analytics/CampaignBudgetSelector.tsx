"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { motion, useSpring, useMotionValueEvent, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FRAMER_TEXT_COLORS,
} from "./constants/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface CampaignBudgetSelectorProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  snapTo?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  currency?: string;
  title?: string;
  subtitle?: string;
  dotInterval?: number;
  creators?: Creator[];
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  reach: number;
}

const DEFAULT_CREATORS: Creator[] = [
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

const QUICK_PRESETS = [20000, 50000, 75000, 100000];

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function formatCurrency(n: number, currency: string = "$", compact: boolean = false) {
  if (compact) {
    if (n >= 1000000) return `${currency}${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${currency}${(n / 1000).toFixed(0)}K`;
  }
  return `${currency}${n.toLocaleString()}`;
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

const gentleEase = [0.25, 0.1, 0.25, 1];

function getCPM(budget: number): number {
  if (budget >= 65000) return 3.20;
  if (budget >= 35000) return 3.80;
  if (budget >= 20000) return 4.20;
  return 4.50;
}

const BUDGET_TIERS = [
  { min: 0, max: 35000, label: "Growth", color: "rgba(34, 197, 94, 1)" },
  { min: 35000, max: 65000, label: "Scale", color: "rgba(25, 125, 255, 1)" },
  { min: 65000, max: Infinity, label: "Enterprise", color: "rgba(168, 85, 247, 1)" },
];

// Stacked Influencer Cards Component
function StackedInfluencerCards({ 
  count, 
  creators, 
  tierColor 
}: { 
  count: number; 
  creators: Creator[]; 
  tierColor: string;
}) {
  const displayCount = Math.min(count, 8);
  const activeCreators = creators.slice(0, displayCount);
  
  return (
    <div className="flex flex-col items-center">
      {/* Stacked cards */}
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
      <motion.span 
        key={count}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tabular-nums"
        style={{ color: FRAMER_TEXT_COLORS.primary }}
      >
        {count}
      </motion.span>
    </div>
  );
}

// Animated CPM Component
function AnimatedCPM({ 
  cpm, 
  hasDiscount, 
  currency 
}: { 
  cpm: number; 
  hasDiscount: boolean; 
  currency: string;
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
function StackedVideoCards({ count }: { count: number }) {
  const displayCount = Math.min(count, 8);
  
  return (
    <div className="flex flex-col items-center">
      {/* Stacked video cards */}
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
                {/* Video thumbnail placeholder */}
                <div className="w-full h-full relative">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                    }}
                  />
                  {/* Play button */}
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
      <motion.span 
        key={count}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tabular-nums"
        style={{ color: FRAMER_TEXT_COLORS.primary }}
      >
        {count}
      </motion.span>
    </div>
  );
}

// Animated Reach Component - Pulsing network effect
function AnimatedReach({ 
  reach, 
  tierColor 
}: { 
  reach: number; 
  tierColor: string;
}) {
  const rings = 4;
  const percentage = Math.min(reach / 15000000, 1); // Max 15M reach
  
  return (
    <div className="flex flex-col items-center">
      {/* Pulsing circles visualization */}
      <div className="relative w-24 h-24 mb-3">
        {/* Background rings */}
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
        
        {/* Center dot */}
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
        
        {/* Floating particles */}
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
      
      <motion.span 
        key={reach}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tabular-nums"
        style={{ color: FRAMER_TEXT_COLORS.primary }}
      >
        {formatNumber(reach)}
      </motion.span>
    </div>
  );
}

export function CampaignBudgetSelector({
  className,
  min = 20000,
  max = 100000,
  step = 1000,
  snapTo = 1000,
  value: valueProp,
  defaultValue = 25000,
  onChange,
  onChangeEnd,
  currency = "$",
  title = "Campaign Budget",
  subtitle = "Adjust your investment to see projected results",
  dotInterval = 20000,
  creators = DEFAULT_CREATORS,
}: CampaignBudgetSelectorProps) {
  const isControlled = typeof valueProp === "number";
  const [uncontrolled, setUncontrolled] = useState(clamp(defaultValue, min, max));
  const value = isControlled ? clamp(valueProp as number, min, max) : uncontrolled;
  
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [posPct, setPosPct] = useState(() => ((value - min) / (max - min)) * 100);
  
  const animRef = useRef<number | null>(null);
  const animStartRef = useRef<number>(0);
  const animFromPctRef = useRef<number>(0);
  const animToPctRef = useRef<number>(0);
  const animDurationMs = 300;
  
  const isPointerDownRef = useRef(false);
  const hasMovedRef = useRef(false);
  const suppressClickRef = useRef(false);
  
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const valueSpring = useSpring(value, { stiffness: 140, damping: 18, mass: 0.6 });
  const [displayValue, setDisplayValue] = useState(value);
  
  useMotionValueEvent(valueSpring, "change", (v) => {
    setDisplayValue(Math.round(v as number / step) * step);
  });

  useLayoutEffect(() => {
    if (isPointerDownRef.current) return;
    if (animRef.current) return;
    const pctFromValue = ((value - min) / (max - min)) * 100;
    setPosPct(clamp(pctFromValue, 0, 100));
  }, [value, min, max]);

  const currentTier = useMemo(() => {
    return BUDGET_TIERS.find(tier => value >= tier.min && value < tier.max) || BUDGET_TIERS[BUDGET_TIERS.length - 1];
  }, [value]);

  const tickCount = useMemo(
    () => Math.max(80, Math.floor((trackWidth || 1) / 6)),
    [trackWidth]
  );
  
  const currentTickIndexFloat = useMemo(
    () => (posPct / 100) * (tickCount - 1),
    [posPct, tickCount]
  );

  const estimates = useMemo(() => {
    const cpm = getCPM(value);
    const baseCpm = getCPM(20000);
    const cpmDropped = cpm < baseCpm;
    const influencerCount = Math.max(5, Math.floor(value / 4000));
    const videoCount = influencerCount * 2;
    const activeCreators = creators.slice(0, Math.min(influencerCount, creators.length));
    const totalReach = activeCreators.reduce((sum, c) => sum + c.reach, 0);
    
    return { 
      cpm,
      cpmDropped,
      influencerCount,
      videoCount,
      totalReach,
      activeCreators,
    };
  }, [value, creators]);

  const commitValue = useCallback((v: number, fireEnd = false) => {
    const clamped = clamp(v, min, max);
    if (!isControlled) setUncontrolled(clamped);
    valueSpring.set(clamped);
    onChange?.(clamped);
    if (fireEnd) onChangeEnd?.(clamped);
  }, [min, max, isControlled, valueSpring, onChange, onChangeEnd]);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const animateTo = useCallback((targetValue: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const tnorm = (targetValue - min) / (max - min);
    animFromPctRef.current = posPct;
    animToPctRef.current = clamp(tnorm * 100, 0, 100);
    animStartRef.current = performance.now();
    
    const animStep = (now: number) => {
      const elapsed = now - animStartRef.current;
      const p = Math.min(1, elapsed / animDurationMs);
      const k = easeOutCubic(p);
      const currPct = animFromPctRef.current + (animToPctRef.current - animFromPctRef.current) * k;
      setPosPct(currPct);
      
      const liveValue = min + (currPct / 100) * (max - min);
      const moveSnap = snapTo > 0 ? snapTo : 1000;
      let next = Math.round(liveValue / moveSnap) * moveSnap;
      next = clamp(next, min, max);
      commitValue(next, false);
      
      if (p < 1) {
        animRef.current = requestAnimationFrame(animStep);
      } else {
        commitValue(targetValue, true);
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(animStep);
  }, [min, max, posPct, snapTo, commitValue]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !isPointerDownRef.current) return;
    hasMovedRef.current = true;
    updateFromEvent(e, false);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (hasMovedRef.current) {
      updateFromEvent(e, true);
      suppressClickRef.current = true;
    }
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    isPointerDownRef.current = false;
    hasMovedRef.current = false;
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    isPointerDownRef.current = false;
    hasMovedRef.current = false;
  };

  const updateFromEvent = (e: React.PointerEvent<HTMLDivElement>, isEnd: boolean) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const t = x / rect.width;
    const raw = min + t * (max - min);
    setPosPct(t * 100);
    
    const moveSnap = snapTo > 0 ? snapTo : 1000;
    let next = Math.round(raw / moveSnap) * moveSnap;
    next = clamp(next, min, max);
    commitValue(next, isEnd);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const t = x / rect.width;
    const raw = min + t * (max - min);
    const moveSnap = snapTo > 0 ? snapTo : 1000;
    const target = clamp(Math.round(raw / moveSnap) * moveSnap, min, max);
    animateTo(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let delta = 0;
    const baseStep = snapTo > 0 ? snapTo : 1000;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        delta = -(e.shiftKey ? baseStep * 5 : baseStep);
        break;
      case "ArrowRight":
      case "ArrowUp":
        delta = e.shiftKey ? baseStep * 5 : baseStep;
        break;
      case "Home":
        commitValue(min, true);
        e.preventDefault();
        return;
      case "End":
        commitValue(max, true);
        e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
    const next = clamp(value + delta, min, max);
    commitValue(next, true);
  };

  const firstDot = useMemo(() => Math.ceil(min / dotInterval) * dotInterval, [min, dotInterval]);
  const startLabel = formatCurrency(min, currency, true);
  const endLabel = formatCurrency(max, currency, true);

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: gentleEase }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative border backdrop-blur-2xl rounded-2xl"
        style={{
          background: "linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
          boxShadow: isHovered
            ? "0 32px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
            : "0 16px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.03) inset",
          transition: "border-color 0.4s ease, box-shadow 0.5s ease",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${currentTier.color.replace('1)', '0.2)')} 0%, transparent 50%)`,
            transition: "background 0.6s ease",
          }}
        />

        <div className="relative p-8">
          {/* Header - Title only, no dollar amount */}
          <div className="mb-8 text-center">
            <h3
              className="text-sm font-medium tracking-wide uppercase mb-1"
              style={{ color: FRAMER_TEXT_COLORS.muted, letterSpacing: "0.1em" }}
            >
              {title}
            </h3>
            <p className="text-sm" style={{ color: FRAMER_TEXT_COLORS.secondary }}>
              {subtitle}
            </p>
          </div>

          {/* ANIMATED STATS GRID - Influencers, CPM, Videos, Reach */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <StackedInfluencerCards 
                count={estimates.influencerCount} 
                creators={estimates.activeCreators}
                tierColor={currentTier.color}
              />
              <p className="text-xs font-medium uppercase tracking-wide text-center mt-3" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                Influencers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <AnimatedCPM 
                cpm={estimates.cpm} 
                hasDiscount={estimates.cpmDropped}
                currency={currency}
              />
              <p className="text-xs font-medium uppercase tracking-wide text-center mt-3" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                CPM
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <StackedVideoCards count={estimates.videoCount} />
              <p className="text-xs font-medium uppercase tracking-wide text-center mt-3" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                Videos
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <AnimatedReach 
                reach={estimates.totalReach} 
                tierColor={currentTier.color}
              />
              <p className="text-xs font-medium uppercase tracking-wide text-center mt-3" style={{ color: FRAMER_TEXT_COLORS.muted }}>
                Reach
              </p>
            </motion.div>
          </div>

          {/* Floating Value Indicator - moves with slider */}
          <div className="relative mb-4 h-0">
            <motion.div 
              className="absolute -top-8"
              style={{ left: `${posPct}%` }}
              animate={{ y: isPointerDownRef.current ? -2 : 0 }}
            >
              <div 
                className="-translate-x-1/2 rounded-md border px-3 py-1.5 text-sm font-semibold shadow-lg"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  borderColor: currentTier.color.replace('1)', '0.4)'),
                  color: FRAMER_TEXT_COLORS.primary,
                }}
              >
                {formatCurrency(displayValue, currency)}
              </div>
            </motion.div>
          </div>

          {/* Ruler Slider */}
          <div
            ref={trackRef}
            className="relative h-12 select-none cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={handleTrackClick}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={formatCurrency(value, currency)}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: tickCount }).map((_, i) => {
                const left = (i / (tickCount - 1)) * 100;
                const distFloat = Math.abs(currentTickIndexFloat - i);
                const base = 10;
                const peak = 12;
                const spread = 2;
                const factor = Math.max(0, 1 - distFloat / spread);
                const height = base + peak * factor;
                
                let color = "bg-muted-foreground/40";
                if (distFloat < 0.5) color = "bg-primary";
                else if (distFloat < 1.5) color = "bg-primary/90";
                else if (distFloat < 2.5) color = "bg-primary/70";
                
                const widthClass = distFloat < 0.5 ? "w-[3px]" : distFloat < 3.5 ? "w-[2px]" : "w-px";
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute top-1/2 -translate-y-full rounded-full ${widthClass} ${color}`}
                    style={{ left: `${left}%` }}
                    animate={{ height }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                );
              })}
            </div>

            <div className="pointer-events-auto absolute inset-0">
              {(() => {
                const dots: ReactNode[] = [];
                for (let v = firstDot; v <= max; v += dotInterval) {
                  const t = (v - min) / (max - min);
                  const left = `${t * 100}%`;
                  const isActive = Math.round(value) === v;
                  
                  dots.push(
                    <div
                      key={`dot-${v}`}
                      role="button"
                      tabIndex={0}
                      aria-label={formatCurrency(v, currency)}
                      onClick={(e) => {
                        e.stopPropagation();
                        animateTo(v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          animateTo(v);
                        }
                      }}
                      className={`absolute rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 ${isActive ? "bg-primary" : "bg-muted-foreground/70"}`}
                      style={{
                        left,
                        top: "calc(50% + 14px)",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "4px",
                      }}
                    />
                  );
                }
                return dots;
              })()}
            </div>
          </div>

          {/* Range Labels */}
          <div className="flex justify-between text-xs mt-4 mb-6" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex justify-center gap-3">
            {QUICK_PRESETS.map((preset) => {
              const isActive = value === preset;
              const presetTier = BUDGET_TIERS.find(t => preset >= t.min && preset < t.max) || BUDGET_TIERS[BUDGET_TIERS.length - 1];
              
              return (
                <motion.button
                  key={preset}
                  onClick={() => animateTo(preset)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isActive 
                      ? presetTier.color.replace('1)', '0.2)')
                      : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? presetTier.color : FRAMER_TEXT_COLORS.secondary,
                    border: isActive 
                      ? `1px solid ${presetTier.color.replace('1)', '0.4)')}`
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {formatCurrency(preset, currency, true)}
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          className="h-1 w-full rounded-b-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentTier.color}, transparent)`,
            opacity: 0.4,
          }}
          animate={{ opacity: isHovered ? 0.7 : 0.4 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export default CampaignBudgetSelector;
