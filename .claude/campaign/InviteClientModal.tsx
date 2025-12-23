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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSelectionList } from "./UserSelectionList";
import { UserPlus, Loader2, Mail, Users, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface InviteClientModalProps {
  campaignId: Id<"campaigns">;
  organizationId: Id<"organizations">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingClients?: string[];
}

export function InviteClientModal({
  campaignId,
  organizationId,
  open,
  onOpenChange,
  existingClients = [],
}: InviteClientModalProps) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [activeTab, setActiveTab] = useState<"existing" | "email">("existing");

  // Email invite state
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Query all clients in the organization
  const allUsers = useQuery(api.users.getUsersByRole, {
    organizationId,
    role: "client",
  });

  const inviteClient = useMutation(api.campaigns.inviteClientToCampaign);
  const sendInvitation = useMutation(api.invitations.sendInvitation);

  // Invite existing org users
  const handleInviteExisting = async () => {
    if (selectedClients.length === 0) {
      toast.error("Please select at least one client");
      return;
    }

    setIsInviting(true);

    try {
      const invitePromises = selectedClients.map((clientId) =>
        inviteClient({ campaignId, clientId })
      );

      await Promise.all(invitePromises);

      toast.success(
        `Successfully invited ${selectedClients.length} client${
          selectedClients.length !== 1 ? "s" : ""
        }`
      );

      setSelectedClients([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to invite clients:", error);
      toast.error("Failed to invite clients. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  // Send email invite to new user
  const handleEmailInvite = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);

    try {
      const result = await sendInvitation({
        email,
        organizationId,
        role: "client",
        campaignId,
      });

      const url = `${window.location.origin}/accept-invite/${result.token}`;
      setInviteUrl(url);

      // Auto-copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success("Invitation sent! Link copied to clipboard.");
    } catch (error: unknown) {
      console.error("Failed to send invitation:", error);
      const message = error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setIsInviting(false);
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

  const handleCancel = () => {
    setSelectedClients([]);
    setEmail("");
    setInviteUrl(null);
    onOpenChange(false);
  };

  const handleSendAnother = () => {
    setEmail("");
    setInviteUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Clients to Campaign
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Add existing team members or invite new clients via email.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "existing" | "email")}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="existing" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Users className="h-4 w-4 mr-2" />
              Existing Members
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Mail className="h-4 w-4 mr-2" />
              Email Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="py-4">
            {allUsers === undefined ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/40" />
              </div>
            ) : allUsers.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>No clients in your organization yet.</p>
                <p className="text-sm mt-2">Use the &quot;Email Invite&quot; tab to invite new clients.</p>
              </div>
            ) : (
              <UserSelectionList
                users={allUsers.map((user) => ({
                  userId: user.userId,
                  role: user.role,
                  username: user.userId.split("|")[1],
                }))}
                selectedUsers={selectedClients}
                onSelectionChange={setSelectedClients}
                excludeUserIds={existingClients}
                emptyMessage="All clients are already assigned to this campaign"
              />
            )}
          </TabsContent>

          <TabsContent value="email" className="py-4">
            {inviteUrl ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm mb-2">Invitation sent successfully!</p>
                  <p className="text-white/60 text-sm">
                    Share this link with the client to join your campaign:
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={inviteUrl}
                    readOnly
                    className="bg-white/5 border-white/10 text-white font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSendAnother}
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Another Invite
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Client&apos;s Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <p className="text-sm text-white/40">
                  The client will receive an invitation to join your organization and this campaign.
                  They&apos;ll have read-only access to view campaign performance and provide feedback.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isInviting}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            {inviteUrl ? "Done" : "Cancel"}
          </Button>

          {activeTab === "existing" && !inviteUrl && (
            <Button
              onClick={handleInviteExisting}
              disabled={isInviting || selectedClients.length === 0}
              className="bg-white text-black hover:bg-white/90"
            >
              {isInviting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite {selectedClients.length > 0 && `(${selectedClients.length})`}
                </>
              )}
            </Button>
          )}

          {activeTab === "email" && !inviteUrl && (
            <Button
              onClick={handleEmailInvite}
              disabled={isInviting || !email}
              className="bg-white text-black hover:bg-white/90"
            >
              {isInviting ? (
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
