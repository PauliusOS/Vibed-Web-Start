"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreVertical,
  Instagram,
  Music,
  Users,
  ExternalLink,
  UserPlus,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface CreatorTableProps {
  creators: Doc<"creatorProfiles">[];
  onAddToRoster?: (creator: Doc<"creatorProfiles">) => void;
  onViewDetails?: (creator: Doc<"creatorProfiles">) => void;
  onAnalyze?: (creator: Doc<"creatorProfiles">) => void;
  selectable?: boolean;
  onSelectionChange?: (selected: Doc<"creatorProfiles">[]) => void;
}

type SortField = "username" | "followers" | "medianViewRate" | "meanViewRate";
type SortDirection = "asc" | "desc";

export function CreatorTable({
  creators,
  onAddToRoster,
  onViewDetails,
  onAnalyze,
  selectable = false,
  onSelectionChange,
}: CreatorTableProps) {
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("username");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "tiktok":
        return <Music className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
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

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCreators = [...creators].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "username":
        aValue = a.username.toLowerCase();
        bValue = b.username.toLowerCase();
        break;
      case "followers":
        aValue = a.followerCount;
        bValue = b.followerCount;
        break;
      case "medianViewRate":
        aValue = a.medianViewRate;
        bValue = b.medianViewRate;
        break;
      case "meanViewRate":
        aValue = a.meanViewRate;
        bValue = b.meanViewRate;
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const toggleCreator = (creator: Doc<"creatorProfiles">) => {
    const newSelected = new Set(selectedCreators);
    if (newSelected.has(creator._id)) {
      newSelected.delete(creator._id);
    } else {
      newSelected.add(creator._id);
    }
    setSelectedCreators(newSelected);
    onSelectionChange?.(creators.filter((c) => newSelected.has(c._id)));
  };

  const toggleAll = () => {
    if (selectedCreators.size === creators.length) {
      setSelectedCreators(new Set());
      onSelectionChange?.([]);
    } else {
      setSelectedCreators(new Set(creators.map((c) => c._id)));
      onSelectionChange?.(creators);
    }
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className={cn(
        "h-8 gap-1 hover:text-primary",
        sortField === field && "text-primary"
      )}
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </Button>
  );

  if (creators.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No creators found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCreators.size === creators.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
            )}
            <TableHead className="w-[50px]" />
            <TableHead>
              <SortButton field="username">Creator</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="followers">Followers</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="medianViewRate">Median Views</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="meanViewRate">Mean Views</SortButton>
            </TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCreators.map((creator) => (
            <TableRow
              key={creator._id}
              className="group hover:bg-primary/5 transition-colors"
            >
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={selectedCreators.has(creator._id)}
                    onCheckedChange={() => toggleCreator(creator)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {getPlatformIcon(creator.platform)}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    @{creator.username}
                  </div>
                  {creator.mostViewedVideoViews && (
                    <div className="text-xs text-muted-foreground">
                      Top: {formatNumber(creator.mostViewedVideoViews)} views
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{formatNumber(creator.followerCount)}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {formatRate(creator.medianViewRate)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {formatRate(creator.meanViewRate)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {getPlatformIcon(creator.platform)}
                  <span className="text-sm capitalize">{creator.platform}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onAddToRoster && (
                      <DropdownMenuItem onClick={() => onAddToRoster(creator)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add to Roster
                      </DropdownMenuItem>
                    )}
                    {onViewDetails && (
                      <DropdownMenuItem onClick={() => onViewDetails(creator)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onAnalyze && (
                      <DropdownMenuItem onClick={() => onAnalyze(creator)}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => window.open(creator.profileUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
