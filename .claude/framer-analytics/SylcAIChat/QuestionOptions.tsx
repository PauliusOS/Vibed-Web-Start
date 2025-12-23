"use client";

import { motion } from "motion/react";
import { FRAMER_TEXT_COLORS } from "../constants/colors";

interface QuestionOption {
  id: string;
  label: string;
}

interface QuestionOptionsProps {
  options: QuestionOption[];
  onSelect: (optionId: string, optionLabel: string) => void;
}

export function QuestionOptions({ options, onSelect }: QuestionOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
          onClick={() => onSelect(option.id, option.label)}
          className="px-4 py-3 rounded-xl text-left transition-all"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          whileHover={{ 
            backgroundColor: "rgba(139, 92, 246, 0.15)",
            borderColor: "rgba(139, 92, 246, 0.3)",
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span 
            className="text-sm font-medium"
            style={{ color: FRAMER_TEXT_COLORS.primary }}
          >
            {option.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
