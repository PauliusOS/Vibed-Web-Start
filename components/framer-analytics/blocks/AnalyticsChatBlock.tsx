"use client";

import { FramerChat } from "../FramerChat";
import { FramerCard } from "../FramerCard";
import { FRAMER_TEXT_COLORS, FRAMER_TYPOGRAPHY } from "../constants/colors";

interface AnalyticsChatBlockProps {
  /** Chat mode */
  mode?: "inline" | "floating";
  /** Title for inline mode */
  title?: string;
  /** Whether floating chat is open by default */
  defaultOpen?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * AnalyticsChatBlock
 * 
 * AI chat assistant block for analytics insights.
 * 
 * @example
 * ```tsx
 * // Inline embedded chat
 * <AnalyticsChatBlock mode="inline" title="AI Assistant" />
 * 
 * // Floating widget (bottom-right)
 * <AnalyticsChatBlock mode="floating" defaultOpen={false} />
 * ```
 */
export function AnalyticsChatBlock({
  mode = "inline",
  title = "AI Analytics Assistant",
  defaultOpen = false,
  className,
}: AnalyticsChatBlockProps) {
  if (mode === "floating") {
    return <FramerChat mode="floating" defaultOpen={defaultOpen} />;
  }

  return (
    <div className={className}>
      {title && (
        <h3
          className="font-semibold mb-4"
          style={{
            color: FRAMER_TEXT_COLORS.primary,
            fontFamily: FRAMER_TYPOGRAPHY.body,
            fontWeight: FRAMER_TYPOGRAPHY.weights.semibold,
            fontSize: "16px",
          }}
        >
          {title}
        </h3>
      )}
      <FramerChat mode="inline" />
    </div>
  );
}

export default AnalyticsChatBlock;


















