"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Send,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  User,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
export interface Creator {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
}

export interface InvitationFormData {
  creatorId?: string;
  email: string;
  name?: string;
  campaignId?: string;
  message?: string;
  expiresAt?: Date;
}

interface SendInvitationDialogProps {
  creators?: Creator[];
  campaigns?: Campaign[];
  onSend?: (data: InvitationFormData) => Promise<void>;
  trigger?: React.ReactNode;
}

export function SendInvitationDialog({
  creators = [],
  campaigns = [],
  onSend,
  trigger,
}: SendInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creatorSearchOpen, setCreatorSearchOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Form state
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [inviteMode, setInviteMode] = useState<"existing" | "new">("existing");

  // Reset form
  const resetForm = () => {
    setSelectedCreator(null);
    setEmail("");
    setName("");
    setSelectedCampaignId("");
    setMessage("");
    setExpiresAt(undefined);
    setInviteMode("existing");
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!onSend) return;

    const formData: InvitationFormData = {
      email: selectedCreator?.email || email,
      name: selectedCreator?.name || name || undefined,
      creatorId: selectedCreator?.id,
      campaignId: selectedCampaignId && selectedCampaignId !== "__none__" ? selectedCampaignId : undefined,
      message: message || undefined,
      expiresAt: expiresAt,
    };

    setIsSubmitting(true);
    try {
      await onSend(formData);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to send invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = selectedCreator || (email && email.includes("@"));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border-white/[0.06] text-white sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Send Creator Invitation</DialogTitle>
            <DialogDescription className="text-white/60">
              Invite a creator to join your organization or a specific campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Toggle between existing and new creator */}
            <div className="flex items-center gap-2 p-1 bg-white/[0.04] rounded-lg w-fit">
              <button
                type="button"
                onClick={() => {
                  setInviteMode("existing");
                  setEmail("");
                  setName("");
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  inviteMode === "existing"
                    ? "bg-purple-500 text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                Existing Creator
              </button>
              <button
                type="button"
                onClick={() => {
                  setInviteMode("new");
                  setSelectedCreator(null);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  inviteMode === "new"
                    ? "bg-purple-500 text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                New Creator
              </button>
            </div>

            {/* Creator Selection */}
            <AnimatePresence mode="wait">
              {inviteMode === "existing" ? (
                <motion.div
                  key="existing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <Label>Select Creator</Label>
                  <Popover open={creatorSearchOpen} onOpenChange={setCreatorSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={creatorSearchOpen}
                        className="w-full justify-between bg-white/[0.02] border-white/[0.06] text-white hover:bg-white/[0.04]"
                      >
                        {selectedCreator ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                              {selectedCreator.name[0].toUpperCase()}
                            </div>
                            <span>{selectedCreator.name}</span>
                            <span className="text-white/40">
                              ({selectedCreator.email})
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40">Search creators...</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 bg-[#0a0a0a] border-white/[0.06]">
                      <Command className="bg-transparent">
                        <CommandInput
                          placeholder="Search by name or email..."
                          className="border-white/[0.06]"
                        />
                        <CommandList>
                          <CommandEmpty className="py-6 text-center text-sm text-white/60">
                            No creators found.
                          </CommandEmpty>
                          <CommandGroup>
                            {creators.map((creator) => (
                              <CommandItem
                                key={creator.id}
                                value={`${creator.name} ${creator.email}`}
                                onSelect={() => {
                                  setSelectedCreator(creator);
                                  setCreatorSearchOpen(false);
                                }}
                                className="cursor-pointer hover:bg-white/[0.06]"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {creator.name[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                      {creator.name}
                                    </p>
                                    <p className="text-xs text-white/60 truncate">
                                      {creator.email}
                                    </p>
                                  </div>
                                  {selectedCreator?.id === creator.id && (
                                    <Check className="h-4 w-4 text-purple-400" />
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {creators.length === 0 && (
                    <p className="text-xs text-white/40">
                      No existing creators found. Switch to &quot;New Creator&quot; to invite by
                      email.
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address <span className="text-red-400">*</span>
                      </div>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="creator@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name (Optional)
                      </div>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Creator name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Campaign Selection */}
            <div className="space-y-2">
              <Label>Campaign (Optional)</Label>
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue placeholder="Select a campaign (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/[0.06]">
                  <SelectItem value="__none__">No specific campaign</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      <div className="flex items-center gap-2">
                        <span>{campaign.name}</span>
                        <span className="text-white/40 text-xs">
                          ({campaign.status})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/40">
                If selected, the creator will be invited to join this specific campaign.
              </p>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-[100px] resize-none"
              />
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]",
                      !expiresAt && "text-white/40"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, "PPP") : "Pick an expiration date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-white/[0.06]">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={(date) => {
                      setExpiresAt(date);
                      setDatePickerOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-white/40">
                If not set, the invitation will expire in 7 days by default.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
