"use client";

import { useUser } from "@clerk/nextjs";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface WelcomeHeaderProps {
  greeting?: string;
}

export function WelcomeHeader({ greeting }: WelcomeHeaderProps) {
  const { user } = useUser();

  const firstName = user?.firstName || "Admin";
  const today = new Date();
  const hour = today.getHours();

  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayGreeting = greeting || `${timeGreeting}, ${firstName}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {displayGreeting}
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Here&apos;s what&apos;s happening across your campaigns
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/40">
        <Calendar className="w-4 h-4" />
        <span>{format(today, "EEEE, MMMM d, yyyy")}</span>
      </div>
    </div>
  );
}

export default WelcomeHeader;
