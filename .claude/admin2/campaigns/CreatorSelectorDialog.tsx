"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  Search,
  User,
  Loader2,
  Instagram,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: Id<"campaigns"> | null;
  organizationId: Id<"organizations">;
}

export function CreatorSelectorDialog({
  open,
  onOpenChange,
  campaignId,
  organizationId,
}: CreatorSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addingCreator, setAddingCreator] = useState<string | null>(null);
  const [removingCreator, setRemovingCreator] = useState<string | null>(null);

  // Get all creators in organization
  const organizationCreators = useQuery(api.creators.getCreatorProfiles, {
    organizationId,
  });

  // Get assigned creators for this campaign
  const assignedCreators = useQuery(
    api.campaigns.getCampaignCreators,
    campaignId ? { campaignId } : "skip"
  );

  // Mutations
  const inviteCreator = useMutation(api.campaigns.inviteCreatorToCampaign);
  const removeCreator = useMutation(api.campaigns.removeCreatorFromCampaign);

  // Filter out already assigned creators (query returns userId not creatorId)
  const assignedCreatorIds = new Set(
    (assignedCreators || [])
      .filter((c) => c.status === "active" || c.status === "invited")
      .map((c) => c.userId)
  );

  const availableCreators = (organizationCreators || []).filter(
    (creator) => !assignedCreatorIds.has(creator.userId)
  );

  const filteredCreators = availableCreators.filter((creator) =>
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCreators = (assignedCreators || []).filter(
    (c) => c.status === "active" || c.status === "invited"
  );

  const handleAddCreator = async (creatorId: string) => {
    if (!campaignId) return;
    setAddingCreator(creatorId);
    try {
      await inviteCreator({
        campaignId,
        creatorId,
      });
    } catch (error) {
      console.error("Error adding creator:", error);
    } finally {
      setAddingCreator(null);
    }
  };

  const handleRemoveCreator = async (creatorId: string) => {
    if (!campaignId) return;
    setRemovingCreator(creatorId);
    try {
      await removeCreator({
        campaignId,
        creatorId,
      });
    } catch (error) {
      console.error("Error removing creator:", error);
    } finally {
      setRemovingCreator(null);
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.06]">
        <DialogHeader>
          <DialogTitle className="text-white">Assign Creators</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.02] border-white/[0.06] text-white"
          />
        </div>

        {/* Available Creators */}
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">Available</p>
          {organizationCreators === undefined ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="text-center py-6 text-white/40">
              <User className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No available creators</p>
            </div>
          ) : (
            filteredCreators.map((creator) => (
              <div
                key={creator.userId}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8 border border-white/10">
                    <AvatarImage src={creator.profilePictureUrl} alt={creator.username} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {creator.platform === "instagram" ? (
                        <Instagram className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] text-white font-medium">@{creator.username}</p>
                    <p className="text-[11px] text-white/40">
                      {formatFollowers(creator.followerCount)} followers
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddCreator(creator.userId)}
                  disabled={addingCreator === creator.userId}
                  className="h-7 px-2 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {addingCreator === creator.userId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Assigned Creators */}
        {activeCreators.length > 0 && (
          <div className="max-h-[150px] overflow-y-auto space-y-2 pt-2 border-t border-white/[0.06]">
            <p className="text-xs text-white/40 uppercase tracking-wider">
              Assigned ({activeCreators.length})
            </p>
            {activeCreators.map((assignment) => (
              <div
                key={assignment.userId}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8 border border-white/10">
                    <AvatarImage src={assignment.profilePictureUrl} alt={assignment.username} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {assignment.platform === "instagram" ? (
                        <Instagram className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] text-white font-medium">
                      @{assignment.username}
                    </p>
                    <p className="text-[11px] text-white/40">
                      {formatFollowers(assignment.followerCount)} followers
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCreator(assignment.userId)}
                  disabled={removingCreator === assignment.userId}
                  className="h-7 w-7 p-0 text-white/40 hover:text-red-400"
                >
                  {removingCreator === assignment.userId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-[11px] text-white/40 text-center pt-2 border-t border-white/[0.06]">
          Creators will receive a collaboration link to submit content
        </div>
      </DialogContent>
    </Dialog>
  );
}
