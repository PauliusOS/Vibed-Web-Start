"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlayCircleIcon,
  EyeIcon,
  DollarSignIcon,
  ChevronRightIcon,
  InstagramIcon,
  VideoIcon
} from "lucide-react";
import { formatNumber, formatCurrency, getPlatformColor } from "@/lib/utils/campaignCalculations";
import type { Id } from "@/convex/_generated/dataModel";

interface CreatorCarouselCardProps {
  creator: {
    userId: string;
    username: string;
    avatarUrl?: string;
    platform: "instagram" | "tiktok";
    videosPosted: number;
    totalViews: number;
    paymentAmount: number;
    paymentStatus: "pending" | "paid" | "cancelled";
    engagementRate?: number;
  };
  onClick?: () => void;
  className?: string;
}

export function CreatorCarouselCard({
  creator,
  onClick,
  className,
}: CreatorCarouselCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500",
      paid: "bg-green-500/10 text-green-500",
      cancelled: "bg-red-500/10 text-red-500",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        ${isHovered ? "border-primary/50 shadow-lg shadow-primary/20" : "border-border"}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay on hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
      />

      <CardContent className="p-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar with pulse effect */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={creator.avatarUrl} alt={creator.username} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(creator.username)}
              </AvatarFallback>
            </Avatar>

            {/* Active indicator pulse */}
            {isHovered && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-3 w-3"
                style={{
                  animation: "pulse-distort 2s ease-in-out infinite",
                }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </div>

          {/* Creator info and metrics */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {creator.username}
              </h3>
              <Badge className={getPlatformColor(creator.platform)}>
                {creator.platform === "instagram" ? (
                  <InstagramIcon className="h-3 w-3 mr-1" />
                ) : (
                  <VideoIcon className="h-3 w-3 mr-1" />
                )}
                {creator.platform}
              </Badge>
              <Badge className={getPaymentStatusColor(creator.paymentStatus)}>
                {creator.paymentStatus}
              </Badge>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Videos Posted */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10">
                  <PlayCircleIcon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Videos</span>
                  <span className="text-sm font-semibold text-foreground">
                    {creator.videosPosted}
                  </span>
                </div>
              </div>

              {/* Total Views */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-green-500/10">
                  <EyeIcon className="h-3.5 w-3.5 text-green-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Views</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatNumber(creator.totalViews)}
                  </span>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-blue-500/10">
                  <DollarSignIcon className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Payment</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(creator.paymentAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement rate bar (if available) */}
            {creator.engagementRate !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Engagement</span>
                  <span className="text-xs font-medium text-foreground">
                    {creator.engagementRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(creator.engagementRate, 100)}%`,
                      boxShadow: isHovered
                        ? "0 0 8px rgba(59,130,246,0.6)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Expand indicator */}
          <div
            className={`
              flex items-center justify-center h-8 w-8 rounded-full
              bg-primary/10 transition-all duration-300
              ${isHovered ? "bg-primary/20 scale-110" : "scale-100"}
            `}
          >
            <ChevronRightIcon
              className={`
                h-4 w-4 text-primary transition-transform duration-300
                ${isHovered ? "translate-x-0.5" : ""}
              `}
            />
          </div>
        </div>
      </CardContent>

      {/* Bottom glow effect on hover */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-primary to-transparent
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{
          boxShadow: isHovered
            ? "0 0 8px rgba(59,130,246,0.5), 0 0 16px rgba(59,130,246,0.3)"
            : "none",
        }}
      />
    </Card>
  );
}
