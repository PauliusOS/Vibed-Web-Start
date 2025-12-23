"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreatePaymentModalProps {
  organizationId: Id<"organizations">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePaymentModal({
  organizationId,
  open,
  onOpenChange,
}: CreatePaymentModalProps) {
  const [campaignId, setCampaignId] = useState<Id<"campaigns"> | "">("");
  const [creatorId, setCreatorId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query campaigns
  const campaigns = useQuery(api.campaigns.listCampaigns, {
    organizationId,
  });

  // Query creators for selected campaign
  const campaignCreators = useQuery(
    api.creators.getCampaignCreators,
    campaignId ? { campaignId } : "skip"
  );

  const createPayment = useMutation(api.payments.createPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignId || !creatorId || !amount || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPayment({
        campaignId,
        creatorId,
        amount: amountNum,
        dueDate: new Date(dueDate).getTime(),
        notes: notes || undefined,
      });

      toast.success("Payment created successfully");

      // Reset form
      setCampaignId("");
      setCreatorId("");
      setAmount("");
      setDueDate("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create payment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Payment</DialogTitle>
          <DialogDescription className="text-white/60">
            Schedule a payment for a creator in a campaign
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campaign Selection */}
          <div className="space-y-2">
            <Label htmlFor="campaign" className="text-white">
              Campaign *
            </Label>
            <Select
              value={campaignId}
              onValueChange={(value) => {
                setCampaignId(value as Id<"campaigns">);
                setCreatorId(""); // Reset creator when campaign changes
              }}
            >
              <SelectTrigger className="bg-[#0a0a0a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
                {campaigns?.map((campaign) => (
                  <SelectItem
                    key={campaign._id}
                    value={campaign._id}
                    className="text-white"
                  >
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Creator Selection */}
          <div className="space-y-2">
            <Label htmlFor="creator" className="text-white">
              Creator *
            </Label>
            <Select
              value={creatorId}
              onValueChange={setCreatorId}
              disabled={!campaignId}
            >
              <SelectTrigger className="bg-[#0a0a0a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Select creator" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
                {campaignCreators?.map((creator) => (
                  <SelectItem
                    key={creator.creatorId}
                    value={creator.creatorId}
                    className="text-white"
                  >
                    {creator.creatorId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">
              Amount ($) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#0a0a0a] border-[#3a3a3a] text-white"
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-white">
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0a0a0a] border-[#3a3a3a] text-white"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#0a0a0a] border-[#3a3a3a] text-white"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#3a3a3a] text-white hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-white/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
