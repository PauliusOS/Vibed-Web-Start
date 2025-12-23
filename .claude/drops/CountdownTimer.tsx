"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  expiresAt: number;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(expiresAt: number): TimeLeft {
  const now = Date.now();
  const diff = expiresAt - now;

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function CountdownTimer({ expiresAt, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (timeLeft.isExpired) {
    return (
      <Card className={cn("bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20", className)}>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
            This Opportunity Has Expired
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new opportunities
          </p>
        </CardContent>
      </Card>
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <Card className={cn("bg-gradient-to-br from-primary/10 via-card to-card border-border shadow-lg", className)}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Time Remaining</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Don't miss out on this limited-time opportunity
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {timeUnits.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="text-4xl font-bold text-foreground tabular-nums">
                  {value.toString().padStart(2, "0")}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
