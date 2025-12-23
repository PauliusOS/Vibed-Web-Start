"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Users, User, Search, X, Loader2 } from "lucide-react";
import { AdminBadge } from "./AdminBadge";

interface CreateGroupChatDialogProps {
  organizationId: Id<"organizations">;
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (conversationId: Id<"conversations">) => void;
}

export function CreateGroupChatDialog({
  organizationId,
  isOpen,
  onClose,
  onCreated,
}: CreateGroupChatDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const users = useQuery(api.messaging.getMessageableUsers, { organizationId });
  const userDetails = useQuery(
    api.messaging.getUserDetailsWithRoles,
    users ? { userIds: users.map((u) => u.userId), organizationId } : "skip"
  );
  const createConversation = useMutation(api.messaging.createConversation);

  const filteredUsers = users?.filter((user) =>
    searchQuery
      ? user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const getUserRole = (userId: string) => {
    return userDetails?.find((u) => u.id === userId);
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!title.trim() || selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      const conversationId = await createConversation({
        organizationId,
        participants: selectedUsers,
        type: "group",
        title: title.trim(),
      });

      onCreated?.(conversationId);
      handleClose();
    } catch (error) {
      console.error("Failed to create group chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setSelectedUsers([]);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border-white/[0.08] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Create Group Chat
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Create a group conversation with multiple participants.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-white/70">
              Group Name
            </Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white/70">
                Selected ({selectedUsers.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const userRole = getUserRole(userId);
                  return (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.08] text-white/70 text-xs"
                    >
                      <User className="w-3 h-3" />
                      {userId.slice(-8)}
                      {userRole?.isAdmin && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                      <button
                        onClick={() => toggleUser(userId)}
                        className="ml-1 text-white/40 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Search */}
          <div className="space-y-2">
            <Label className="text-white/70">Add Participants</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Users List */}
          <ScrollArea className="h-[200px] rounded-lg border border-white/[0.08]">
            <div className="p-2 space-y-1">
              {users === undefined ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/[0.04] rounded-md" />
                ))
              ) : filteredUsers?.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-4">
                  No users found
                </p>
              ) : (
                filteredUsers?.map((user) => {
                  const userRole = getUserRole(user.userId);
                  const isSelected = selectedUsers.includes(user.userId);

                  return (
                    <button
                      key={user.userId}
                      onClick={() => toggleUser(user.userId)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
                        isSelected
                          ? "bg-cyan-500/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                      />
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm truncate">{user.userId.slice(-8)}</p>
                          {userRole?.isAdmin && <AdminBadge />}
                        </div>
                        <p className="text-[10px] text-white/40 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || selectedUsers.length === 0 || isCreating}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
