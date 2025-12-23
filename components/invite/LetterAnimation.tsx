"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface LetterAnimationProps {
  isOpen: boolean;
}

// Confetti burst component
function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init || !trigger) return null;

  return (
    <Particles
      id="envelope-confetti"
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          number: { value: 25 },
          color: { value: ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"] },
          shape: { type: ["circle", "square"] },
          opacity: { value: { min: 0.6, max: 1 } },
          size: { value: { min: 2, max: 5 } },
          move: {
            enable: true,
            direction: "top",
            speed: { min: 4, max: 12 },
            gravity: { enable: true, acceleration: 4 },
            outModes: "destroy",
          },
          life: { duration: { value: 2 }, count: 1 },
        },
        emitters: {
          position: { x: 50, y: 50 },
          rate: { quantity: 25, delay: 0 },
          life: { count: 1, duration: 0.1 },
        },
      }}
      className="absolute inset-0 pointer-events-none z-50"
    />
  );
}

export function LetterAnimation({ isOpen }: LetterAnimationProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowParticles(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowParticles(false);
    }
  }, [isOpen]);

  return (
    <div className="relative w-[280px] h-[300px] flex items-center justify-center">
      {/* Particle effect layer */}
      <ConfettiBurst trigger={showParticles} />

      {/* Envelope container with perspective for 3D rotation */}
      <div
        className="relative"
        style={{ perspective: "1000px" }}
      >
        {/* 1. ENVELOPE BODY (BASE) - Dark charcoal rectangle - z-index: 1 */}
        <div
          className="w-[220px] h-[180px] rounded-lg relative"
          style={{
            background: "linear-gradient(180deg, #2a2520 0%, #1f1c18 100%)",
            boxShadow: `
              0 10px 40px rgba(0, 0, 0, 0.5),
              0 0 80px rgba(59, 130, 246, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
            zIndex: 1,
          }}
        />


        {/* 3. BACK V-POCKET - Side triangles - z-index: 5 */}
        <div
          className="absolute w-[220px] h-[180px] left-0 top-0 pointer-events-none overflow-hidden rounded-lg"
          style={{ zIndex: 5 }}
        >
          {/* Left back triangle */}
          <div
            className="absolute w-[110px] h-[180px] left-0 top-0"
            style={{
              background: "linear-gradient(135deg, #2d2822 0%, #1f1c18 100%)",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
            }}
          />
          {/* Right back triangle */}
          <div
            className="absolute w-[110px] h-[180px] right-0 top-0"
            style={{
              background: "linear-gradient(225deg, #2d2822 0%, #1f1c18 100%)",
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            }}
          />
          {/* Crease lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 220 180"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="110"
              y2="180"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
            <line
              x1="220"
              y1="0"
              x2="110"
              y2="180"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* 4. CARD - Fades in when envelope opens - z-index: 2 (behind envelope layers) */}
        <div
          className="absolute w-[180px] h-[110px] rounded-xl flex items-center justify-center overflow-hidden pointer-events-none transition-all duration-300"
          style={{
            left: "50%",
            top: "8px",
            transform: "translateX(-50%)",
            zIndex: 2,
            opacity: isOpen ? 1 : 0,
            background: "linear-gradient(145deg, #4f93f7 0%, #3b82f6 30%, #1d4ed8 100%)",
            boxShadow: isOpen
              ? `
                0 0 40px rgba(59, 130, 246, 0.6),
                0 0 80px rgba(59, 130, 246, 0.4),
                0 5px 20px rgba(59, 130, 246, 0.3)
              `
              : "none",
            transitionDelay: isOpen ? "0.1s" : "0s",
          }}
        >
          {/* Card inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)",
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Image
              src="/logos/sylcroad-symbol-black.png"
              alt="SylcRoad"
              width={70}
              height={70}
              className="w-12 h-12 object-contain"
              style={{ filter: "invert(1) brightness(1.2)" }}
            />
          </div>

          {/* Corner fold effect */}
          <div
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%)",
            }}
          />
        </div>

        {/* 5. FRONT V-POCKET - Single triangle pointing UP from bottom - z-index: 15 */}
        <div
          className="absolute w-[220px] h-[180px] left-0 top-0 pointer-events-none rounded-lg overflow-hidden"
          style={{ zIndex: 15 }}
        >
          {/* Main triangle pointing UP */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(0deg, #3a3530 0%, #2d2822 60%, #252320 100%)",
              // Triangle: bottom-left, bottom-right, top-center (pointing UP)
              // Tip at 50% = 90px from top, which overlaps with flap tip at 100px
              clipPath: "polygon(0 100%, 100% 100%, 50% 50%)",
            }}
          />
          {/* Crease line from tip to corners */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 220 180"
            preserveAspectRatio="none"
          >
            {/* Left edge highlight */}
            <line
              x1="0"
              y1="180"
              x2="110"
              y2="90"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
            {/* Right edge shadow */}
            <line
              x1="220"
              y1="180"
              x2="110"
              y2="90"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* 6. FLAP - Hinged at top, flips open like envelope lid - z-index: 20/5 */}
        <motion.div
          className="absolute w-[220px] left-0 pointer-events-none"
          animate={{
            zIndex: isOpen ? 5 : 20,
          }}
          transition={{ duration: 0 }}
          style={{
            top: 0,
            height: "100px",
            perspective: "800px",
          }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              rotateX: isOpen ? 180 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
            }}
            style={{
              transformOrigin: "center top",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face of flap - triangle pointing DOWN */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #3a3530 0%, #2a2520 50%, #1f1c18 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
                borderRadius: "8px 8px 0 0",
              }}
            >
              {/* Flap inner shadow for 3D depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.3) 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />

              {/* Top edge highlight */}
              <div
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              />

              {/* Edge lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 220 100"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0" x2="110" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="220" y1="0" x2="110" y2="100" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1" />
              </svg>
            </div>

            {/* Back face of flap (visible when rotated) */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(0deg, #2d2822 0%, #1f1c18 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* 7. Envelope border outline with animated glow */}
        <motion.div
          className="absolute w-[220px] h-[180px] pointer-events-none rounded-lg"
          animate={{
            boxShadow: isOpen
              ? "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.15), inset 0 0 20px rgba(59, 130, 246, 0.05)"
              : "0 0 0 rgba(59, 130, 246, 0)",
          }}
          transition={{ duration: 0.3 }}
          style={{
            top: 0,
            left: 0,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            zIndex: 25,
          }}
        />

        {/* 8. Bottom edge highlight */}
        <div
          className="absolute w-[200px] h-[1px] rounded-full pointer-events-none"
          style={{
            bottom: "2px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            zIndex: 25,
          }}
        />
      </div>
    </div>
  );
}
