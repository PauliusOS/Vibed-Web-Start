"use client";

import { useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SlideBottomTransitionProps {
  children: ReactNode;
  href: string;
  speed?: number;
  blur?: number;
  className?: string;
}

export function SlideBottomTransition({
  children,
  href,
  speed = 0.6,
  blur = 1,
  className,
}: SlideBottomTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleClick = useCallback(() => {
    setIsTransitioning(true);

    // Navigate after the slide fully covers the screen
    setTimeout(() => {
      router.push(href);
    }, speed * 1000);
  }, [href, router, speed]);

  return (
    <>
      <div onClick={handleClick} className={className}>
        {children}
      </div>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: speed,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              background: "#030303",
              backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
          >
            {/* Blue gradient at bottom - matches login page */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 25%, rgba(59, 130, 246, 0.06) 50%, transparent 75%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
