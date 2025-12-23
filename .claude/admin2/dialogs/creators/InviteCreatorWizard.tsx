"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { useToast } from "@/lib/hooks/use-toast";
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
import { DealTermsForm, type DealTerms } from "@/components/admin2/forms/DealTermsForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  ArrowRight,
  ArrowLeft,
  Check,
  Mail,
  User,
  Briefcase,
  Send,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWizard } from "@/lib/hooks/useWizard";

interface Campaign {
  _id: string;
  name: string;
  budget: number;
  status: string;
}

interface InviteCreatorWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Campaign[];
  onInviteComplete?: () => void;
}

const wizardSteps = [
  {
    id: "creator-info",
    title: "Creator Information",
    description: "Basic details about the creator",
  },
  {
    id: "campaigns",
    title: "Select Campaigns",
    description: "Assign the creator to campaigns",
  },
  {
    id: "deal-terms",
    title: "Deal Terms",
    description: "Set compensation and deliverables",
  },
  {
    id: "review",
    title: "Review & Send",
    description: "Review and send invitation",
  },
];

export function InviteCreatorWizard({
  open,
  onOpenChange,
  campaigns,
  onInviteComplete,
}: InviteCreatorWizardProps) {
  const { selectedOrganizationId } = useOrganization();
  const { toast } = useToast();
  const assignCreatorToCampaign = useMutation(api.campaignCreators.assignCreatorToCampaign);

  const wizard = useWizard(wizardSteps, {
    email: "",
    name: "",
    instagram: "",
    tiktok: "",
    selectedCampaigns: [],
    dealTerms: null,
    personalMessage: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleNext = async () => {
    // Validate current step
    if (wizard.currentStep === 0) {
      if (!wizard.data.email || !wizard.data.name) {
        return;
      }
    } else if (wizard.currentStep === 1) {
      if (wizard.data.selectedCampaigns.length === 0) {
        return;
      }
    } else if (wizard.currentStep === 2) {
      if (!wizard.data.dealTerms) {
        return;
      }
    }

    wizard.goToNext();
  };

  const handleSendInvitation = async () => {
    if (!selectedOrganizationId) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      // For each selected campaign, assign the creator
      // Note: In a full implementation, this would send an actual email invitation
      // For now, we'll directly create the campaign-creator associations
      for (const campaignId of wizard.data.selectedCampaigns) {
        await assignCreatorToCampaign({
          campaignId: campaignId as any,
          creatorId: wizard.data.email, // Using email as temporary ID
          dealAmount: wizard.data.dealTerms?.totalCompensation || 0,
          paymentType: "fixed",
        });
      }

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${wizard.data.name}`,
      });

      setSendSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSendSuccess(false);
        if (onInviteComplete) {
          onInviteComplete();
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const toggleCampaign = (campaignId: string) => {
    const current = wizard.data.selectedCampaigns || [];
    const updated = current.includes(campaignId)
      ? current.filter((id: string) => id !== campaignId)
      : [...current, campaignId];
    wizard.updateData({ selectedCampaigns: updated });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle>Invite Creator</DialogTitle>
              <DialogDescription className="mt-1">
                Step {wizard.currentStep + 1} of {wizardSteps.length}:{" "}
                {wizard.currentStepData.title}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {wizardSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg transition-all ${
                    index === wizard.currentStep
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : index < wizard.currentStep
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-white/[0.02] border border-white/[0.06]"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      index === wizard.currentStep
                        ? "bg-blue-500 text-white"
                        : index < wizard.currentStep
                        ? "bg-green-500 text-white"
                        : "bg-white/[0.05] text-white/40"
                    }`}
                  >
                    {index < wizard.currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden md:block ${
                      index === wizard.currentStep
                        ? "text-white"
                        : index < wizard.currentStep
                        ? "text-green-400"
                        : "text-white/40"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < wizardSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-white/20 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Creator Info */}
            {wizard.currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Creator Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={wizard.data.name}
                        onChange={(e) => wizard.updateData({ name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={wizard.data.email}
                        onChange={(e) => wizard.updateData({ email: e.target.value })}
                        placeholder="john@example.com"
                        className="bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-white/80">
                        Instagram Handle
                      </Label>
                      <Input
                        id="instagram"
                        value={wizard.data.instagram}
                        onChange={(e) => wizard.updateData({ instagram: e.target.value })}
                        placeholder="@johndoe"
                        className="bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="text-white/80">
                        TikTok Handle
                      </Label>
                      <Input
                        id="tiktok"
                        value={wizard.data.tiktok}
                        onChange={(e) => wizard.updateData({ tiktok: e.target.value })}
                        placeholder="@johndoe"
                        className="bg-white/[0.02] border-white/[0.06] text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Campaigns */}
            {wizard.currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Assign to Campaigns
                  </h3>
                </div>

                <div className="space-y-2">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      onClick={() => toggleCampaign(campaign._id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        wizard.data.selectedCampaigns?.includes(campaign._id)
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          wizard.data.selectedCampaigns?.includes(campaign._id)
                            ? "border-purple-500 bg-purple-500"
                            : "border-white/20"
                        }`}
                      >
                        {wizard.data.selectedCampaigns?.includes(campaign._id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{campaign.name}</p>
                        <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                          <span className="capitalize">{campaign.status}</span>
                          <span>•</span>
                          <span>${campaign.budget.toLocaleString()} budget</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-white/60 mt-4">
                  Selected {wizard.data.selectedCampaigns?.length || 0} of {campaigns.length} campaigns
                </p>
              </motion.div>
            )}

            {/* Step 3: Deal Terms */}
            {wizard.currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Deal Terms</h3>
                </div>

                <DealTermsForm
                  dealTerms={wizard.data.dealTerms}
                  onChange={(terms) => wizard.updateData({ dealTerms: terms })}
                />
              </motion.div>
            )}

            {/* Step 4: Review */}
            {wizard.currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Send className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Review & Send Invitation
                  </h3>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-3">
                      Creator Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Name:</span>
                        <span className="text-white">{wizard.data.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Email:</span>
                        <span className="text-white">{wizard.data.email}</span>
                      </div>
                      {wizard.data.instagram && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Instagram:</span>
                          <span className="text-white">{wizard.data.instagram}</span>
                        </div>
                      )}
                      {wizard.data.tiktok && (
                        <div className="flex justify-between">
                          <span className="text-white/60">TikTok:</span>
                          <span className="text-white">{wizard.data.tiktok}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <h4 className="text-sm font-medium text-white/80 mb-3">
                      Assigned Campaigns
                    </h4>
                    <div className="space-y-2">
                      {campaigns
                        .filter((c) => wizard.data.selectedCampaigns?.includes(c._id))
                        .map((campaign) => (
                          <div
                            key={campaign._id}
                            className="text-sm text-white flex items-center gap-2"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                            {campaign.name}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">
                      Personal Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={wizard.data.personalMessage}
                      onChange={(e) =>
                        wizard.updateData({ personalMessage: e.target.value })
                      }
                      placeholder="Add a personal message to include in the invitation email..."
                      className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-24"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>

          {!wizard.isFirstStep && (
            <Button
              variant="outline"
              onClick={wizard.goToPrevious}
              disabled={isSending}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          {!wizard.isLastStep ? (
            <Button
              onClick={handleNext}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSendInvitation}
              disabled={isSending}
              className={`${
                sendSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white`}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : sendSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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
