"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface RosterFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  platformFilter: string[];
  onPlatformFilterChange: (platforms: string[]) => void;
  campaignFilter?: string;
  onCampaignFilterChange?: (campaignId: string) => void;
  rosterFilter?: string;
  onRosterFilterChange?: (rosterId: string) => void;
  campaigns?: Array<{ _id: string; name: string }>;
  rosters?: Array<{ _id: string; name: string }>;
}

export function RosterFilters({
  searchQuery,
  onSearchChange,
  platformFilter,
  onPlatformFilterChange,
  campaignFilter,
  onCampaignFilterChange,
  rosterFilter,
  onRosterFilterChange,
  campaigns = [],
  rosters = [],
}: RosterFiltersProps) {
  const hasActiveFilters =
    platformFilter.length > 0 || searchQuery || campaignFilter || rosterFilter;

  const clearAllFilters = () => {
    onSearchChange("");
    onPlatformFilterChange([]);
    if (onCampaignFilterChange) onCampaignFilterChange("");
    if (onRosterFilterChange) onRosterFilterChange("");
  };

  const removePlatformFilter = (platform: string) => {
    onPlatformFilterChange(platformFilter.filter((p) => p !== platform));
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] p-4">
      <div className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:w-auto sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-[#0A0A0A] border-[#3a3a3a] text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-[#2a2a2a]"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Platform Filter */}
          <Select
            value={platformFilter[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                onPlatformFilterChange([]);
              } else {
                onPlatformFilterChange([value]);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-[#0A0A0A] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
              <SelectItem value="all" className="text-white hover:bg-[#2a2a2a]">
                All Platforms
              </SelectItem>
              <SelectItem
                value="instagram"
                className="text-white hover:bg-[#2a2a2a]"
              >
                Instagram
              </SelectItem>
              <SelectItem
                value="tiktok"
                className="text-white hover:bg-[#2a2a2a]"
              >
                TikTok
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Campaign Filter */}
          {campaigns.length > 0 && onCampaignFilterChange && (
            <Select
              value={campaignFilter || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  onCampaignFilterChange("");
                } else {
                  onCampaignFilterChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-[#0A0A0A] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  All Campaigns
                </SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem
                    key={campaign._id}
                    value={campaign._id}
                    className="text-white hover:bg-[#2a2a2a]"
                  >
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Roster Filter */}
          {rosters.length > 0 && onRosterFilterChange && (
            <Select
              value={rosterFilter || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  onRosterFilterChange("");
                } else {
                  onRosterFilterChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-[#0A0A0A] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Roster" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  All Rosters
                </SelectItem>
                {rosters.map((roster) => (
                  <SelectItem
                    key={roster._id}
                    value={roster._id}
                    className="text-white hover:bg-[#2a3a2a]"
                  >
                    {roster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-white hover:bg-[#2a2a2a]"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Active filters:
            </span>

            {searchQuery && (
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 hover:bg-primary/20">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-primary-foreground"
                  onClick={() => onSearchChange("")}
                />
              </Badge>
            )}

            {platformFilter.map((platform) => (
              <Badge
                key={platform}
                className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1 hover:bg-purple-500/20"
              >
                Platform: {platform}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-purple-400"
                  onClick={() => removePlatformFilter(platform)}
                />
              </Badge>
            ))}

            {campaignFilter && campaigns.length > 0 && (
              <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 gap-1 hover:bg-cyan-500/20">
                Campaign:{" "}
                {campaigns.find((c) => c._id === campaignFilter)?.name}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-cyan-400"
                  onClick={() => onCampaignFilterChange?.("")}
                />
              </Badge>
            )}

            {rosterFilter && rosters.length > 0 && (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 hover:bg-green-500/20">
                Roster: {rosters.find((r) => r._id === rosterFilter)?.name}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-green-400"
                  onClick={() => onRosterFilterChange?.("")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

