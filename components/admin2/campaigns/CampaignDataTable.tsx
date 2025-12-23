"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Megaphone,
  Download,
  Archive,
  Trash2,
  Eye,
  Pencil,
  MoreHorizontal,
  Calendar,
  Columns3,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Campaign type with metrics (matches listCampaignsWithMetrics return)
export interface CampaignWithMetrics {
  _id: Id<"campaigns">;
  _creationTime: number;
  organizationId: Id<"organizations">;
  name: string;
  budget: number;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  // Flat metrics from listCampaignsWithMetrics query
  totalReach?: number;
  totalVideos?: number;
  totalSpend?: number;
  dedicatedRoster?: number;
  cpm?: number;
  progressPercent?: number;
  creatorCount?: number;
  // Legacy nested metrics (for backwards compatibility with other views)
  metrics?: {
    totalVideos?: number;
    totalCreators?: number;
    totalViews?: number;
    totalSpend?: number;
  };
  // Optional client info
  clientName?: string;
}

interface CampaignDataTableProps {
  campaigns: CampaignWithMetrics[];
  isLoading?: boolean;
  selectedCampaigns: Set<Id<"campaigns">>;
  onSelectionChange: (selection: Set<Id<"campaigns">>) => void;
  onAssignCreator?: (campaignId: Id<"campaigns">) => void;
}

type SortField = "name" | "status" | "budget" | "totalSpend" | "totalVideos" | "totalCreators" | "startDate" | "endDate" | "totalViews";
type SortDirection = "asc" | "desc";

// Column visibility configuration
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "name", label: "Campaign", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "budget", label: "Budget / Spent", visible: true },
  { id: "totalVideos", label: "Videos", visible: true },
  { id: "totalCreators", label: "Creators", visible: true },
  { id: "totalViews", label: "Views", visible: true },
  { id: "startDate", label: "Start Date", visible: true },
  { id: "endDate", label: "End Date", visible: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function CampaignDataTable({
  campaigns,
  isLoading,
  selectedCampaigns,
  onSelectionChange,
  onAssignCreator,
}: CampaignDataTableProps) {
  const router = useRouter();

  // State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [budgetRange, setBudgetRange] = useState<{ min?: number; max?: number }>({});
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mutations
  const archiveCampaign = useMutation(api.campaigns.archiveCampaign);
  const deleteCampaign = useMutation(api.campaigns.permanentlyDeleteCampaign);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Search filter
      const matchesSearch =
        search === "" ||
        campaign.name.toLowerCase().includes(search.toLowerCase()) ||
        campaign.clientName?.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;

      // Date range filter
      const matchesDateRange =
        (!dateRange.start || (campaign.startDate && campaign.startDate >= new Date(dateRange.start).getTime())) &&
        (!dateRange.end || (campaign.endDate && campaign.endDate <= new Date(dateRange.end).getTime()));

      // Budget range filter
      const matchesBudget =
        (budgetRange.min === undefined || campaign.budget >= budgetRange.min * 100) &&
        (budgetRange.max === undefined || campaign.budget <= budgetRange.max * 100);

      return matchesSearch && matchesStatus && matchesDateRange && matchesBudget;
    });
  }, [campaigns, search, statusFilter, dateRange, budgetRange]);

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "budget":
          aVal = a.budget;
          bVal = b.budget;
          break;
        case "totalSpend":
          aVal = a.totalSpend || a.metrics?.totalSpend || 0;
          bVal = b.totalSpend || b.metrics?.totalSpend || 0;
          break;
        case "totalVideos":
          aVal = a.totalVideos || a.metrics?.totalVideos || 0;
          bVal = b.totalVideos || b.metrics?.totalVideos || 0;
          break;
        case "totalCreators":
          aVal = a.creatorCount || a.metrics?.totalCreators || 0;
          bVal = b.creatorCount || b.metrics?.totalCreators || 0;
          break;
        case "totalViews":
          aVal = a.totalReach || a.metrics?.totalViews || 0;
          bVal = b.totalReach || b.metrics?.totalViews || 0;
          break;
        case "startDate":
          aVal = a.startDate || 0;
          bVal = b.startDate || 0;
          break;
        case "endDate":
          aVal = a.endDate || 0;
          bVal = b.endDate || 0;
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
  }, [filteredCampaigns, sortField, sortDirection]);

  // Paginate campaigns
  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedCampaigns.slice(start, start + pageSize);
  }, [sortedCampaigns, page, pageSize]);

  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);

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
  const toggleSelection = (id: Id<"campaigns">) => {
    const newSelection = new Set(selectedCampaigns);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedCampaigns.size === paginatedCampaigns.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(paginatedCampaigns.map((c) => c._id)));
    }
  };

  // Toggle column visibility
  const toggleColumn = (columnId: string) => {
    setColumns(columns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  // Get visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  // Format date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      active: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
      draft: { bg: "bg-gray-500/20", text: "text-gray-400" },
      paused: { bg: "bg-amber-500/20", text: "text-amber-400" },
      completed: { bg: "bg-blue-500/20", text: "text-blue-400" },
      archived: { bg: "bg-purple-500/20", text: "text-purple-400" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Campaign Name",
      "Status",
      "Budget",
      "Spent",
      "Videos",
      "Creators",
      "Views",
      "Start Date",
      "End Date",
    ];

    const campaignsToExport = selectedCampaigns.size > 0
      ? sortedCampaigns.filter((c) => selectedCampaigns.has(c._id))
      : sortedCampaigns;

    const rows = campaignsToExport.map((c) => [
      c.name,
      c.status,
      formatCurrency(c.budget),
      formatCurrency(c.totalSpend || c.metrics?.totalSpend || 0),
      c.totalVideos || c.metrics?.totalVideos || 0,
      c.creatorCount || c.metrics?.totalCreators || 0,
      c.totalReach || c.metrics?.totalViews || 0,
      formatDate(c.startDate),
      formatDate(c.endDate),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaigns-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Campaigns exported to CSV");
  };

  // Bulk archive
  const handleBulkArchive = async () => {
    try {
      const promises = Array.from(selectedCampaigns).map((id) =>
        archiveCampaign({ campaignId: id })
      );
      await Promise.all(promises);
      toast.success(`${selectedCampaigns.size} campaign(s) archived`);
      onSelectionChange(new Set());
    } catch {
      toast.error("Failed to archive campaigns");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    try {
      const promises = Array.from(selectedCampaigns).map((id) =>
        deleteCampaign({ campaignId: id })
      );
      await Promise.all(promises);
      toast.success(`${selectedCampaigns.size} campaign(s) deleted`);
      onSelectionChange(new Set());
      setShowDeleteConfirm(false);
    } catch {
      toast.error("Failed to delete campaigns");
    }
  };

  // Render sort button
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors text-left"
    >
      {label}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="h-3 w-3 text-blue-400" />
        ) : (
          <ArrowDown className="h-3 w-3 text-blue-400" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 text-white/40" />
      )}
    </button>
  );

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateRange({});
    setBudgetRange({});
    setPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "all" || dateRange.start || dateRange.end || budgetRange.min || budgetRange.max;

  if (isLoading) {
    return (
      <GlassPanel className="p-4">
        <div className="space-y-4">
          <div className="h-10 animate-pulse bg-white/[0.04] rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-white/[0.04] rounded" />
          ))}
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <GlassPanel className="p-4">
        <div className="flex flex-col gap-4">
          {/* Row 1: Search and primary filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[160px] bg-white/[0.02] border-white/[0.06] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range - Start */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="date"
                placeholder="Start Date"
                value={dateRange.start || ""}
                onChange={(e) => {
                  setDateRange({ ...dateRange, start: e.target.value });
                  setPage(1);
                }}
                className="pl-10 w-full lg:w-[160px] bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>

            {/* Date Range - End */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="date"
                placeholder="End Date"
                value={dateRange.end || ""}
                onChange={(e) => {
                  setDateRange({ ...dateRange, end: e.target.value });
                  setPage(1);
                }}
                className="pl-10 w-full lg:w-[160px] bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>

            {/* Column visibility dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                >
                  <Columns3 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0a0a0a] border-white/[0.06]" align="end">
                <DropdownMenuLabel className="text-white/60">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumn(column.id)}
                    className="text-white"
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToCSV}
              className="text-white/60 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/40">Active filters:</span>
              {search && (
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                  Search: {search}
                  <button onClick={() => setSearch("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(dateRange.start || dateRange.end) && (
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                  Date: {dateRange.start || "..."} - {dateRange.end || "..."}
                  <button onClick={() => setDateRange({})}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-white/40 hover:text-white text-xs h-6 px-2"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedCampaigns.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-4 border-t border-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    {selectedCampaigns.size} campaign{selectedCampaigns.size !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBulkArchive}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportToCSV}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectionChange(new Set())}
                      className="text-white/60 hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassPanel>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Campaigns</h3>
              </div>
              <p className="text-white/60 mb-6">
                Are you sure you want to permanently delete {selectedCampaigns.size} campaign{selectedCampaigns.size !== 1 ? "s" : ""}?
                This action cannot be undone and will remove all associated videos, payments, and data.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {sortedCampaigns.length === 0 ? (
        <GlassPanel className="p-12">
          <div className="text-center">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-30" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {campaigns.length === 0 ? "No campaigns yet" : "No campaigns found"}
            </h3>
            <p className="text-white/60">
              {campaigns.length === 0
                ? "Create your first campaign to start tracking"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="w-[40px] sticky left-0 bg-[#0a0a0a] z-10">
                    <Checkbox
                      checked={
                        selectedCampaigns.size === paginatedCampaigns.length &&
                        paginatedCampaigns.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      className="border-white/[0.2]"
                    />
                  </TableHead>
                  {visibleColumns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={`text-white/60 ${column.id === "name" ? "sticky left-[40px] bg-[#0a0a0a] z-10" : ""}`}
                    >
                      <SortButton field={column.id as SortField} label={column.label} />
                    </TableHead>
                  ))}
                  <TableHead className="text-white/60 text-right sticky right-0 bg-[#0a0a0a] z-10">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCampaigns.map((campaign, index) => {
                  const spent = campaign.totalSpend || campaign.metrics?.totalSpend || 0;
                  const spentPercent = campaign.budget > 0 ? (spent / campaign.budget) * 100 : 0;

                  return (
                    <motion.tr
                      key={campaign._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={(e) => {
                        // Only navigate if not clicking on checkbox or action buttons
                        const target = e.target as HTMLElement;
                        if (!target.closest("button") && !target.closest('[role="checkbox"]')) {
                          router.push(`/admin2/campaigns/${campaign._id}`);
                        }
                      }}
                    >
                      <TableCell className="sticky left-0 bg-[#0a0a0a]">
                        <Checkbox
                          checked={selectedCampaigns.has(campaign._id)}
                          onCheckedChange={() => toggleSelection(campaign._id)}
                          className="border-white/[0.2]"
                        />
                      </TableCell>

                      {/* Campaign Name + Client */}
                      {columns.find((c) => c.id === "name")?.visible && (
                        <TableCell className="sticky left-[40px] bg-[#0a0a0a]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {campaign.name[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                {campaign.name}
                              </p>
                              {campaign.clientName && (
                                <span className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                  {campaign.clientName}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      )}

                      {/* Status */}
                      {columns.find((c) => c.id === "status")?.visible && (
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      )}

                      {/* Budget / Spent */}
                      {columns.find((c) => c.id === "budget")?.visible && (
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white">
                                {formatCurrency(spent)} / {formatCurrency(campaign.budget)}
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  spentPercent > 90
                                    ? "bg-red-500"
                                    : spentPercent > 70
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(spentPercent, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      )}

                      {/* Videos */}
                      {columns.find((c) => c.id === "totalVideos")?.visible && (
                        <TableCell>
                          <span className="text-sm text-white">
                            {campaign.totalVideos || campaign.metrics?.totalVideos || 0}
                          </span>
                        </TableCell>
                      )}

                      {/* Creators */}
                      {columns.find((c) => c.id === "totalCreators")?.visible && (
                        <TableCell>
                          <span className="text-sm text-white">
                            {campaign.creatorCount || campaign.metrics?.totalCreators || 0}
                          </span>
                        </TableCell>
                      )}

                      {/* Views */}
                      {columns.find((c) => c.id === "totalViews")?.visible && (
                        <TableCell>
                          <span className="text-sm text-white">
                            {formatNumber(campaign.totalReach || campaign.metrics?.totalViews || 0)}
                          </span>
                        </TableCell>
                      )}

                      {/* Start Date */}
                      {columns.find((c) => c.id === "startDate")?.visible && (
                        <TableCell>
                          <span className="text-sm text-white/60">
                            {formatDate(campaign.startDate)}
                          </span>
                        </TableCell>
                      )}

                      {/* End Date */}
                      {columns.find((c) => c.id === "endDate")?.visible && (
                        <TableCell>
                          <span className="text-sm text-white/60">
                            {formatDate(campaign.endDate)}
                          </span>
                        </TableCell>
                      )}

                      {/* Actions */}
                      <TableCell className="sticky right-0 bg-[#0a0a0a]">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/40 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin2/campaigns/${campaign._id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/40 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin2/campaigns/${campaign._id}/edit`);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/40 hover:text-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="bg-[#0a0a0a] border-white/[0.06]"
                              align="end"
                            >
                              <DropdownMenuItem
                                className="text-white hover:bg-white/[0.04]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin2/campaigns/${campaign._id}`);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-white hover:bg-white/[0.04]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin2/campaigns/${campaign._id}/edit`);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {onAssignCreator && (
                                <DropdownMenuItem
                                  className="text-white hover:bg-white/[0.04]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAssignCreator(campaign._id);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Assign Creator
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-white/[0.06]" />
                              <DropdownMenuItem
                                className="text-amber-400 hover:bg-white/[0.04]"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await archiveCampaign({ campaignId: campaign._id });
                                  toast.success("Campaign archived");
                                }}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-white/60">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedCampaigns.length)} of {sortedCampaigns.length} campaign{sortedCampaigns.length !== 1 ? "s" : ""}
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[100px] h-8 bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="text-white/60 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 p-0 ${
                        page === pageNum
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="text-white/60 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
