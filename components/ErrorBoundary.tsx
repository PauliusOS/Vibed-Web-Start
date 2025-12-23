"use client";

import React, { Component, ReactNode } from "react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { GlassButton } from "@/components/dashboard/GlassButton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you would log to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard variant="elevated" className="max-w-2xl mx-auto">
            <div className="p-8 text-center">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>

              {/* Error Message */}
              <h2 className="text-2xl font-semibold text-white/90 mb-2">
                Something went wrong
              </h2>
              <p className="text-white/50 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-left">
                  <p className="text-xs font-mono text-red-400 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-[10px] font-mono text-white/40 overflow-x-auto">
                      {this.state.error.stack.slice(0, 500)}
                    </pre>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <GlassButton
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Reload Page
                </GlassButton>
                <GlassButton
                  variant="primary"
                  onClick={this.handleReset}
                >
                  Try Again
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
