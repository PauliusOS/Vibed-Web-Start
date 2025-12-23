"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface InviteCardProps {
  inviterName: string;
  organizationName: string;
  role: string;
  onAccept: () => void;
}

export function InviteCard({
  inviterName,
  organizationName,
  role,
  onAccept,
}: InviteCardProps) {
  return (
    <div
      className="w-[320px] backdrop-blur-sm rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "rgba(15, 15, 25, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Header with logo */}
      <div className="px-6 pt-6 pb-2 text-center">
        <div className="mb-4 flex justify-center">
          <Image
            src="/logos/SylcRoad_Logo_White.png"
            alt="SylcRoad"
            width={140}
            height={32}
            className="h-7 w-auto"
          />
        </div>

        {/* Invitation message */}
        <h1 className="text-xl font-semibold text-white mb-1">
          You're Invited!
        </h1>
        <p className="text-white/50 text-sm">
          Join {organizationName}
        </p>
      </div>

      {/* Invite details */}
      <div className="px-6 py-4 space-y-4">
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
          <p className="text-white font-medium">{inviterName}</p>
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
            {role}
          </span>
        </div>
      </div>

      {/* Accept button */}
      <div className="px-6 pb-6">
        <Button
          onClick={onAccept}
          className={cn(
            "w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
            "text-white font-medium transition-all duration-200 rounded-lg",
            "shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
          )}
        >
          Accept Invitation
        </Button>

        <p className="text-white/30 text-xs text-center mt-3">
          By accepting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
