"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LetterAnimation } from "@/components/invite/LetterAnimation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [inviteData, setInviteData] = useState<{
    inviterName: string;
    organizationName: string;
    role: string;
    email: string;
  } | null>(null);

  // Simulate loading invite data (replace with Convex query)
  useEffect(() => {
    const loadInvite = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Mock data - replace with actual Convex query
      setInviteData({
        inviterName: "John Doe",
        organizationName: "SylcRoad",
        role: "Creator",
        email: "invited@example.com",
      });
      setIsLoading(false);
    };
    loadInvite();
  }, [token]);

  const handleAccept = () => {
    // Redirect to login/signup with email prefilled
    router.push(`/login?email=${encodeURIComponent(inviteData?.email || "")}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background - Same as login page */}
      <div className="absolute inset-0 bg-[#0a0a12]">
        {/* Large blue radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 50% at 30% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%)`
          }}
        />
        {/* Subtle blue glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />

        {/* Ambient particles in background - static positions to avoid hydration mismatch */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { left: 12, top: 8, delay: 0.2, duration: 2.5 },
            { left: 85, top: 15, delay: 1.1, duration: 3.2 },
            { left: 23, top: 42, delay: 0.8, duration: 2.8 },
            { left: 67, top: 28, delay: 2.1, duration: 3.5 },
            { left: 45, top: 72, delay: 0.5, duration: 2.2 },
            { left: 92, top: 55, delay: 1.8, duration: 3.1 },
            { left: 8, top: 88, delay: 2.5, duration: 2.6 },
            { left: 78, top: 82, delay: 0.3, duration: 3.8 },
            { left: 35, top: 18, delay: 1.5, duration: 2.4 },
            { left: 58, top: 95, delay: 2.8, duration: 3.3 },
            { left: 15, top: 62, delay: 0.9, duration: 2.9 },
            { left: 88, top: 38, delay: 1.2, duration: 3.6 },
            { left: 42, top: 5, delay: 2.2, duration: 2.7 },
            { left: 72, top: 68, delay: 0.6, duration: 3.4 },
            { left: 5, top: 32, delay: 1.9, duration: 2.3 },
            { left: 95, top: 78, delay: 2.4, duration: 3.0 },
            { left: 28, top: 92, delay: 0.4, duration: 3.7 },
            { left: 62, top: 12, delay: 1.6, duration: 2.1 },
            { left: 48, top: 48, delay: 2.7, duration: 3.9 },
            { left: 82, top: 25, delay: 1.0, duration: 2.0 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Loading invitation...</p>
          </div>
        ) : (
          <>
            {/* Letter Animation */}
            <LetterAnimation isOpen={isLetterOpen} />

            {/* Invite details card */}
            <div
              className="mt-6 w-full max-w-sm backdrop-blur-sm rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "rgba(15, 15, 25, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Invite details */}
              <div className="px-6 py-5 space-y-4">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-xl font-semibold text-white">You're Invited!</h1>
                  <p className="text-white/50 text-sm mt-1">Join {inviteData?.organizationName}</p>
                </div>

                {/* Inviter info */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Invited by
                  </p>
                  <p className="text-white font-medium">{inviteData?.inviterName}</p>
                </div>

                {/* Role badge */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/50 text-sm">You'll join as</span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    )}
                  >
                    {inviteData?.role}
                  </span>
                </div>

                {/* Accept button - triggers letter open on hover */}
                <Button
                  onClick={handleAccept}
                  onMouseEnter={() => setIsLetterOpen(true)}
                  onMouseLeave={() => setIsLetterOpen(false)}
                  className={cn(
                    "w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
                    "text-white font-medium transition-all duration-200 rounded-lg",
                    "shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                  )}
                >
                  Accept Invitation
                </Button>

                <p className="text-white/30 text-xs text-center">
                  By accepting, you agree to our Terms of Service
                </p>
              </div>
            </div>

            {/* Hint text */}
            <p className="text-white/30 text-xs mt-4">
              Hover over the button to reveal your invitation
            </p>
          </>
        )}
      </div>
    </div>
  );
}
