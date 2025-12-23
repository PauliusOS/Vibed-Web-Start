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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User, Users, HelpCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  organizationId,
}: NewConversationDialogProps) {
  const router = useRouter();
  const [type, setType] = useState<"direct" | "campaign" | "support">("direct");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch available users to message
  const messageableUsers = useQuery(api.messaging.getMessageableUsers, {
    organizationId,
  });

  // Fetch campaigns for campaign-type conversations
  const campaigns = useQuery(api.campaigns.listCampaigns, { organizationId });

  const createConversation = useMutation(api.messaging.createConversation);

  const handleCreate = async () => {
    if (selectedParticipants.length === 0 && type !== "support") {
      return;
    }

    setIsCreating(true);
    try {
      const conversationId = await createConversation({
        organizationId,
        participants: selectedParticipants,
        type,
        campaignId: selectedCampaign ? (selectedCampaign as Id<"campaigns">) : undefined,
        title: title || undefined,
        initialMessage: initialMessage || undefined,
      });

      onOpenChange(false);
      resetForm();
      router.push(`/admin2/messages/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setType("direct");
    setSelectedParticipants([]);
    setTitle("");
    setInitialMessage("");
    setSelectedCampaign("");
    setUserSearch("");
  };

  const toggleParticipant = (userId: string) => {
    if (type === "direct") {
      // For direct messages, only allow one participant
      setSelectedParticipants([userId]);
    } else {
      // For group conversations, allow multiple
      if (selectedParticipants.includes(userId)) {
        setSelectedParticipants(selectedParticipants.filter((id) => id !== userId));
      } else {
        setSelectedParticipants([...selectedParticipants, userId]);
      }
    }
  };

  const filteredUsers = messageableUsers?.filter((user) =>
    user.userId.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "creator":
        return "bg-purple-500/20 text-purple-400";
      case "client":
        return "bg-blue-500/20 text-blue-400";
      case "admin":
      case "super_admin":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0f] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">New Conversation</DialogTitle>
          <DialogDescription className="text-white/60">
            Start a new conversation with users in your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Conversation Type */}
          <div className="space-y-2">
            <Label className="text-white/80">Conversation Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  type === "direct"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => {
                  setType("direct");
                  setSelectedParticipants([]);
                }}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Direct</span>
              </Button>
              <Button
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  type === "campaign"
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => {
                  setType("campaign");
                  setSelectedParticipants([]);
                }}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Campaign</span>
              </Button>
              <Button
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  type === "support"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
                onClick={() => {
                  setType("support");
                  setSelectedParticipants([]);
                }}
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-xs">Support</span>
              </Button>
            </div>
          </div>

          {/* Campaign Selection (for campaign type) */}
          {type === "campaign" && (
            <div className="space-y-2">
              <Label className="text-white/80">Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  {campaigns?.map((campaign) => (
                    <SelectItem
                      key={campaign._id}
                      value={campaign._id}
                      className="text-white hover:bg-white/10"
                    >
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title (for campaign and support) */}
          {(type === "campaign" || type === "support") && (
            <div className="space-y-2">
              <Label className="text-white/80">Conversation Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === "campaign" ? "e.g., Summer Campaign Discussion" : "e.g., Question about payments"
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          )}

          {/* Participant Selection */}
          <div className="space-y-2">
            <Label className="text-white/80">
              {type === "direct" ? "Message To" : "Participants"}
            </Label>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* User List */}
            <div className="max-h-48 overflow-y-auto space-y-1 border border-white/10 rounded-lg p-2">
              {filteredUsers === undefined ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-white/40" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center py-4 text-white/40 text-sm">
                  {userSearch ? "No users found" : "No users available"}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => toggleParticipant(user.userId)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      selectedParticipants.includes(user.userId)
                        ? "bg-blue-500/20 border border-blue-500/50"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.userId.slice(-2).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-white">User {user.userId.slice(-4)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                        {user.role === "super_admin" ? "admin" : user.role}
                      </span>
                    </div>
                    {selectedParticipants.includes(user.userId) && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            {selectedParticipants.length > 0 && (
              <p className="text-xs text-white/40">
                {selectedParticipants.length} user{selectedParticipants.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Initial Message */}
          <div className="space-y-2">
            <Label className="text-white/80">Initial Message (optional)</Label>
            <Textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your first message..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            className="border-white/10 text-white/60 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || (selectedParticipants.length === 0 && type !== "support")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Start Conversation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
