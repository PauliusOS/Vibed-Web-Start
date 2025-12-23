"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Entrance animation styles */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-entrance {
          opacity: 0;
          animation: fadeSlideIn 0.6s ease-out forwards;
        }
      `}</style>
      {/* Background - matches invite page hover state */}
      <div className="absolute inset-0" style={{ background: '#030303' }} />
      {/* Blue gradient from bottom - same as invite hover state */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 25%, rgba(59, 130, 246, 0.06) 50%, transparent 75%)`,
        }}
      />

      {/* Login Card */}
      <div className="relative w-full max-w-sm mx-4">
        <div
          className="relative backdrop-blur-xl rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(15, 15, 25, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-2">
            <div className="mb-6 animate-entrance" style={{ animationDelay: '0ms' }}>
              <Image
                src="/logos/SylcRoad_Logo_White.png"
                alt="SylcRoad"
                width={180}
                height={42}
                className="h-8 w-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold text-white animate-entrance" style={{ animationDelay: '80ms' }}>Sign In</h1>
            <p className="text-white/50 mt-1 text-sm animate-entrance" style={{ animationDelay: '120ms' }}>Keep it all together and you'll be fine</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4">
            {/* Email/Phone Field */}
            <div className="relative animate-entrance" style={{ animationDelay: '180ms' }}>
              <div
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), rgba(96, 165, 250, 0.4), transparent)"
                }}
              />
              <Input
                id="email"
                type="text"
                placeholder="Email or Phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-white/40 font-mono text-sm",
                  "focus:border-blue-500/50 focus:ring-0 focus:bg-white/[0.05]",
                  "transition-all duration-200 rounded-lg"
                )}
              />
            </div>

            {/* Password Field */}
            <div className="relative animate-entrance" style={{ animationDelay: '240ms' }}>
              <div
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)"
                }}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-white/40 font-mono text-sm pr-16",
                  "focus:border-blue-500/50 focus:ring-0 focus:bg-white/[0.05]",
                  "transition-all duration-200 rounded-lg"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors text-sm font-mono cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="animate-entrance" style={{ animationDelay: '300ms' }}>
              <Link
                href="#"
                className="text-sm text-white/50 hover:text-white/70 transition-colors font-mono"
              >
                Forgot Password
              </Link>
            </div>

            {/* Sign In Button */}
            <div className="animate-entrance" style={{ animationDelay: '360ms' }}>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
                  "text-white font-medium transition-all duration-200 rounded-lg cursor-pointer",
                  "shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative py-2 animate-entrance" style={{ animationDelay: '420ms' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/40">or</span>
              </div>
            </div>

            {/* Sign in with Apple */}
            <div className="animate-entrance" style={{ animationDelay: '480ms' }}>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full h-12 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06] hover:border-white/15",
                  "transition-all duration-200 rounded-lg font-medium cursor-pointer"
                )}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Sign in with Apple
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
