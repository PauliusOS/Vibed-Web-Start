"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FRAMER_TEXT_COLORS } from "../constants/colors";

interface SearchingStateProps {
  progress: number;
}

const SEARCH_MESSAGES = [
  "Analyzing your requirements...",
  "Searching 50,000+ creators...",
  "Matching audience demographics...",
  "Finding your perfect creators...",
];

export function SearchingState({ progress }: SearchingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SEARCH_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center py-8"
    >
      {/* Animated search visualization */}
      <div className="relative w-32 h-32 mb-6">
        {/* Outer spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid transparent",
            borderTopColor: "rgba(139, 92, 246, 0.8)",
            borderRightColor: "rgba(139, 92, 246, 0.4)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle spinning ring (opposite direction) */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "rgba(59, 130, 246, 0.6)",
            borderLeftColor: "rgba(59, 130, 246, 0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-6 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg 
            className="w-8 h-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: "rgb(139, 92, 246)" }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </motion.div>
        
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 50;
          
          return (
            <motion.div
              key={index}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.6)",
                left: "calc(50% - 4px)",
                top: "calc(50% - 4px)",
              }}
              animate={{
                x: [0, Math.cos(angle) * radius, 0],
                y: [0, Math.sin(angle) * radius, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div 
        className="w-48 h-1.5 rounded-full overflow-hidden mb-4"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(139, 92, 246, 1) 0%, rgba(59, 130, 246, 1) 100%)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Rotating message */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="text-sm"
        style={{ color: FRAMER_TEXT_COLORS.secondary }}
      >
        {SEARCH_MESSAGES[messageIndex]}
      </motion.p>
    </motion.div>
  );
}
