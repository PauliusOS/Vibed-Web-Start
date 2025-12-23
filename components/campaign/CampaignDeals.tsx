"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DollarSign,
  MoreHorizontal,
  Edit,
  Link as LinkIcon,
  Copy,
  RefreshCw,
  Video,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  FileVideo,
  ExternalLink,
} from "lucide-react";
import { SetDealTermsModal } from "./SetDealTermsModal";
import { formatCurrency, formatNumber, getCollaborationUrl } from "@/lib/constants";

interface Deal {
  _id: Id<"campaignCreators">;
  creatorId: string;
  creatorName?: string;
  creatorFollowers?: number;
  status: "invited" | "active" | "removed";
  flatRatePerVideo?: number;
  rpmRate?: number;
  requiredVideos: number;
  dealNotes?: string;
  dealAcceptedAt?: number;
  collaborationToken?: string;
  videosCompleted: number;
  draftsSubmitted: number;
  pendingDrafts: number;
  flatRateEarned: number;
  rpmEarned: number;
  totalEarned: number;
  totalViews: number;
}

interface CampaignDealsProps {
  campaignId: Id<"campaigns">;
}

function DealStatusBadge({ status, dealAcceptedAt }: { status: string; dealAcceptedAt?: number }) {
  if (status === "active" && dealAcceptedAt) {
    return (
      <Badge className="bg-green-500/10 text-green-500">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Accepted
      </Badge>
    );
  }

  if (status === "invited") {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-500">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  }

  if (status === "removed") {
    return (
      <Badge className="bg-red-500/10 text-red-500">Removed</Badge>
    );
  }

  return (
    <Badge className="bg-muted text-muted-foreground">{status}</Badge>
  );
}

function DealRow({
  deal,
  onEdit,
  onCopyLink,
  onRegenerateToken,
}: {
  deal: Deal;
  onEdit: () => void;
  onCopyLink: () => void;
  onRegenerateToken: () => void;
}) {
  const progress = deal.requiredVideos > 0
    ? Math.round((deal.videosCompleted / deal.requiredVideos) * 100)
    : 0;

  return (
    <TableRow>
      {/* Creator */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{deal.creatorName || deal.creatorId}</p>
            {deal.creatorFollowers && (
              <p className="text-sm text-muted-foreground">
                {formatNumber(deal.creatorFollowers)} followers
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <DealStatusBadge status={deal.status} dealAcceptedAt={deal.dealAcceptedAt} />
      </TableCell>

      {/* Deal Terms */}
      <TableCell>
        <div className="space-y-1">
          {deal.flatRatePerVideo && (
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span>{formatCurrency(deal.flatRatePerVideo)}/video</span>
            </div>
          )}
          {deal.rpmRate && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span>{formatCurrency(deal.rpmRate)}/1K views</span>
            </div>
          )}
          {!deal.flatRatePerVideo && !deal.rpmRate && (
            <span className="text-sm text-muted-foreground">No terms set</span>
          )}
        </div>
      </TableCell>

      {/* Progress */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {deal.videosCompleted}/{deal.requiredVideos}
            </span>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          {deal.pendingDrafts > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <FileVideo className="h-3 w-3" />
              {deal.pendingDrafts} draft{deal.pendingDrafts > 1 ? "s" : ""} pending
            </div>
          )}
        </div>
      </TableCell>

      {/* Earnings */}
      <TableCell>
        <div className="space-y-1">
          <p className="font-medium">{formatCurrency(deal.totalEarned)}</p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Flat: {formatCurrency(deal.flatRateEarned)}</p>
            <p>RPM: {formatCurrency(deal.rpmEarned)}</p>
          </div>
        </div>
      </TableCell>

      {/* Views */}
      <TableCell>
        <span className="font-medium">{formatNumber(deal.totalViews)}</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Deal Terms
            </DropdownMenuItem>
            {deal.collaborationToken && (
              <>
                <DropdownMenuItem onClick={onCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Collaboration Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRegenerateToken}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Link
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href={getCollaborationUrl(deal.collaborationToken || "")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Workspace
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function CampaignDeals({ campaignId }: CampaignDealsProps) {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const deals = useQuery(api.creators.getCampaignDeals, { campaignId });
  const regenerateToken = useMutation(api.creators.regenerateCollaborationToken);

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}${getCollaborationUrl(token)}`;
    navigator.clipboard.writeText(url);
    toast.success("Collaboration link copied to clipboard");
  };

  const handleRegenerateToken = async (assignmentId: Id<"campaignCreators">) => {
    try {
      const newToken = await regenerateToken({ assignmentId });
      toast.success("Collaboration link regenerated");
      // Copy the new link
      const url = `${window.location.origin}${getCollaborationUrl(newToken)}`;
      navigator.clipboard.writeText(url);
      toast.info("New link copied to clipboard");
    } catch (error) {
      toast.error("Failed to regenerate link");
    }
  };

  if (deals === undefined) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Summary stats
  const totalDeals = deals.length;
  const activeDeals = deals.filter((d) => d.status === "active" && d.dealAcceptedAt).length;
  const pendingDeals = deals.filter((d) => d.status === "invited" || (d.status === "active" && !d.dealAcceptedAt)).length;
  const totalEarnings = deals.reduce((sum, d) => sum + d.totalEarned, 0);
  const totalViews = deals.reduce((sum, d) => sum + d.totalViews, 0);
  const totalVideos = deals.reduce((sum, d) => sum + d.videosCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Total Deals</span>
            </div>
            <p className="text-2xl font-bold">{totalDeals}</p>
            <p className="text-xs text-muted-foreground">
              {activeDeals} active, {pendingDeals} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Video className="h-4 w-4" />
              <span className="text-sm">Videos</span>
            </div>
            <p className="text-2xl font-bold">{totalVideos}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(totalViews)} total views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Total Paid</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
            <p className="text-xs text-muted-foreground">
              Flat + RPM earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Avg CPV</span>
            </div>
            <p className="text-2xl font-bold">
              {totalViews > 0
                ? formatCurrency(totalEarnings / totalViews)
                : "$0.00"}
            </p>
            <p className="text-xs text-muted-foreground">Cost per view</p>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table */}
      <Card>
        <CardContent className="p-0">
          {deals.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No deals configured</p>
              <p className="text-sm text-muted-foreground mb-4">
                Set deal terms for creators in the Creators tab
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deal Terms</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <DealRow
                    key={deal._id}
                    deal={deal}
                    onEdit={() => setEditingDeal(deal)}
                    onCopyLink={() =>
                      deal.collaborationToken && handleCopyLink(deal.collaborationToken)
                    }
                    onRegenerateToken={() => handleRegenerateToken(deal._id)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingDeal && (
        <SetDealTermsModal
          campaignId={campaignId}
          creatorId={editingDeal.creatorId}
          creatorName={editingDeal.creatorName || editingDeal.creatorId}
          existingTerms={{
            flatRatePerVideo: editingDeal.flatRatePerVideo,
            rpmRate: editingDeal.rpmRate,
            requiredVideos: editingDeal.requiredVideos,
            dealNotes: editingDeal.dealNotes,
          }}
          open={!!editingDeal}
          onOpenChange={(open) => !open && setEditingDeal(null)}
        />
      )}
    </div>
  );
}
