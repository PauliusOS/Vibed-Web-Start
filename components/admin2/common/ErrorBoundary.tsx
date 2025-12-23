"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { motion } from "motion/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
          </motion.div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-white/60">
              We encountered an unexpected error. Don't worry, we're on it!
            </p>
          </div>

          {/* Error Details (Dev Mode) */}
          {isDevelopment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.2 }}
              className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
            >
              <p className="text-sm font-semibold text-red-400 mb-2">
                Error Details (Development Mode):
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-white/60">Message:</p>
                  <p className="text-sm text-white/90 font-mono break-all">
                    {error.message}
                  </p>
                </div>
                {error.stack && (
                  <div>
                    <p className="text-xs text-white/60">Stack Trace:</p>
                    <pre className="text-xs text-white/70 font-mono overflow-auto max-h-48 p-2 bg-black/20 rounded mt-1">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="text-white/60 hover:text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-sm text-white/60">
              If this problem persists, please contact support or try refreshing
              the page.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Compact error fallback for smaller components
export function CompactErrorFallback({
  error,
  reset,
}: DefaultErrorFallbackProps) {
  return (
    <div className="p-6 bg-white/[0.02] border border-red-500/20 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium mb-1">Error occurred</h3>
          <p className="text-sm text-white/60 mb-3">{error.message}</p>
          <Button
            onClick={reset}
            size="sm"
            variant="outline"
            className="text-white/60 hover:text-white"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
