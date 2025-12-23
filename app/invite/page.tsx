"use client";

import { useState } from "react";
import { Folder, FolderContent } from "@/components/ui/folder";
import { SlideBottomTransition } from "@/components/transitions/slide-bottom-transition";
import { ParticleBurst } from "@/components/ui/particle-burst";
import { LightRays } from "@/components/ui/light-rays";
import { IdleSparkles } from "@/components/ui/idle-sparkles";
import { GlowPillar } from "@/components/ui/glow-pillar";
import Image from "next/image";

export default function AcceptInvitePage() {
  const [isPeeking, setIsPeeking] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Almost black background */}
      <div
        className="absolute inset-0"
        style={{
          background: `#030303`,
        }}
      />

      {/* Blue gradient from bottom - base layer (always visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 20%, rgba(59, 130, 246, 0.02) 40%, transparent 60%)`,
        }}
      />
      {/* Blue glow - hover layer (fades in/out) */}
      <div
        className={`absolute inset-0 pointer-events-none ${isPeeking ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `linear-gradient(to top, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 25%, rgba(59, 130, 246, 0.06) 50%, transparent 75%)`,
          transition: isPeeking
            ? 'opacity 1.2s ease-out'
            : 'opacity 1s cubic-bezier(0.4, 0, 1, 1)',
        }}
      />

      {/* Folder centered in screen, slightly up */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative -mt-24">
          {/* Drop shadow beneath folder */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-[80%] w-[280px] h-[80px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 100% 100% at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />

          {/* Idle sparkles - always visible, subtle white/silver */}
          <IdleSparkles particleCount={3} />

          {/* Light rays - on hover */}
          <LightRays isActive={isPeeking} />

          {/* Glow pillar - soft blue light column on hover */}
          <GlowPillar isActive={isPeeking} />

          {/* Folder - dark grey with float and glow reflection */}
          <Folder
            size="sm"
            color="#2a2a2a"
            tabColor="#1a1a1a"
            isPeeking={isPeeking}
            disableHoverPeek
            disableClick
            floatEffect
            shakeOnHover
            glowReflection
            glowColor="59, 130, 246"
          >
            {/* Particle burst - inside folder for correct z-index stacking */}
            <ParticleBurst isActive={isPeeking} />

            <FolderContent
              className="border-0 overflow-hidden"
              style={{
                background: `linear-gradient(to top, #1e40af 0%, #2563eb 40%, #3b82f6 70%, #60a5fa 100%)`,
                boxShadow: isPeeking
                  ? `0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)`
                  : `0 0 10px rgba(59, 130, 246, 0.2)`,
                border: '1px solid rgba(96, 165, 250, 0.5)',
              }}
            >
              {/* SVG filter for inner shadow effect - light from top-left corner, shadow on bottom-right inner edges */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    {/* Smaller offset - shadow hugs the walls */}
                    <feOffset dx="1.5" dy="1.5" />
                    {/* Soft blur for faded look */}
                    <feGaussianBlur stdDeviation="1" result="offset-blur" />
                    {/* Create inverse - this makes it an inner shadow */}
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                    {/* Faded shadow */}
                    <feFlood floodColor="black" floodOpacity="0.35" result="color" />
                    {/* Clip color to inverse shape */}
                    <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                    {/* Composite shadow over original */}
                    <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                  </filter>
                </defs>
              </svg>

              {/* Engraved white logo with outer glow and inner shadow */}
              <div
                className="relative"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6)) drop-shadow(0 0 30px rgba(255,255,255,0.4)) drop-shadow(0 0 50px rgba(255,255,255,0.2))',
                }}
              >
                <Image
                  src="/logos/sylcroad-symbol-black.png"
                  alt="SylcRoad"
                  width={120}
                  height={120}
                  className="object-contain"
                  style={{
                    filter: 'brightness(0) invert(1) url(#inset-shadow)',
                    opacity: 0.9,
                  }}
                />
              </div>
            </FolderContent>
          </Folder>
        </div>
      </div>

      {/* Text and button - positioned below center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-72">
        {/* Welcome text */}
        <div className="text-center mt-32">
          <p className="text-white/60 text-lg">
            Welcome to SylcRoad...
          </p>
        </div>

        {/* Accept button - hover triggers all effects */}
        <SlideBottomTransition href="/login" speed={0.6}>
          <button
            onMouseEnter={() => setIsPeeking(true)}
            onMouseLeave={() => setIsPeeking(false)}
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium px-8 py-3 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
          >
            Accept the Invite
          </button>
        </SlideBottomTransition>
      </div>
    </div>
  );
}
