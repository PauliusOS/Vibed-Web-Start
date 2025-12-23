"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Send,
  Eye,
  XCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

interface InvitationActionsProps {
  invitationId: string;
  status: InvitationStatus;
  invitationLink?: string;
  onResend?: (invitationId: string) => void;
  onCancel?: (invitationId: string) => void;
  onView?: (invitationId: string) => void;
  onCopyLink?: (link: string) => void;
}

export function InvitationActions({
  invitationId,
  status,
  invitationLink,
  onResend,
  onCancel,
  onView,
  onCopyLink,
}: InvitationActionsProps) {
  const canResend = status === "pending" || status === "expired";
  const canCancel = status === "pending";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white/60 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#0a0a0a] border-white/[0.06] text-white"
      >
        <DropdownMenuItem
          onClick={() => onView?.(invitationId)}
          className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>

        {invitationLink && (
          <DropdownMenuItem
            onClick={() => onCopyLink?.(invitationLink)}
            className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Invitation Link
          </DropdownMenuItem>
        )}

        {invitationLink && (
          <DropdownMenuItem
            onClick={() => window.open(invitationLink, "_blank")}
            className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Invitation Link
          </DropdownMenuItem>
        )}

        {canResend && (
          <>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={() => onResend?.(invitationId)}
              className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06] text-amber-400"
            >
              <Send className="h-4 w-4 mr-2" />
              Resend Invitation
            </DropdownMenuItem>
          </>
        )}

        {canCancel && (
          <>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={() => onCancel?.(invitationId)}
              className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06] text-red-400"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Invitation
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick action buttons for inline use
interface InvitationQuickActionsProps {
  invitationId: string;
  status: InvitationStatus;
  onResend?: (invitationId: string) => void;
  onCancel?: (invitationId: string) => void;
}

export function InvitationQuickActions({
  invitationId,
  status,
  onResend,
  onCancel,
}: InvitationQuickActionsProps) {
  const canResend = status === "pending" || status === "expired";
  const canCancel = status === "pending";

  return (
    <div className="flex items-center gap-1">
      {canResend && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onResend?.(invitationId)}
          className="h-8 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
        >
          <Send className="h-4 w-4" />
        </Button>
      )}
      {canCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel?.(invitationId)}
          className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
