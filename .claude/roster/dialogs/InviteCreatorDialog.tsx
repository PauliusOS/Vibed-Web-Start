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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Mail,
  Send,
  CheckCircle2,
  Users,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Creator {
  id: string;
  displayName?: string;
  username: string;
  platform: string;
  profilePictureUrl?: string;
  email?: string;
}

interface InviteCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
  creators: Creator[];
  onSuccess?: () => void;
}

export function InviteCreatorDialog({
  open,
  onOpenChange,
  organizationId,
  creators,
  onSuccess,
}: InviteCreatorDialogProps) {
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sendInvitation = useMutation(api.creatorInvitations.send);

  // Get campaigns for assignment
  const campaigns = useQuery(api.campaigns.listCampaigns, {
    organizationId,
    status: "active",
  });

  // Initialize emails from creator data
  useEffect(() => {
    if (open) {
      const initialEmails: Record<string, string> = {};
      creators.forEach((creator) => {
        initialEmails[creator.id] = creator.email || "";
      });
      setEmails(initialEmails);
      setSentCount(0);
      setErrors({});
      setMessage("");
      setSelectedCampaign("");
    }
  }, [open, creators]);

  const handleEmailChange = (creatorId: string, email: string) => {
    setEmails((prev) => ({ ...prev, [creatorId]: email }));
    // Clear error when user types
    if (errors[creatorId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[creatorId];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvitations = async () => {
    // Validate all emails
    const newErrors: Record<string, string> = {};
    let hasValidEmail = false;

    creators.forEach((creator) => {
      const email = emails[creator.id]?.trim();
      if (!email) {
        newErrors[creator.id] = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors[creator.id] = "Invalid email format";
      } else {
        hasValidEmail = true;
      }
    });

    if (Object.keys(newErrors).length > 0 && !hasValidEmail) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);
    let successCount = 0;
    const sendErrors: Record<string, string> = {};

    // Send invitations one by one
    for (const creator of creators) {
      const email = emails[creator.id]?.trim();
      if (!email || !validateEmail(email)) {
        if (!email) {
          sendErrors[creator.id] = "Email required";
        }
        continue;
      }

      try {
        await sendInvitation({
          organizationId,
          creatorId: creator.id.startsWith("ext_") ? undefined : creator.id,
          creatorEmail: email,
          campaignId: selectedCampaign
            ? (selectedCampaign as Id<"campaigns">)
            : undefined,
          message: message || undefined,
        });
        successCount++;
      } catch (err: any) {
        sendErrors[creator.id] = err.message || "Failed to send";
      }
    }

    setErrors(sendErrors);
    setSentCount(successCount);
    setIsSending(false);

    if (successCount > 0 && Object.keys(sendErrors).length === 0) {
      // All successful, close after delay
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      onOpenChange(false);
    }
  };

  const allSent = sentCount === creators.length && sentCount > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-cyan-400" />
            Invite Creators
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Send platform invitations to {creators.length} creator
            {creators.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        {allSent ? (
          // Success State
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Invitations Sent!
            </h3>
            <p className="text-white/60 text-sm">
              {sentCount} invitation{sentCount !== 1 ? "s" : ""} sent
              successfully
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Creator List */}
            <div className="space-y-3">
              <Label className="text-white/70 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Creators to Invite
              </Label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.profilePictureUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
                        {(creator.displayName || creator.username)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">
                          {creator.displayName || creator.username}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            creator.platform === "tiktok"
                              ? "border-white/20 text-white/70"
                              : "border-pink-500/30 text-pink-400"
                          )}
                        >
                          {creator.platform}
                        </Badge>
                      </div>
                      <Input
                        type="email"
                        placeholder="creator@email.com"
                        value={emails[creator.id] || ""}
                        onChange={(e) =>
                          handleEmailChange(creator.id, e.target.value)
                        }
                        disabled={isSending}
                        className={cn(
                          "mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-8 text-sm",
                          errors[creator.id] && "border-red-500/50"
                        )}
                      />
                      {errors[creator.id] && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors[creator.id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Assignment */}
            <div className="space-y-2">
              <Label
                htmlFor="campaign-select"
                className="text-white/70 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Assign to Campaign (Optional)
              </Label>
              <Select
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
                disabled={isSending}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="No campaign - just invite to platform" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem
                    value="none"
                    className="text-white hover:bg-white/5"
                  >
                    No campaign
                  </SelectItem>
                  {campaigns?.map((campaign) => (
                    <SelectItem
                      key={campaign._id}
                      value={campaign._id}
                      className="text-white hover:bg-white/5"
                    >
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white/70">
                Invitation Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
              />
            </div>

            {/* Info */}
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-sm text-cyan-300">
                Creators will receive an email invitation with a link to join
                your organization on the platform.
              </p>
            </div>

            {/* Sent Progress */}
            {sentCount > 0 && sentCount < creators.length && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-green-300">
                  {sentCount} of {creators.length} invitation
                  {sentCount !== 1 ? "s" : ""} sent
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!allSent && (
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSending}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitations}
              disabled={isSending || creators.length === 0}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send {creators.length} Invitation
                  {creators.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
