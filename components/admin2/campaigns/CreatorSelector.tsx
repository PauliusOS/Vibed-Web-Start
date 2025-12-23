"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  X,
  Search,
  User,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  Instagram,
  Check,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorAssignment {
  _id: Id<"campaignCreators">;
  creatorId: string;
  status: string;
  collaborationToken?: string;
  flatRatePerVideo?: number;
  rpmRate?: number;
}

interface CreatorProfile {
  userId: string;
  username: string;
  platform: string;
  followerCount: number;
  profilePictureUrl?: string;
}

interface CreatorSelectorProps {
  campaignId: Id<"campaigns">;
  organizationId: Id<"organizations">;
  assignedCreators: CreatorAssignment[];
}

export function CreatorSelector({
  campaignId,
  organizationId,
  assignedCreators,
}: CreatorSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingCreator, setAddingCreator] = useState<string | null>(null);
  const [removingCreator, setRemovingCreator] = useState<string | null>(null);

  // Get all creators in organization
  const organizationCreators = useQuery(api.creators.getCreatorProfiles, {
    organizationId,
  });

  // Mutations
  const inviteCreator = useMutation(api.campaigns.inviteCreatorToCampaign);
  const removeCreator = useMutation(api.campaigns.removeCreatorFromCampaign);

  // Filter out already assigned creators
  const assignedCreatorIds = new Set(
    assignedCreators
      .filter((c) => c.status === "active" || c.status === "invited")
      .map((c) => c.creatorId)
  );

  const availableCreators = (organizationCreators || []).filter(
    (creator) => !assignedCreatorIds.has(creator.userId)
  );

  const filteredCreators = availableCreators.filter((creator) =>
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCreator = async (creatorId: string) => {
    setAddingCreator(creatorId);
    try {
      await inviteCreator({
        campaignId,
        creatorId,
      });
      // Keep dialog open to add more
    } catch (error) {
      console.error("Error adding creator:", error);
    } finally {
      setAddingCreator(null);
    }
  };

  const handleRemoveCreator = async (creatorId: string) => {
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

  const activeCreators = assignedCreators.filter((c) => c.status === "active");

  const getCreatorProfile = (creatorId: string): CreatorProfile | undefined => {
    return organizationCreators?.find((p) => p.userId === creatorId);
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Creators</h3>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
            {activeCreators.length}
          </span>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Creator
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-white">Add Creators</DialogTitle>
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

            {/* Creator List */}
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {organizationCreators === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                </div>
              ) : filteredCreators.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No available creators found</p>
                  <p className="text-xs mt-1">
                    All creators are already assigned or none exist
                  </p>
                </div>
              ) : (
                filteredCreators.map((creator) => (
                  <div
                    key={creator.userId}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={creator.profilePictureUrl} alt={creator.username} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {creator.platform === "instagram" ? (
                            <Instagram className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">@{creator.username}</p>
                        <p className="text-xs text-white/40">
                          {formatFollowers(creator.followerCount)} followers
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddCreator(creator.userId)}
                      disabled={addingCreator === creator.userId}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      {addingCreator === creator.userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="text-xs text-white/40 text-center pt-2 border-t border-white/[0.06]">
              Creators will receive a collaboration link to submit content
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assigned Creators List */}
      <div className="space-y-3">
        {activeCreators.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No creators assigned yet</p>
            <p className="text-xs mt-1">Add creators to start tracking their content</p>
          </div>
        ) : (
          activeCreators.map((assignment) => {
            const profile = getCreatorProfile(assignment.creatorId);
            return (
              <div
                key={assignment._id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarImage src={profile?.profilePictureUrl} alt={profile?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {profile?.platform === "instagram" ? (
                        <Instagram className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">
                      @{profile?.username || assignment.creatorId.split("|")[1] || "Unknown"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      {profile && (
                        <span>{formatFollowers(profile.followerCount)} followers</span>
                      )}
                      {assignment.flatRatePerVideo && (
                        <>
                          <span className="text-white/20">|</span>
                          <span className="text-emerald-400">
                            ${assignment.flatRatePerVideo}/video
                          </span>
                        </>
                      )}
                      {assignment.rpmRate && (
                        <>
                          <span className="text-white/20">|</span>
                          <span className="text-blue-400">${assignment.rpmRate} RPM</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {assignment.collaborationToken && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/40 hover:text-white"
                      onClick={() => {
                        const url = `${window.location.origin}/collaborate/${assignment.collaborationToken}`;
                        navigator.clipboard.writeText(url);
                      }}
                      title="Copy collaboration link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCreator(assignment.creatorId)}
                    disabled={removingCreator === assignment.creatorId}
                    className="text-white/40 hover:text-red-400"
                  >
                    {removingCreator === assignment.creatorId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassPanel>
  );
}
