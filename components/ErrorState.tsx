"use client";

import { GlassCard } from "@/components/dashboard/GlassCard";
import { GlassButton } from "@/components/dashboard/GlassButton";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { motion } from "motion/react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  variant?: "default" | "inline";
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  onRetry,
  showHomeButton = false,
  variant = "default",
}: ErrorStateProps) {
  if (variant === "inline") {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-white/90 mb-1">{title}</h3>
        <p className="text-sm text-white/50 mb-4">{message}</p>
        {onRetry && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </GlassButton>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto"
    >
      <GlassCard variant="elevated">
        <div className="p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-white/90 mb-2">
            {title}
          </h2>
          <p className="text-white/50 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            {showHomeButton && (
              <GlassButton
                variant="ghost"
                onClick={() => (window.location.href = "/")}
                leftIcon={<Home className="h-4 w-4" />}
              >
                Go Home
              </GlassButton>
            )}
            {onRetry && (
              <GlassButton
                variant="primary"
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Try Again
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Specific error state variants for common scenarios
export function NotFoundState() {
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showHomeButton
    />
  );
}

export function UnauthorizedState() {
  return (
    <ErrorState
      title="Unauthorized"
      message="You don't have permission to access this resource."
      showHomeButton
    />
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}
