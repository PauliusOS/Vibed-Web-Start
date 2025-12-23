"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";
import { Globe } from "@/components/ui/globe";
import { OrbitingCircles } from "@/components/ui/orbiting-circle";

export function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait for animation to complete, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out to complete before calling onComplete
      setTimeout(onComplete, 600);
    }, 2500); // Optimized to 2.5s for faster load

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          {/* Stars Background */}
          <StarsBackground
            starDensity={0.0002}
            allStarsTwinkle
            twinkleProbability={0.8}
            className="absolute inset-0"
          />

          {/* Shooting Stars */}
          <ShootingStars
            minSpeed={15}
            maxSpeed={35}
            minDelay={800}
            maxDelay={3000}
            starColor="rgb(96, 165, 250)"
            trailColor="rgb(37, 99, 235)"
            className="absolute inset-0"
          />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
            {/* Main Text */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-center">
                <EncryptedText
                  text="SocialSculp"
                  className="text-foreground"
                  revealDelayMs={30}
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <span className="text-2xl sm:text-3xl text-primary font-light">×</span>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
              >
                <EncryptedText
                  text="SylcRoad"
                  className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent"
                  revealDelayMs={30}
                />
              </motion.h2>
            </motion.div>

            {/* Globe with Reduced Orbiting Circles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              {/* Orbiting Circles - Reduced to 2 for performance */}
              <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                <OrbitingCircles
                  className="size-8 border-none bg-transparent"
                  radius={150}
                  duration={20}
                  delay={0}
                >
                  <div className="size-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                </OrbitingCircles>
                <OrbitingCircles
                  className="size-8 border-none bg-transparent"
                  radius={150}
                  duration={20}
                  reverse
                  delay={10}
                >
                  <div className="size-4 rounded-full bg-primary/80 shadow-lg shadow-primary/40" />
                </OrbitingCircles>

                {/* Globe */}
                <Globe className="w-[300px] h-[300px]" />
              </div>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="flex gap-1">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
