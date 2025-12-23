"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { framerShadow, framerTransitions, framerCardVariants } from "@/lib/animations";

interface ShowcaseCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageFallback?: React.ReactNode;
  imageAlt?: string;
  avatarOverlay?: React.ReactNode; // Slot for corner avatar/badge
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
  className?: string;
  imageHeight?: number;
  hideExpandButton?: boolean;
}

export const ShowcaseCard = forwardRef<HTMLDivElement, ShowcaseCardProps>(
  (
    {
      title,
      subtitle,
      imageUrl,
      imageFallback,
      imageAlt,
      avatarOverlay,
      isExpanded: controlledExpanded,
      onExpandChange,
      defaultExpanded = false,
      children,
      className,
      imageHeight = 180, // Reduced from 260
      hideExpandButton = false,
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

    // Support both controlled and uncontrolled modes
    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    const handleToggle = () => {
      if (isControlled) {
        onExpandChange?.(!controlledExpanded);
      } else {
        setInternalExpanded(!internalExpanded);
      }
    };

    // Smoother spring transition
    const smoothTransition = {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative bg-white/[0.03] border border-white/10 p-2 flex flex-col gap-2",
          className
        )}
        style={{
          borderTopLeftRadius: '44px',
          borderTopRightRadius: '44px',
          borderBottomLeftRadius: '34px',
          borderBottomRightRadius: '34px',
        }}
        layout
        initial={false}
        transition={smoothTransition}
      >
        {/* Main Image Container */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            height: imageHeight,
            borderRadius: '34px',
            boxShadow: framerShadow,
          }}
          layout
          transition={smoothTransition}
        >
          {/* Image or Fallback */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : imageFallback ? (
            <div className="absolute inset-0 w-full h-full">
              {imageFallback}
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600" />
          )}

          {/* Progressive Blur Effect */}
          <ProgressiveBlur blurAmount={10} direction="toBottom" />

          {/* Corner Avatar Overlay */}
          {avatarOverlay && (
            <div className="absolute top-3 left-3 z-20">
              {avatarOverlay}
            </div>
          )}

          {/* Text Overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 z-10"
            initial="hidden"
            animate="visible"
            variants={framerCardVariants.contentStagger}
          >
            <motion.h1
              className="text-lg font-medium text-white mb-0.5"
              variants={framerCardVariants.item}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="text-xs text-white/60"
                variants={framerCardVariants.item}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence mode="wait">
          {isExpanded && children && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={smoothTransition}
              className="overflow-hidden"
            >
              <div className="bg-black/20 backdrop-blur-sm rounded-[24px] p-4">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={framerCardVariants.contentStagger}
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chevron Button - No Background */}
        {!hideExpandButton && (
          <motion.button
            onClick={handleToggle}
            className="w-full py-1 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={smoothTransition}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={smoothTransition}
            >
              <ChevronDown className="w-5 h-5 text-white/50 hover:text-white/70 transition-colors" />
            </motion.span>
          </motion.button>
        )}
      </motion.div>
    );
  }
);

ShowcaseCard.displayName = "ShowcaseCard";

// Re-export for convenience
export type { ShowcaseCardProps };
