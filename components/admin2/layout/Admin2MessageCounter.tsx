"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Admin2MessageCounter() {
  const { selectedOrganizationId } = useOrganization();

  // Real-time subscription to unread message count
  const unreadCount = useQuery(
    api.messages.getUnreadCount,
    selectedOrganizationId
      ? { organizationId: selectedOrganizationId }
      : "skip"
  );

  const count = unreadCount || 0;

  return (
    <Link href="/admin2/messages">
      <Button variant="ghost" size="icon" className="relative">
        <MessageSquare className="h-5 w-5" />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white flex items-center justify-center"
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </Button>
    </Link>
  );
}
