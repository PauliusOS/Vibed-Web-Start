"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  userId: string;
  role: string;
  username?: string;
}

interface UserSelectionListProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  excludeUserIds?: string[];
  emptyMessage?: string;
  className?: string;
}

export function UserSelectionList({
  users,
  selectedUsers,
  onSelectionChange,
  excludeUserIds = [],
  emptyMessage = "No users available",
  className,
}: UserSelectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out excluded users and apply search
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(
      (user) => !excludeUserIds.includes(user.userId)
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((user) => {
        const displayName = user.username || user.userId.split("|")[1] || user.userId;
        return displayName.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [users, excludeUserIds, searchQuery]);

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    // Get all filtered user IDs
    const filteredUserIds = filteredUsers.map((user) => user.userId);

    // Check if all filtered users are currently selected
    const allFilteredSelected = filteredUserIds.every((id) => selectedUsers.includes(id));

    if (allFilteredSelected) {
      // Deselect all filtered users, but keep any users that are selected outside the filtered list
      const remainingSelected = selectedUsers.filter((id) => !filteredUserIds.includes(id));
      onSelectionChange(remainingSelected);
    } else {
      // Select all filtered users, merging with existing selections
      const newSelection = Array.from(new Set([...selectedUsers, ...filteredUserIds]));
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-[#0a0a0a] border-[#3a3a3a] text-white placeholder:text-white/40"
        />
      </div>

      {/* Select All */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            id="select-all"
            checked={
              filteredUsers.length > 0 &&
              filteredUsers.every((user) => selectedUsers.includes(user.userId))
            }
            onCheckedChange={handleSelectAll}
            className="border-[#3a3a3a] data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label
            htmlFor="select-all"
            className="text-sm text-white/60 cursor-pointer select-none"
          >
            Select all ({filteredUsers.length})
          </label>
        </div>
      )}

      {/* User List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-white/40" />
            </div>
            <p className="text-sm text-white/60">{emptyMessage}</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const displayName =
              user.username || user.userId.split("|")[1] || user.userId;
            const isSelected = selectedUsers.includes(user.userId);

            return (
              <div
                key={user.userId}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  isSelected
                    ? "bg-white/5 border-white/20"
                    : "bg-[#0a0a0a] border-[#3a3a3a] hover:border-white/10"
                )}
                onClick={() => handleToggleUser(user.userId)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggleUser(user.userId)}
                  className="border-[#3a3a3a] data-[state=checked]:bg-white data-[state=checked]:text-black"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-white/40 truncate">{user.userId}</p>
                </div>
                <Badge className="bg-blue-500/10 text-blue-500 text-xs shrink-0">
                  {user.role}
                </Badge>
              </div>
            );
          })
        )}
      </div>

      {/* Selection Summary */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between px-2 py-2 rounded bg-white/5">
          <p className="text-sm text-white/80">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
          <button
            onClick={() => onSelectionChange([])}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
