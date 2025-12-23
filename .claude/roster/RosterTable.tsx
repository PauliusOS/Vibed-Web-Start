"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  UserPlus,
  Mail,
  Trash2,
} from "lucide-react";

interface Creator {
  userId: string;
  name: string;
  email?: string;
  platforms: string[];
  totalFollowers: number;
  totalVideos: number;
  totalViews: number;
  avgEngagementRate: number;
  activeCampaignsCount: number;
  rostersCount: number;
  joinedAt: number;
  lastActive: number;
  rosterIds?: string[];
}

interface RosterTableProps {
  creators: Creator[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSelectAll: () => void;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSort: (column: string) => void;
  onViewDetails: (userId: string) => void;
  onAssignToCampaign?: (userId: string) => void;
  onAddToRoster?: (userId: string) => void;
  onSendBrief?: (userId: string) => void;
}

export function RosterTable({
  creators,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  sortBy,
  sortDirection,
  onSort,
  onViewDetails,
  onAssignToCampaign,
  onAddToRoster,
  onSendBrief,
}: RosterTableProps) {
  const isAllSelected =
    creators.length > 0 && selectedIds.length === creators.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < creators.length;

  const toggleSelection = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onSelectionChange(selectedIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedIds, userId]);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      tiktok: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    };
    return colors[platform] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#3a3a3a] hover:bg-transparent">
              {/* Select All Checkbox */}
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  className={isSomeSelected ? "data-[state=checked]:bg-primary" : ""}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>

              {/* Creator Column */}
              <TableHead className="min-w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="hover:bg-transparent font-semibold text-white px-0"
                >
                  Creator
                  <SortIcon column="name" />
                </Button>
              </TableHead>

              {/* Platforms Column */}
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("platforms")}
                  className="hover:bg-transparent font-semibold text-white px-0"
                >
                  Platforms
                  <SortIcon column="platforms" />
                </Button>
              </TableHead>

              {/* Followers Column */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => onSort("totalFollowers")}
                  className="hover:bg-transparent font-semibold text-white px-0 ml-auto"
                >
                  Followers
                  <SortIcon column="totalFollowers" />
                </Button>
              </TableHead>

              {/* Videos Column */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => onSort("totalVideos")}
                  className="hover:bg-transparent font-semibold text-white px-0 ml-auto"
                >
                  Videos
                  <SortIcon column="totalVideos" />
                </Button>
              </TableHead>

              {/* Views Column */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => onSort("totalViews")}
                  className="hover:bg-transparent font-semibold text-white px-0 ml-auto"
                >
                  Views
                  <SortIcon column="totalViews" />
                </Button>
              </TableHead>

              {/* Engagement Column */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => onSort("avgEngagementRate")}
                  className="hover:bg-transparent font-semibold text-white px-0 ml-auto"
                >
                  Engagement
                  <SortIcon column="avgEngagementRate" />
                </Button>
              </TableHead>

              {/* Campaigns Column */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => onSort("activeCampaignsCount")}
                  className="hover:bg-transparent font-semibold text-white px-0 ml-auto"
                >
                  Campaigns
                  <SortIcon column="activeCampaignsCount" />
                </Button>
              </TableHead>

              {/* Last Active Column */}
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("lastActive")}
                  className="hover:bg-transparent font-semibold text-white px-0"
                >
                  Last Active
                  <SortIcon column="lastActive" />
                </Button>
              </TableHead>

              {/* Actions Column */}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {creators.length === 0 ? (
              <TableRow className="border-[#3a3a3a] hover:bg-transparent">
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-muted-foreground"
                >
                  No creators found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              creators.map((creator) => (
                <TableRow
                  key={creator.userId}
                  className={`border-[#3a3a3a] ${
                    selectedIds.includes(creator.userId)
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-[#2a2a2a]"
                  } transition-colors`}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(creator.userId)}
                      onCheckedChange={() => toggleSelection(creator.userId)}
                    />
                  </TableCell>

                  {/* Creator Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-[#3a3a3a]">
                        <AvatarFallback className="bg-[#2a2a2a] text-white font-semibold">
                          {creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">
                          {creator.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {creator.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Platforms */}
                  <TableCell>
                    <div className="flex gap-1">
                      {creator.platforms.map((platform) => (
                        <Badge
                          key={platform}
                          className={getPlatformBadge(platform)}
                        >
                          {platform}
                        </Badge>
                      ))}
                      {creator.platforms.length === 0 && (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Followers */}
                  <TableCell className="text-right font-mono text-white">
                    {formatNumber(creator.totalFollowers)}
                  </TableCell>

                  {/* Videos */}
                  <TableCell className="text-right font-mono text-white">
                    {creator.totalVideos}
                  </TableCell>

                  {/* Views */}
                  <TableCell className="text-right font-mono text-white">
                    {formatNumber(creator.totalViews)}
                  </TableCell>

                  {/* Engagement */}
                  <TableCell className="text-right font-mono text-white">
                    {creator.avgEngagementRate.toFixed(1)}%
                  </TableCell>

                  {/* Campaigns */}
                  <TableCell className="text-right font-mono text-white">
                    {creator.activeCampaignsCount}
                  </TableCell>

                  {/* Last Active */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(creator.lastActive)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-[#2a2a2a]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1a1a] border-[#3a3a3a]"
                      >
                        <DropdownMenuItem
                          onClick={() => onViewDetails(creator.userId)}
                          className="hover:bg-[#2a2a2a] cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {onAssignToCampaign && (
                          <DropdownMenuItem
                            onClick={() => onAssignToCampaign(creator.userId)}
                            className="hover:bg-[#2a2a2a] cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign to Campaign
                          </DropdownMenuItem>
                        )}
                        {onAddToRoster && (
                          <DropdownMenuItem
                            onClick={() => onAddToRoster(creator.userId)}
                            className="hover:bg-[#2a2a2a] cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add to Roster
                          </DropdownMenuItem>
                        )}
                        {onSendBrief && (
                          <DropdownMenuItem
                            onClick={() => onSendBrief(creator.userId)}
                            className="hover:bg-[#2a2a2a] cursor-pointer"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Brief
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-[#3a3a3a]" />
                        <DropdownMenuItem className="text-destructive hover:bg-[#2a2a2a] cursor-pointer">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

