"use client";

import { motion } from "motion/react";
import { Heart, Check } from "lucide-react";

// Floating reaction component
function FloatingReaction({
  emoji,
  className,
  delay = 0,
}: {
  emoji: string;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.5, type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="bg-white rounded-full px-2 py-1 shadow-lg flex items-center gap-1"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-lg">{emoji}</span>
      </motion.div>
    </motion.div>
  );
}

// Profile ring component (Instagram story style)
function ProfileRing({
  gradient,
  className,
  delay = 0,
  size = "md",
}: {
  gradient: string;
  className: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.8, type: "spring", stiffness: 200 }}
    >
      <div
        className={`${sizeClasses[size]} rounded-full p-[2px]`}
        style={{ background: gradient }}
      >
        <div className="w-full h-full rounded-full bg-[#1a1a1a] p-[2px]">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(135deg, ${gradient.includes("pink") ? "#ec4899" : gradient.includes("green") ? "#22c55e" : "#8b5cf6"} 0%, ${gradient.includes("pink") ? "#f97316" : gradient.includes("green") ? "#06b6d4" : "#3b82f6"} 100%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Verified badge component
function VerifiedBadge({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.6, type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="bg-emerald-500 rounded-full p-1.5 shadow-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

// Phone frame component with gradient placeholder
function PhoneFrame({
  gradient,
  rotation = 0,
  scale = 1,
  zIndex = 0,
  className = "",
  isMain = false,
  delay = 0,
}: {
  gradient: string;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  className?: string;
  isMain?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ zIndex }}
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="relative"
        style={{ transform: `scale(${scale})` }}
        animate={isMain ? { y: [0, -4, 0] } : undefined}
        transition={isMain ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {/* Phone frame */}
        <div
          className="w-[220px] h-[380px] rounded-[32px] overflow-hidden shadow-2xl"
          style={{
            background: "#1a1a1a",
            boxShadow: isMain
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
              : "0 20px 40px -12px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Screen content */}
          <div
            className="w-full h-full rounded-[28px] m-1"
            style={{
              width: "calc(100% - 8px)",
              height: "calc(100% - 8px)",
              background: gradient,
            }}
          >
            {/* Mock content overlay */}
            <div className="w-full h-full flex flex-col justify-end p-4">
              {isMain && (
                <>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/20 rounded-full mb-3">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  {/* Bottom bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/30" />
                      <div className="flex flex-col gap-1">
                        <div className="w-16 h-2 bg-white/40 rounded" />
                        <div className="w-12 h-1.5 bg-white/20 rounded" />
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Heart className="w-6 h-6 text-white fill-white" />
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CreatorReelShowcase() {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Container for all elements */}
      <div className="relative w-[400px] h-[500px]">
        {/* Background phone - left */}
        <PhoneFrame
          gradient="linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)"
          rotation={-12}
          scale={0.85}
          zIndex={1}
          className="left-0 top-8"
          delay={0.1}
        />

        {/* Background phone - right */}
        <PhoneFrame
          gradient="linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c026d3 100%)"
          rotation={10}
          scale={0.85}
          zIndex={1}
          className="right-0 top-12"
          delay={0.2}
        />

        {/* Main phone - center */}
        <PhoneFrame
          gradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)"
          rotation={0}
          scale={1}
          zIndex={10}
          className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          isMain
          delay={0.3}
        />

        {/* Floating reactions */}
        <FloatingReaction
          emoji="🔥"
          className="left-4 top-16 z-20"
          delay={0}
        />
        <FloatingReaction
          emoji="💜"
          className="left-12 top-4 z-20"
          delay={0.15}
        />
        <FloatingReaction
          emoji="🧡"
          className="left-24 top-0 z-20"
          delay={0.25}
        />

        {/* Verified badge */}
        <VerifiedBadge className="right-8 top-20 z-20" delay={0.2} />

        {/* Profile rings */}
        <ProfileRing
          gradient="linear-gradient(135deg, #ec4899 0%, #f97316 100%)"
          className="right-4 top-32 z-20"
          delay={0}
          size="lg"
        />
        <ProfileRing
          gradient="linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)"
          className="left-0 bottom-20 z-20"
          delay={0.1}
          size="md"
        />
        <ProfileRing
          gradient="linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
          className="right-12 bottom-8 z-20"
          delay={0.2}
          size="sm"
        />
      </div>
    </div>
  );
}
