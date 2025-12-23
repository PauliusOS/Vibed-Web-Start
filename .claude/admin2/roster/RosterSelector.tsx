"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search, Users, X } from "lucide-react";
import type { Roster } from "./types";

interface RosterSelectorProps {
  rosters: Roster[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface MultiRosterSelectorProps {
  rosters: Roster[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayed?: number;
}

// Single roster selector (dropdown)
export function RosterSelector({
  rosters,
  value,
  onValueChange,
  placeholder = "Select roster...",
  disabled = false,
  className,
}: RosterSelectorProps) {
  const selectedRoster = rosters.find((r) => r._id === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={`bg-white/[0.02] border-white/[0.06] text-white ${className}`}
      >
        <SelectValue placeholder={placeholder}>
          {selectedRoster && (
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded flex items-center justify-center text-sm"
                style={{ backgroundColor: `${selectedRoster.color}20` }}
              >
                {selectedRoster.icon}
              </span>
              <span className="truncate">{selectedRoster.name}</span>
              <Badge
                variant="secondary"
                className="bg-white/[0.06] text-white/60 border-0 text-xs ml-auto"
              >
                {selectedRoster.totalCreators}
              </Badge>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
        {rosters.length === 0 ? (
          <div className="py-6 text-center text-white/40">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No rosters available</p>
          </div>
        ) : (
          rosters.map((roster) => (
            <SelectItem
              key={roster._id}
              value={roster._id}
              className="text-white/80 focus:text-white focus:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${roster.color}20` }}
                >
                  {roster.icon}
                </span>
                <span className="truncate">{roster.name}</span>
                <Badge
                  variant="secondary"
                  className="bg-white/[0.06] text-white/60 border-0 text-xs ml-auto"
                >
                  {roster.totalCreators}
                </Badge>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

// Multi roster selector (popover with checkboxes)
export function MultiRosterSelector({
  rosters,
  values,
  onValuesChange,
  placeholder = "Select rosters...",
  disabled = false,
  className,
  maxDisplayed = 2,
}: MultiRosterSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter rosters based on search
  const filteredRosters = useMemo(() => {
    if (!search) return rosters;
    const lowerSearch = search.toLowerCase();
    return rosters.filter(
      (roster) =>
        roster.name.toLowerCase().includes(lowerSearch) ||
        roster.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  }, [rosters, search]);

  // Get selected rosters
  const selectedRosters = rosters.filter((r) => values.includes(r._id));

  // Toggle a roster selection
  const toggleRoster = (rosterId: string) => {
    if (values.includes(rosterId)) {
      onValuesChange(values.filter((v) => v !== rosterId));
    } else {
      onValuesChange([...values, rosterId]);
    }
  };

  // Clear all selections
  const clearAll = () => {
    onValuesChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`justify-between bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.04] ${className}`}
        >
          {selectedRosters.length === 0 ? (
            <span className="text-white/40">{placeholder}</span>
          ) : (
            <div className="flex items-center gap-1 flex-1 overflow-hidden">
              {selectedRosters.slice(0, maxDisplayed).map((roster) => (
                <Badge
                  key={roster._id}
                  variant="secondary"
                  className="bg-white/[0.06] text-white/80 border-0 text-xs gap-1"
                  style={{ borderLeft: `2px solid ${roster.color}` }}
                >
                  {roster.icon} {roster.name}
                </Badge>
              ))}
              {selectedRosters.length > maxDisplayed && (
                <Badge
                  variant="secondary"
                  className="bg-white/[0.06] text-white/60 border-0 text-xs"
                >
                  +{selectedRosters.length - maxDisplayed}
                </Badge>
              )}
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0 bg-[#0a0a0a] border-white/[0.06]"
        align="start"
      >
        {/* Search Input */}
        <div className="p-2 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rosters..."
              className="pl-8 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 h-8"
            />
          </div>
        </div>

        {/* Selected Count & Clear */}
        {values.length > 0 && (
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-white/60">
              {values.length} selected
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          </div>
        )}

        {/* Roster List */}
        <ScrollArea className="h-[200px]">
          {filteredRosters.length === 0 ? (
            <div className="py-6 text-center text-white/40">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No rosters found</p>
            </div>
          ) : (
            <div className="p-1">
              {filteredRosters.map((roster) => {
                const isSelected = values.includes(roster._id);
                return (
                  <button
                    key={roster._id}
                    onClick={() => toggleRoster(roster._id)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${
                      isSelected
                        ? "bg-purple-500/20"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="border-white/[0.2] data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: `${roster.color}20` }}
                    >
                      {roster.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {roster.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {roster.totalCreators} creators
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
