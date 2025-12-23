"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, X, Video, DollarSign, Link as LinkIcon, Copy, TrendingUp } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { SetDealTermsModal } from "./SetDealTermsModal";
import { formatCurrency, getCollaborationUrl } from "@/lib/constants";

interface CreatorAssignment {
  _id: Id<"campaignCreators">;
  creatorId: string;
  joinedAt: number;
  status: "invited" | "active" | "removed";
  requiredVideos: number;
  videoCount?: number;
  totalViews?: number;
  // Deal terms
  flatRatePerVideo?: number;
  rpmRate?: number;
  dealNotes?: string;
  dealAcceptedAt?: number;
  collaborationToken?: string;
}

interface CampaignCreatorsProps {
  campaignId: Id<"campaigns">;
  creators?: CreatorAssignment[];
  onInvite?: () => void;
}

function CreatorCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatorCard({
  creator,
  campaignId,
  onRemove,
}: {
  creator: CreatorAssignment;
  campaignId: Id<"campaigns">;
  onRemove: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  const handleCopyLink = () => {
    if (creator.collaborationToken) {
      const url = `${window.location.origin}${getCollaborationUrl(creator.collaborationToken)}`;
      navigator.clipboard.writeText(url);
      toast.success("Collaboration link copied!");
    }
  };

  const hasDealTerms = creator.flatRatePerVideo || creator.rpmRate;

  return (
    <>
      <Card className="bg-[#1a1a1a] border-[#3a3a3a] hover:border-white/20 transition-colors group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-white/80" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">
                  {creator.creatorId.split("|")[1] || "Creator"}
                </h3>
                <Badge
                  className={
                    creator.status === "active"
                      ? "bg-green-500/10 text-green-500 text-xs"
                      : "bg-gray-500/10 text-gray-500 text-xs"
                  }
                >
                  {creator.status}
                </Badge>
              </div>
            </div>
            {creator.status === "active" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-500 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Joined</span>
              <span className="text-white">
                {new Date(creator.joinedAt).toLocaleDateString()}
              </span>
            </div>
            {creator.videoCount !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  Videos
                </span>
                <span className="text-white font-medium">{creator.videoCount}</span>
              </div>
            )}
            {creator.totalViews !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Total Views</span>
                <span className="text-white font-medium">
                  {creator.totalViews >= 1000000
                    ? `${(creator.totalViews / 1000000).toFixed(1)}M`
                    : creator.totalViews >= 1000
                    ? `${(creator.totalViews / 1000).toFixed(1)}K`
                    : creator.totalViews}
                </span>
              </div>
            )}

            {/* Deal Terms Section */}
            {hasDealTerms ? (
              <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                {creator.flatRatePerVideo && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Flat Rate
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(creator.flatRatePerVideo)}/video
                    </span>
                  </div>
                )}
                {creator.rpmRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      RPM
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(creator.rpmRate)}/1K views
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setShowDealModal(true)}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              {hasDealTerms ? "Edit Deal" : "Set Deal"}
            </Button>
            {creator.collaborationToken && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleCopyLink}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <SetDealTermsModal
        campaignId={campaignId}
        creatorId={creator.creatorId}
        creatorName={creator.creatorId.split("|")[1] || "Creator"}
        existingTerms={hasDealTerms ? {
          flatRatePerVideo: creator.flatRatePerVideo,
          rpmRate: creator.rpmRate,
          requiredVideos: creator.requiredVideos,
          dealNotes: creator.dealNotes,
        } : undefined}
        open={showDealModal}
        onOpenChange={setShowDealModal}
      />
    </>
  );
}

export function CampaignCreators({
  campaignId,
  creators,
  onInvite,
}: CampaignCreatorsProps) {
  const removeCreator = useMutation(api.campaigns.removeCreatorFromCampaign);

  const handleRemove = async (creatorId: string) => {
    try {
      await removeCreator({ campaignId, creatorId });
      toast.success("Creator removed from campaign");
    } catch {
      toast.error("Failed to remove creator");
    }
  };

  // Filter only active creators
  const activeCreators = creators?.filter((c) => c.status === "active");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Assigned Creators {activeCreators && `(${activeCreators.length})`}
        </h2>
        {onInvite && (
          <Button
            onClick={onInvite}
            className="bg-white text-black hover:bg-white/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Creator
          </Button>
        )}
      </div>

      {creators === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreatorCardSkeleton />
          <CreatorCardSkeleton />
          <CreatorCardSkeleton />
        </div>
      ) : activeCreators?.length === 0 ? (
        <Card className="bg-[#1a1a1a] border-[#3a3a3a]">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="h-8 w-8 text-white/40" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">No creators assigned</p>
                <p className="text-sm text-white/60">
                  Invite creators to submit videos and track their performance
                </p>
              </div>
              {onInvite && (
                <Button
                  onClick={onInvite}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite First Creator
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCreators?.map((creator) => (
            <CreatorCard
              key={creator._id}
              creator={creator}
              campaignId={campaignId}
              onRemove={() => handleRemove(creator.creatorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
