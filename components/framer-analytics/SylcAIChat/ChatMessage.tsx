"use client";

import { motion } from "motion/react";
import { FRAMER_TEXT_COLORS } from "../constants/colors";

interface ChatMessageProps {
  type: "ai" | "user";
  content: string;
}

export function ChatMessage({ type, content }: ChatMessageProps) {
  const isAI = type === "ai";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isAI ? "rounded-bl-md" : "rounded-br-md"
        }`}
        style={{
          backgroundColor: isAI 
            ? "rgba(255, 255, 255, 0.05)" 
            : "rgba(139, 92, 246, 0.2)",
          border: isAI 
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: isAI 
            ? "0 0 20px rgba(139, 92, 246, 0.05)"
            : "none",
        }}
      >
        <p 
          className="text-sm leading-relaxed"
          style={{ color: FRAMER_TEXT_COLORS.primary }}
        >
          {content}
        </p>
      </div>
    </motion.div>
  );
}
