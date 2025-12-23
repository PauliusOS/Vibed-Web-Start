"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Copy, Check, Loader2, Mail, UserPlus } from "lucide-react";

interface SendInviteModalProps {
  organizationId: Id<"organizations">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Role = "admin" | "client" | "creator";

export function SendInviteModal({
  organizationId,
  open,
  onOpenChange,
}: SendInviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("creator");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Query campaigns for the organization
  const campaigns = useQuery(api.campaigns.listCampaigns, { organizationId });

  // Mutation
  const sendInvitation = useMutation(api.invitations.sendInvitation);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate campaign selection based on role
    if (role === "client" && !selectedCampaignId) {
      toast.error("Please select a campaign for the client");
      return;
    }

    if (role === "creator" && selectedCampaignIds.length === 0) {
      toast.error("Please select at least one campaign for the creator");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendInvitation({
        email,
        role,
        organizationId,
        campaignId: role === "client" ? (selectedCampaignId as Id<"campaigns">) : undefined,
        campaignIds: role === "creator" ? (selectedCampaignIds as Id<"campaigns">[]) : undefined,
      });

      const url = `${window.location.origin}/accept-invite/${result.token}`;
      setInviteUrl(url);

      // Auto-copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success("Invitation created! Link copied to clipboard.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    }
  };

  const handleClose = () => {
    // Reset form
    setEmail("");
    setRole("creator");
    setSelectedCampaignId("");
    setSelectedCampaignIds([]);
    setInviteUrl(null);
    setCopied(false);
    onOpenChange(false);
  };

  const handleSendAnother = () => {
    setEmail("");
    setSelectedCampaignId("");
    setSelectedCampaignIds([]);
    setInviteUrl(null);
    setCopied(false);
  };

  const toggleCampaign = (campaignId: string) => {
    setSelectedCampaignIds((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Send Invitation
          </DialogTitle>
          <DialogDescription>
            Invite a new member to your organization
          </DialogDescription>
        </DialogHeader>

        {inviteUrl ? (
          // Success state - show invite link
          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">
                Invitation created successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Share this link with {email} to join your organization:
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                value={inviteUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleSendAnother}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Another
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        ) : (
          // Form state
          <div className="space-y-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value as Role);
                  // Reset campaign selections when role changes
                  setSelectedCampaignId("");
                  setSelectedCampaignIds([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {role === "admin" && "Admins can manage campaigns, creators, and clients."}
                {role === "client" && "Clients can view their assigned campaign and provide feedback."}
                {role === "creator" && "Creators can access collaboration workspaces for assigned campaigns."}
              </p>
            </div>

            {/* Campaign Selection for Clients */}
            {role === "client" && (
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Select
                  value={selectedCampaignId}
                  onValueChange={setSelectedCampaignId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns === undefined ? (
                      <SelectItem value="loading" disabled>
                        Loading campaigns...
                      </SelectItem>
                    ) : campaigns.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No campaigns available
                      </SelectItem>
                    ) : (
                      campaigns.map((campaign) => (
                        <SelectItem key={campaign._id} value={campaign._id}>
                          {campaign.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The client will have access to this campaign only.
                </p>
              </div>
            )}

            {/* Campaign Selection for Creators (multi-select) */}
            {role === "creator" && (
              <div className="space-y-2">
                <Label>Campaigns</Label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {campaigns === undefined ? (
                    <p className="text-sm text-muted-foreground">Loading campaigns...</p>
                  ) : campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No campaigns available</p>
                  ) : (
                    campaigns.map((campaign) => (
                      <div key={campaign._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={campaign._id}
                          checked={selectedCampaignIds.includes(campaign._id)}
                          onCheckedChange={() => toggleCampaign(campaign._id)}
                        />
                        <label
                          htmlFor={campaign._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {campaign.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedCampaignIds.length === 0
                    ? "Select at least one campaign"
                    : `${selectedCampaignIds.length} campaign(s) selected`}
                </p>
              </div>
            )}
          </div>
        )}

        {!inviteUrl && (
          <DialogFooter>
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
