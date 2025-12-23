"use client";

import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  CheckCircle,
  Zap,
  ArrowUpRight,
  Calendar,
  Users,
  Video,
  BarChart3,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    campaigns: number;
    creators: number;
    videos: number;
    storage: number; // in GB
  };
}

interface Subscription {
  plan: Plan;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface Usage {
  campaigns: number;
  creators: number;
  videos: number;
  storage: number; // in GB
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
  usage: Usage;
  onUpgrade: () => void;
  onManage: () => void;
}

export function SubscriptionCard({
  subscription,
  usage,
  onUpgrade,
  onManage,
}: SubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "trialing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "past_due":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "canceled":
        return "bg-white/10 text-white/60 border-white/20";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateUsagePercent = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (value: number) => {
    if (value === -1) return "Unlimited";
    return value.toLocaleString();
  };

  if (!subscription) {
    return (
      <GlassPanel className="p-6">
        <div className="text-center py-8">
          <Crown className="w-16 h-16 mx-auto mb-4 text-amber-400 opacity-30" />
          <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
          <p className="text-white/60 mb-6">
            Choose a plan to unlock all features and start managing your campaigns
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black" onClick={onUpgrade}>
            <Crown className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{subscription.plan.name}</h3>
              <Badge variant="outline" className={getStatusColor(subscription.status)}>
                {subscription.status === "trialing"
                  ? "Trial"
                  : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-white/60">
              ${subscription.plan.price}/{subscription.plan.interval}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-white/70 border-white/20" onClick={onManage}>
          Manage Plan
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Billing Period */}
      <div className="p-4 rounded-lg bg-white/5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Current period ends</span>
          </div>
          <span className="text-white font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
        </div>
        {subscription.cancelAtPeriodEnd && (
          <p className="text-sm text-amber-400 mt-2">
            Your subscription will be canceled at the end of this period
          </p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Current Usage</h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-white/60">Campaigns</span>
              </div>
              <span className="text-white">
                {usage.campaigns} / {formatLimit(subscription.plan.limits.campaigns)}
              </span>
            </div>
            <Progress
              value={calculateUsagePercent(usage.campaigns, subscription.plan.limits.campaigns)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white/60">Creators</span>
              </div>
              <span className="text-white">
                {usage.creators} / {formatLimit(subscription.plan.limits.creators)}
              </span>
            </div>
            <Progress
              value={calculateUsagePercent(usage.creators, subscription.plan.limits.creators)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="text-white/60">Videos</span>
              </div>
              <span className="text-white">
                {usage.videos} / {formatLimit(subscription.plan.limits.videos)}
              </span>
            </div>
            <Progress
              value={calculateUsagePercent(usage.videos, subscription.plan.limits.videos)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span className="text-white/60">Storage</span>
              </div>
              <span className="text-white">
                {usage.storage.toFixed(1)} GB / {formatLimit(subscription.plan.limits.storage)} GB
              </span>
            </div>
            <Progress
              value={calculateUsagePercent(usage.storage, subscription.plan.limits.storage)}
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Plan Features</h4>
        <div className="grid grid-cols-2 gap-2">
          {subscription.plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-white/60">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      {subscription.plan.id !== "enterprise" && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Need more?</p>
              <p className="text-sm text-white/60">Upgrade to unlock higher limits</p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={onUpgrade}
            >
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
