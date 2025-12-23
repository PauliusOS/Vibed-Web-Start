"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus, Users, Share2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface Roster {
  _id: Id<"creatorRosters">;
  name: string;
  description?: string;
  totalCreators: number;
  icon?: string;
  color?: string;
  visibility: "private" | "clientele" | "organization";
}

interface RosterSelectorProps {
  rosters: Roster[];
  sharedRosters: Roster[];
  selected: Id<"creatorRosters"> | "all";
  onChange: (rosterId: Id<"creatorRosters"> | "all") => void;
  onCreateNew?: () => void;
}

export function RosterSelector({
  rosters,
  sharedRosters,
  selected,
  onChange,
  onCreateNew,
}: RosterSelectorProps) {
  const [open, setOpen] = useState(false);

  // Find selected roster
  const selectedRoster =
    selected === "all"
      ? null
      : rosters.find((r) => r._id === selected) ||
        sharedRosters.find((r) => r._id === selected);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-3 w-3" />;
      case "organization":
        return <Users className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between bg-[#0a0a0a] border-white/10 text-white hover:bg-[#111111] hover:border-white/20 transition-all"
        >
          <div className="flex items-center gap-2.5 truncate">
            {selected === "all" ? (
              <>
                <Users className="h-4 w-4 text-white/70" />
                <span className="font-medium">All Creators</span>
              </>
            ) : selectedRoster ? (
              <>
                {selectedRoster.icon ? (
                  <span className="text-lg">{selectedRoster.icon}</span>
                ) : (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: selectedRoster.color || "#00BFFF",
                    }}
                  />
                )}
                <span className="truncate font-medium">{selectedRoster.name}</span>
                <span className="text-xs text-white/40">
                  ({selectedRoster.totalCreators})
                </span>
              </>
            ) : (
              <span className="font-medium">Select roster...</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-white/50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 shadow-2xl" align="start">
        <Command className="bg-transparent">
          <div className="px-3 pt-3 pb-2">
            <CommandInput
              placeholder="Search rosters..."
              className="h-9 text-white placeholder:text-white/40 bg-white/5 border-white/10 rounded-lg focus:bg-white/10 focus:border-white/20 transition-all"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="text-white/50 text-sm py-6 text-center">
              No rosters found.
            </CommandEmpty>

            {/* All Creators Option */}
            <CommandGroup heading="Quick Access" className="text-white/50 text-xs uppercase tracking-wider px-3 py-2">
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
                className="text-white hover:bg-white/10 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
              >
                <Users className="mr-2.5 h-4 w-4 text-white/70" />
                <span className="font-medium">All Creators</span>
                {selected === "all" && (
                  <Check className="ml-auto h-4 w-4 text-cyan-400" />
                )}
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="bg-white/[0.06] my-1" />

            {/* My Rosters */}
            {rosters.length > 0 && (
              <>
                <CommandGroup
                  heading="My Rosters"
                  className="text-white/50 text-xs uppercase tracking-wider px-3 py-2"
                >
                  {rosters.map((roster) => (
                    <CommandItem
                      key={roster._id}
                      value={roster.name}
                      onSelect={() => {
                        onChange(roster._id);
                        setOpen(false);
                      }}
                      className="text-white hover:bg-white/10 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {roster.icon ? (
                          <span className="text-base">{roster.icon}</span>
                        ) : (
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: roster.color || "#00BFFF",
                            }}
                          />
                        )}
                        <span className="truncate flex-1 font-medium">{roster.name}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-white/40">
                          {getVisibilityIcon(roster.visibility)}
                          <span className="text-xs">
                            {roster.totalCreators}
                          </span>
                        </div>
                      </div>
                      {selected === roster._id && (
                        <Check className="ml-2 h-4 w-4 text-cyan-400 flex-shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="bg-white/[0.06] my-1" />
              </>
            )}

            {/* Shared Rosters */}
            {sharedRosters.length > 0 && (
              <>
                <CommandGroup
                  heading="Shared with Me"
                  className="text-white/50 text-xs uppercase tracking-wider px-3 py-2"
                >
                  {sharedRosters.map((roster) => (
                    <CommandItem
                      key={roster._id}
                      value={roster.name}
                      onSelect={() => {
                        onChange(roster._id);
                        setOpen(false);
                      }}
                      className="text-white hover:bg-white/10 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Share2 className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />
                        {roster.icon ? (
                          <span className="text-base">{roster.icon}</span>
                        ) : (
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: roster.color || "#00BFFF",
                            }}
                          />
                        )}
                        <span className="truncate flex-1 font-medium">{roster.name}</span>
                        <span className="text-xs text-white/40 flex-shrink-0">
                          {roster.totalCreators}
                        </span>
                      </div>
                      {selected === roster._id && (
                        <Check className="ml-2 h-4 w-4 text-cyan-400 flex-shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="bg-white/[0.06] my-1" />
              </>
            )}

            {/* Create New Roster */}
            {onCreateNew && (
              <CommandGroup className="px-2 pb-2">
                <CommandItem
                  onSelect={() => {
                    onCreateNew();
                    setOpen(false);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg px-3 py-2.5 cursor-pointer transition-all font-medium"
                >
                  <Plus className="mr-2.5 h-4 w-4" />
                  <span>Create New Roster</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
