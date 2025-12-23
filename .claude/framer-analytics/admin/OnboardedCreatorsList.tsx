"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FRAMER_BG_COLORS, FRAMER_TEXT_COLORS, FramerCard } from "@/components/framer-analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Users, 
  Eye, 
  TrendingUp, 
  BarChart3, 
  MoreHorizontal,
  ExternalLink,
  FolderPlus,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

interface OnboardedCreatorsListProps {
  organizationId: Id<"organizations">;
  onSelectCreator: (id: Id<"creatorProfiles">) => void;
}

type SortField = "username" | "followerCount" | "medianViews7d" | "engagementRate" | "lastAnalyzedAt";
type SortDirection = "asc" | "desc";

export function OnboardedCreatorsList({ organizationId, onSelectCreator }: OnboardedCreatorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("lastAnalyzedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const creators = useQuery(api.creatorOnboarding.getOnboardedCreators, {
    organizationId,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (num: number | undefined): string => {
    if (num === undefined) return "—";
    return num.toFixed(2) + "%";
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter and sort creators
  const filteredCreators = (creators ?? [])
    .filter((creator) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        creator.username.toLowerCase().includes(query) ||
        creator.displayName?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle undefined values
      if (aVal === undefined) aVal = 0;
      if (bVal === undefined) bVal = 0;

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  if (creators === undefined) {
    return (
      <FramerCard padding="lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-white/40" />
        </div>
      </FramerCard>
    );
  }

  if (creators.length === 0) {
    return (
      <FramerCard padding="lg">
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-white/40" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No Creators Yet</h3>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              Start by onboarding creators from the &quot;Onboard Creator&quot; tab.
              Enter their TikTok or Instagram profile URL to fetch their metrics.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <UserPlus className="w-4 h-4 mr-2" />
            Onboard Your First Creator
          </Button>
        </div>
      </FramerCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <FramerCard padding="md">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="text-sm text-white/60">
            {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""}
          </div>
        </div>
      </FramerCard>

      {/* Creators Table */}
      <FramerCard padding="none">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Creator</TableHead>
              <TableHead
                className="text-white/60 cursor-pointer hover:text-white"
                onClick={() => handleSort("followerCount")}
              >
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Followers
                  <SortIcon field="followerCount" />
                </span>
              </TableHead>
              <TableHead
                className="text-white/60 cursor-pointer hover:text-white"
                onClick={() => handleSort("medianViews7d")}
              >
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Median Views
                  <SortIcon field="medianViews7d" />
                </span>
              </TableHead>
              <TableHead
                className="text-white/60 cursor-pointer hover:text-white"
                onClick={() => handleSort("engagementRate")}
              >
                <span className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Engagement
                  <SortIcon field="engagementRate" />
                </span>
              </TableHead>
              <TableHead className="text-white/60">Campaigns</TableHead>
              <TableHead
                className="text-white/60 cursor-pointer hover:text-white"
                onClick={() => handleSort("lastAnalyzedAt")}
              >
                <span className="flex items-center">
                  Last Updated
                  <SortIcon field="lastAnalyzedAt" />
                </span>
              </TableHead>
              <TableHead className="text-white/60 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCreators.map((creator) => (
              <TableRow
                key={creator._id}
                className="border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => onSelectCreator(creator._id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={creator.profilePictureUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                        {creator.displayName?.[0] || creator.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {creator.displayName || creator.username}
                        </span>
                        {creator.isVerified && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5 py-0">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>@{creator.username}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            creator.platform === "tiktok"
                              ? "border-white/20 text-white/60"
                              : "border-pink-500/30 text-pink-400"
                          }`}
                        >
                          {creator.platform === "tiktok" ? "TikTok" : "IG"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-white font-medium">
                    {formatNumber(creator.followerCount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-white font-medium">
                    {formatNumber(creator.medianViews7d ?? 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-white font-medium">
                    {formatPercentage(creator.engagementRate)}
                  </span>
                </TableCell>
                <TableCell>
                  {creator.campaigns.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {creator.campaigns.slice(0, 2).map((campaign: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-green-500/30 text-green-400"
                        >
                          {campaign.name}
                        </Badge>
                      ))}
                      {creator.campaigns.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-white/20 text-white/60"
                        >
                          +{creator.campaigns.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-white/40">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-white/60">
                    {formatDate(creator.lastAnalyzedAt)}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                      <DropdownMenuItem
                        className="text-white/80 hover:text-white focus:text-white focus:bg-white/10"
                        onClick={() => onSelectCreator(creator._id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Add to Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white/80 hover:text-white focus:text-white focus:bg-white/10"
                        onClick={() => window.open(creator.profileUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Creator
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FramerCard>
    </div>
  );
}

















