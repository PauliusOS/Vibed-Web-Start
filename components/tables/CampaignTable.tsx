"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  _id: string;
  name: string;
  budget: number;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  videosCount: number;
  totalViews: number;
  createdAt: number;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  onEdit?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
  basePath?: string;
}

type SortField = "name" | "budget" | "videosCount" | "totalViews" | "createdAt";
type SortOrder = "asc" | "desc";

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted/50 text-muted-foreground" },
  active: { label: "Active", className: "bg-green-500/10 text-green-500" },
  paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-500" },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-500" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-500" },
};

export function CampaignTable({
  campaigns,
  onEdit,
  onDelete,
  basePath = "/admin/campaigns",
}: CampaignTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">
              <button
                onClick={() => toggleSort("name")}
                className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                aria-label="Sort by campaign name"
              >
                Campaign Name
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground">
              <button
                onClick={() => toggleSort("budget")}
                className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                aria-label="Sort by budget"
              >
                Budget
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">
              <button
                onClick={() => toggleSort("videosCount")}
                className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                aria-label="Sort by video count"
              >
                Videos
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground">
              <button
                onClick={() => toggleSort("totalViews")}
                className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                aria-label="Sort by total views"
              >
                Total Views
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground">
              <button
                onClick={() => toggleSort("createdAt")}
                className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                aria-label="Sort by creation date"
              >
                Created
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCampaigns.map((campaign) => {
            const config = statusConfig[campaign.status];
            return (
              <TableRow
                key={campaign._id}
                className="hover:bg-muted/50 border-border transition-colors duration-200"
              >
                <TableCell>
                  <Link
                    href={`${basePath}/${campaign._id}`}
                    className="font-medium text-foreground hover:text-foreground/80 transition-colors duration-200"
                  >
                    {campaign.name}
                  </Link>
                </TableCell>
                <TableCell className="text-foreground/80 font-mono">
                  ${campaign.budget.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs", config.className)}>
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground/80 font-mono">
                  {campaign.videosCount}
                </TableCell>
                <TableCell className="text-foreground/80 font-mono">
                  {campaign.totalViews >= 1000
                    ? `${(campaign.totalViews / 1000).toFixed(1)}K`
                    : campaign.totalViews}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 focus:ring-2 focus:ring-primary focus:outline-none"
                        aria-label="Campaign actions menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-card border-border shadow-md"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={`${basePath}/${campaign._id}`}
                          className="text-foreground/80 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(campaign._id)}
                          className="text-foreground/80 cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(campaign._id)}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
