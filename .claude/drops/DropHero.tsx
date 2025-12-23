"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp } from "lucide-react";

interface DropHeroProps {
  title: string;
  campaignName: string;
  slotsRemaining?: number;
  totalSlots?: number;
  expiresAt: number;
  heroImage?: string;
  highlights?: string[];
}

export function DropHero({
  title,
  campaignName,
  slotsRemaining,
  totalSlots,
  expiresAt,
  heroImage,
  highlights = [],
}: DropHeroProps) {
  const calculateTimeLeft = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) return "Expired";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const isExpired = expiresAt < Date.now();

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
        {/* Gradient Background or Image */}
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20">
            <div className="absolute inset-0 bg-[#0A0A0A]/80" />
          </div>
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
          {/* Campaign Badge */}
          <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            {campaignName}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Time Remaining */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Clock className="h-4 w-4 text-white" />
              <span
                className={`font-medium ${
                  isExpired ? "text-red-400" : "text-white"
                }`}
              >
                {calculateTimeLeft(expiresAt)}
              </span>
            </div>

            {/* Slots Remaining */}
            {totalSlots !== undefined && slotsRemaining !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Users className="h-4 w-4 text-white" />
                <span className="font-medium text-white">
                  {slotsRemaining}/{totalSlots} spots left
                </span>
              </div>
            )}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  className="bg-white/5 text-white border-white/10 hover:bg-white/10"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
