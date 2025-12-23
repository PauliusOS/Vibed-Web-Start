"use client";

import { motion } from "motion/react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  Mail,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export interface InvitationStatsData {
  totalInvitations: number;
  pendingCount: number;
  acceptedCount: number;
  responseRate: number;
}

interface InvitationStatsProps {
  stats?: InvitationStatsData;
  isLoading?: boolean;
}

export function InvitationStats({ stats, isLoading }: InvitationStatsProps) {
  const pendingPercentage = stats?.totalInvitations
    ? Math.round((stats.pendingCount / stats.totalInvitations) * 100)
    : 0;

  const acceptedPercentage = stats?.totalInvitations
    ? Math.round((stats.acceptedCount / stats.totalInvitations) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <GlassPanel key={i} className="p-4 animate-pulse">
            <div className="h-16" />
          </GlassPanel>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.totalInvitations ?? 0}
              </p>
              <p className="text-xs text-white/60">Total Invitations</p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.pendingCount ?? 0}
              </p>
              <p className="text-xs text-white/60">
                Pending{" "}
                {pendingPercentage > 0 && (
                  <span className="text-amber-400">({pendingPercentage}%)</span>
                )}
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.acceptedCount ?? 0}
              </p>
              <p className="text-xs text-white/60">
                Accepted{" "}
                {acceptedPercentage > 0 && (
                  <span className="text-emerald-400">({acceptedPercentage}%)</span>
                )}
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <GlassPanel className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.responseRate ?? 0}%
              </p>
              <p className="text-xs text-white/60">Response Rate</p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
