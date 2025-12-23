"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvitationStatusBadge } from "./InvitationStatusBadge";
import { InvitationActions, InvitationQuickActions } from "./InvitationActions";
import {
  Search,
  ArrowUpDown,
  Mail,
  Download,
} from "lucide-react";

type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

export interface Invitation {
  id: string;
  creatorName: string | null;
  creatorEmail: string | null;
  campaignName: string | null;
  status: InvitationStatus;
  sentAt: number;
  respondedAt: number | null;
  expiresAt: number;
  invitationLink?: string;
}

interface InvitationTableProps {
  invitations: Invitation[];
  isLoading?: boolean;
  onResend?: (invitationId: string) => void;
  onCancel?: (invitationId: string) => void;
  onView?: (invitationId: string) => void;
  onCopyLink?: (link: string) => void;
  onExport?: () => void;
}

type SortField = "creatorName" | "sentAt" | "status" | "campaignName";
type SortDirection = "asc" | "desc";

export function InvitationTable({
  invitations,
  isLoading,
  onResend,
  onCancel,
  onView,
  onCopyLink,
  onExport,
}: InvitationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("sentAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedInvitations, setSelectedInvitations] = useState<Set<string>>(new Set());

  // Filter invitations
  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      (invitation.creatorEmail?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (invitation.creatorName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (invitation.campaignName?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === "all" || invitation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort invitations
  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (sortField) {
      case "creatorName":
        aVal = a.creatorName || a.creatorEmail || "";
        bVal = b.creatorName || b.creatorEmail || "";
        break;
      case "campaignName":
        aVal = a.campaignName || "";
        bVal = b.campaignName || "";
        break;
      case "sentAt":
        aVal = a.sentAt;
        bVal = b.sentAt;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedInvitations);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedInvitations(newSelection);
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(timestamp);
  };

  // Render sort button
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 ${
          sortField === field ? "text-purple-400" : "text-white/40"
        }`}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GlassPanel className="p-4">
          <div className="h-10 animate-pulse bg-white/[0.04] rounded" />
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-white/[0.04] rounded" />
            ))}
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <GlassPanel className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search by name, email, or campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[180px] bg-white/[0.02] border-white/[0.06] text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="text-white/60 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedInvitations.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 pt-4 border-t border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  {selectedInvitations.size} invitation
                  {selectedInvitations.size !== 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    Resend Selected
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInvitations(new Set())}
                    className="text-white/60 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>

      {/* Table */}
      {sortedInvitations.length === 0 ? (
        <GlassPanel className="p-12">
          <div className="text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-30" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {invitations.length === 0
                ? "No invitations yet"
                : "No invitations found"}
            </h3>
            <p className="text-white/60">
              {invitations.length === 0
                ? "Send your first invitation to start building your creator roster"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    className="rounded border-white/[0.2]"
                    checked={
                      selectedInvitations.size === sortedInvitations.length &&
                      sortedInvitations.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvitations(
                          new Set(sortedInvitations.map((i) => i.id))
                        );
                      } else {
                        setSelectedInvitations(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="text-white/60">
                  <SortButton field="creatorName" label="Creator" />
                </TableHead>
                <TableHead className="text-white/60">
                  <SortButton field="campaignName" label="Campaign" />
                </TableHead>
                <TableHead className="text-white/60">
                  <SortButton field="status" label="Status" />
                </TableHead>
                <TableHead className="text-white/60">
                  <SortButton field="sentAt" label="Sent" />
                </TableHead>
                <TableHead className="text-white/60">Responded</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvitations.map((invitation, index) => (
                <motion.tr
                  key={invitation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-white/[0.2]"
                      checked={selectedInvitations.has(invitation.id)}
                      onChange={() => toggleSelection(invitation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(invitation.creatorName?.[0] ||
                          invitation.creatorEmail?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {invitation.creatorName || "Invited Creator"}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {invitation.creatorEmail || "No email"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {invitation.campaignName ? (
                      <span className="text-sm text-white">
                        {invitation.campaignName}
                      </span>
                    ) : (
                      <span className="text-sm text-white/40">General</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <InvitationStatusBadge status={invitation.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-white/60">
                      {formatTimeAgo(invitation.sentAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {invitation.respondedAt ? (
                      <span className="text-sm text-white/60">
                        {formatDate(invitation.respondedAt)}
                      </span>
                    ) : (
                      <span className="text-sm text-white/40">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <InvitationQuickActions
                        invitationId={invitation.id}
                        status={invitation.status}
                        onResend={onResend}
                        onCancel={onCancel}
                      />
                      <InvitationActions
                        invitationId={invitation.id}
                        status={invitation.status}
                        invitationLink={invitation.invitationLink}
                        onResend={onResend}
                        onCancel={onCancel}
                        onView={onView}
                        onCopyLink={onCopyLink}
                      />
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Results count */}
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <p className="text-sm text-white/60">
              Showing {sortedInvitations.length} of {invitations.length} invitation
              {invitations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
