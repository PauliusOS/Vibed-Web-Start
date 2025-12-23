"use client";

import { useState } from "react";
import { useAction } from "convex/react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Copy, CheckCircle2, AlertTriangle, User } from "lucide-react";

interface CreateTestAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorId: string;
  creatorName: string;
  organizationId: Id<"organizations">;
  onSuccess?: () => void;
}

export function CreateTestAccountDialog({
  open,
  onOpenChange,
  creatorId,
  creatorName,
  organizationId,
  onSuccess,
}: CreateTestAccountDialogProps) {
  const [emailPrefix, setEmailPrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const createTestAccount = useAction(api.testAccounts.createTestAccount);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const result = await createTestAccount({
        creatorId,
        organizationId,
        emailPrefix: emailPrefix || undefined,
      });

      if (result.success && result.email && result.password) {
        setCredentials({
          email: result.email,
          password: result.password,
        });
      } else {
        alert(result.error || "Failed to generate test account");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleClose = () => {
    setCredentials(null);
    setEmailPrefix("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            Create Test Account
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Generate demo credentials for {creatorName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!credentials ? (
            <>
              {/* Info Alert */}
              <Alert className="bg-cyan-500/10 border-cyan-500/30">
                <AlertTriangle className="h-4 w-4 text-cyan-400" />
                <AlertDescription className="text-cyan-300 text-sm">
                  This creates a test account with demo credentials. The creator can use
                  these to test the platform without a real signup.
                </AlertDescription>
              </Alert>

              {/* Email Prefix Input */}
              <div className="space-y-2">
                <Label htmlFor="email-prefix" className="text-white/70">
                  Email Prefix (Optional)
                </Label>
                <Input
                  id="email-prefix"
                  placeholder={creatorName || "username"}
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  disabled={isGenerating}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <p className="text-xs text-white/50">
                  Will generate: {emailPrefix || creatorName}+test123@sylcroad.com
                </p>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Generate Test Account
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-green-400 mb-1">
                    Test Account Generated
                  </h4>
                  <p className="text-xs text-green-300">
                    Use these credentials to sign in and test the creator experience
                  </p>
                </div>
              </div>

              {/* Credentials Display */}
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={credentials.email}
                      readOnly
                      className="flex-1 bg-white/5 border-white/10 text-white font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(credentials.email, "email")}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      {copiedField === "email" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Password</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={credentials.password}
                      readOnly
                      className="flex-1 bg-white/5 border-white/10 text-white font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(credentials.password, "password")}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      {copiedField === "password" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300 text-sm">
                  <strong>Important:</strong> Save these credentials now. They won't be
                  shown again. The creator must sign up manually using these credentials.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-white/10 text-white hover:bg-white/5"
          >
            {credentials ? "Done" : "Cancel"}
          </Button>
          {credentials && (
            <Button
              onClick={() => {
                handleCopy(
                  `Email: ${credentials.email}\nPassword: ${credentials.password}`,
                  "all"
                );
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {copiedField === "all" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Both
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
