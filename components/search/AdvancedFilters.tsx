"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Filter,
  X,
  Instagram,
  Music,
  Youtube,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  platforms?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxEngagement?: number;
  countries?: string[];
  hasEmail?: boolean;
  hasPrice?: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearAll?: () => void;
}

const PLATFORMS = [
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "twitter", label: "X/Twitter", icon: Twitter },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "South Korea",
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearAll,
}: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(true);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const togglePlatform = (platform: string) => {
    const platforms = filters.platforms || [];
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter((p) => p !== platform)
      : [...platforms, platform];
    updateFilter("platforms", newPlatforms);
  };

  const toggleCountry = (country: string) => {
    const countries = filters.countries || [];
    const newCountries = countries.includes(country)
      ? countries.filter((c) => c !== country)
      : [...countries, country];
    updateFilter("countries", newCountries);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.platforms && filters.platforms.length > 0) count++;
    if (filters.minFollowers || filters.maxFollowers) count++;
    if (filters.minEngagement || filters.maxEngagement) count++;
    if (filters.countries && filters.countries.length > 0) count++;
    if (filters.hasEmail) count++;
    if (filters.hasPrice) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {/* Platforms */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Platforms
                {filters.platforms && filters.platforms.length > 0 && (
                  <Badge variant="secondary">{filters.platforms.length}</Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Platforms</Label>
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform.value}`}
                        checked={filters.platforms?.includes(platform.value)}
                        onCheckedChange={() => togglePlatform(platform.value)}
                      />
                      <Label
                        htmlFor={`platform-${platform.value}`}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Icon className="w-4 h-4" />
                        {platform.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Followers */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Followers
                {(filters.minFollowers || filters.maxFollowers) && (
                  <Badge variant="secondary">✓</Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Follower Range</Label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minFollowers || ""}
                      onChange={(e) =>
                        updateFilter("minFollowers", parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxFollowers || ""}
                      onChange={(e) =>
                        updateFilter("maxFollowers", parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Engagement */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Engagement
                {(filters.minEngagement || filters.maxEngagement) && (
                  <Badge variant="secondary">✓</Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Engagement Rate (%)</Label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min %"
                      value={filters.minEngagement || ""}
                      onChange={(e) =>
                        updateFilter("minEngagement", parseFloat(e.target.value) || undefined)
                      }
                    />
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Max %"
                      value={filters.maxEngagement || ""}
                      onChange={(e) =>
                        updateFilter("maxEngagement", parseFloat(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Location */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Location
                {filters.countries && filters.countries.length > 0 && (
                  <Badge variant="secondary">{filters.countries.length}</Badge>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                <Label className="text-sm font-medium">Select Countries</Label>
                {COUNTRIES.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={filters.countries?.includes(country)}
                      onCheckedChange={() => toggleCountry(country)}
                    />
                    <Label
                      htmlFor={`country-${country}`}
                      className="cursor-pointer flex-1"
                    >
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Has Email */}
          <Button
            variant={filters.hasEmail ? "default" : "outline"}
            onClick={() => updateFilter("hasEmail", !filters.hasEmail)}
            className="gap-2"
          >
            Has Email
            {filters.hasEmail && <Badge variant="secondary">✓</Badge>}
          </Button>

          {/* Has Price */}
          <Button
            variant={filters.hasPrice ? "default" : "outline"}
            onClick={() => updateFilter("hasPrice", !filters.hasPrice)}
            className="gap-2"
          >
            Has Price
            {filters.hasPrice && <Badge variant="secondary">✓</Badge>}
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.platforms?.map((platform) => (
            <Badge key={platform} variant="secondary" className="gap-1">
              {platform}
              <button onClick={() => togglePlatform(platform)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {(filters.minFollowers || filters.maxFollowers) && (
            <Badge variant="secondary" className="gap-1">
              Followers: {filters.minFollowers || "0"} - {filters.maxFollowers || "∞"}
              <button
                onClick={() => {
                  updateFilter("minFollowers", undefined);
                  updateFilter("maxFollowers", undefined);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.countries?.map((country) => (
            <Badge key={country} variant="secondary" className="gap-1">
              {country}
              <button onClick={() => toggleCountry(country)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
