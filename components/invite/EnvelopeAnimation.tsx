"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect, useState } from "react";

interface EnvelopeAnimationProps {
  children: ReactNode;
  isOpened: boolean;
  onOpen: () => void;
}

export function EnvelopeAnimation({
  children,
  isOpened,
  onOpen,
}: EnvelopeAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<
    "initial" | "visible" | "opening" | "opened"
  >("initial");

  useEffect(() => {
    // Initial entrance animation
    const timer = setTimeout(() => {
      setAnimationPhase("visible");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpened && animationPhase === "visible") {
      setAnimationPhase("opening");
      // After flap opens, reveal card
      setTimeout(() => {
        setAnimationPhase("opened");
      }, 600);
    }
  }, [isOpened, animationPhase]);

  const handleClick = () => {
    if (animationPhase === "visible") {
      onOpen();
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "800px" }}
      onClick={handleClick}
    >
      {/* Envelope container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{
          scale: animationPhase === "initial" ? 0.9 : 1,
          opacity: animationPhase === "initial" ? 0 : 1,
          y: animationPhase === "initial" ? 20 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Envelope back */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transform: "translateZ(-10px)",
          }}
        />

        {/* Inner card area (card sits here) */}
        <motion.div
          className="relative z-10"
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: animationPhase === "opened" ? -40 : 0,
            opacity: animationPhase === "opened" ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            delay: animationPhase === "opened" ? 0.1 : 0,
          }}
        >
          {children}
        </motion.div>

        {/* Envelope front (bottom part) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[60%] rounded-b-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1e1e3a 0%, #1a1a2e 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderTop: "none",
            transformOrigin: "bottom center",
          }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: animationPhase === "opened" ? 0 : 1,
          }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Envelope paper texture effect */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            }}
          />
        </motion.div>

        {/* Envelope flap (triangular top) */}
        <motion.div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: "50%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            zIndex: animationPhase === "opening" || animationPhase === "opened" ? 5 : 20,
          }}
          animate={{
            rotateX:
              animationPhase === "opening" || animationPhase === "opened"
                ? -160
                : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
          }}
        >
          {/* Flap front */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #1e1e3a 0%, #22223a 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Glow line at top */}
            <div
              className="absolute inset-x-0 top-0 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)",
              }}
            />
          </div>

          {/* Flap back (visible when opened) */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #16162a 0%, #1a1a2e 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
            }}
          />
        </motion.div>

        {/* Click prompt */}
        <AnimatePresence>
          {animationPhase === "visible" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-white/40 text-sm">
                Click to open your invitation
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative seal */}
        <motion.div
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 25 }}
          initial={{ scale: 1 }}
          animate={{
            scale: animationPhase === "opening" || animationPhase === "opened" ? 0 : 1,
            opacity: animationPhase === "opening" || animationPhase === "opened" ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
            }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
