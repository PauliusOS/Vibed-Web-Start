"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rosterId: Id<"creatorRosters">;
  organizationId: Id<"organizations">;
  currentSharedWith: string[];
}

export function ShareRosterDialog({
  open,
  onOpenChange,
  rosterId,
  organizationId,
  currentSharedWith,
}: ShareRosterDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(currentSharedWith)
  );
  const [isSharing, setIsSharing] = useState(false);

  const shareRoster = useMutation(api.rosters.shareRoster);
  const unshareRoster = useMutation(api.rosters.unshareRoster);

  // Get admins only
  const teamMembers = useQuery(api.teamMembers.getOrganizationAdmins, {
    organizationId,
  });

  // Update selected users when currentSharedWith changes
  useEffect(() => {
    setSelectedUsers(new Set(currentSharedWith));
  }, [currentSharedWith]);

  const handleToggleUser = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleSave = async () => {
    setIsSharing(true);

    try {
      // Find users to add (in selection but not in currentSharedWith)
      const toAdd = Array.from(selectedUsers).filter(
        (userId) => !currentSharedWith.includes(userId)
      );

      // Find users to remove (in currentSharedWith but not in selection)
      const toRemove = currentSharedWith.filter(
        (userId) => !selectedUsers.has(userId)
      );

      // Execute changes
      if (toAdd.length > 0) {
        await shareRoster({ rosterId, userIds: toAdd });
      }
      if (toRemove.length > 0) {
        await unshareRoster({ rosterId, userIds: toRemove });
      }

      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to share roster:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-cyan-400" />
            Share Roster
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Choose which admins can access this roster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Sharing Info */}
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-sm text-cyan-300">
              Shared members can view and edit creators in this roster
            </p>
          </div>

          {/* Admins List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <p className="text-sm text-white/70 mb-3">Admins</p>
            
            {!teamMembers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8 text-white/50 text-sm">
                No other admins found
              </div>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Checkbox
                    checked={selectedUsers.has(member.userId)}
                    onCheckedChange={() => handleToggleUser(member.userId)}
                    className="border-white/30 data-[state=checked]:bg-cyan-600"
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    {member.email && (
                      <p className="text-xs text-white/50 truncate">{member.email}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {member.role}
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* Currently Shared */}
          {currentSharedWith.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/70 mb-2">
                Currently shared with {currentSharedWith.length} team member(s)
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSharing}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSharing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            Save Sharing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
