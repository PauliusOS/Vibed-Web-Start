"use client";

import { UserPlus, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { Id } from "@/convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface InviteCreatorDialogProps {
  creatorId: Id<"creatorProfiles">;
  username: string;
  platform: string;
  followerCount: number;
  triggerButton?: React.ReactNode;
}

export function InviteCreatorDialog({
  creatorId,
  username,
  platform,
  followerCount,
  triggerButton,
}: InviteCreatorDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedOrganizationId } = useOrganization();

  // Query active campaigns for this organization
  const campaigns = useQuery(
    api.campaigns.listCampaigns,
    selectedOrganizationId ? { organizationId: selectedOrganizationId } : "skip"
  );

  const activeCampaigns = campaigns?.filter((c) => c.status === "active");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!selectedOrganizationId) {
      toast.error("Please select an organization first");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual invitation logic
      // This would typically involve:
      // 1. Sending an invitation email to the creator
      // 2. Creating a pending invitation record
      // 3. Linking the creator to a campaign or organization

      toast.success(`Invitation sent to @${username} at ${email}`);
      setEmail("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            size="sm"
            className="flex-1 text-xs transition-colors duration-200"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Invite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-semibold text-foreground">
            Invite Creator to Campaign
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            Invite @{username} to collaborate on a campaign. They will receive an email
            with campaign details and next steps.
          </DialogDescription>
        </DialogHeader>

        {/* Creator Info Card */}
        <div className="p-4 bg-muted rounded-lg border border-border mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-purple-500/10 text-purple-500 text-lg">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">@{username}</span>
                <Badge className="bg-purple-500/10 text-purple-500 capitalize text-xs">
                  {platform}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(followerCount)} followers
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="inviteEmail"
                className="h-10 pl-9"
                placeholder="creator@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="h-10" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </form>

        {activeCampaigns && activeCampaigns.length > 0 && (
          <>
            <h4 className="mt-4 text-sm font-medium text-foreground">
              Active Campaigns ({activeCampaigns.length})
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              The creator will be able to view and join these campaigns
            </p>
            <div className="max-h-[200px] overflow-y-auto">
              <ul className="divide-y border border-border rounded-lg">
                {activeCampaigns.map((campaign) => (
                  <li
                    key={campaign._id}
                    className="flex items-center justify-between py-2.5 px-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm">
                        {campaign.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Budget: ${campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 text-xs font-medium border-green-500/20"
                    >
                      Active
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {(!activeCampaigns || activeCampaigns.length === 0) && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              No active campaigns found. Create a campaign first to invite creators.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
