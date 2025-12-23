"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield,
  Smartphone,
  Key,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Copy,
} from "lucide-react";

interface TwoFactorSectionProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export function TwoFactorSection({ isEnabled, onEnable, onDisable }: TwoFactorSectionProps) {
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState<"qr" | "verify">("qr");

  // Mock backup codes
  const backupCodes = [
    "XXXX-XXXX-1234",
    "XXXX-XXXX-5678",
    "XXXX-XXXX-9012",
    "XXXX-XXXX-3456",
    "XXXX-XXXX-7890",
    "XXXX-XXXX-2345",
  ];

  const handleEnableClick = () => {
    setShowSetupDialog(true);
    setSetupStep("qr");
    setVerificationCode("");
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      onEnable();
      setShowSetupDialog(false);
    }
  };

  const handleDisable = () => {
    onDisable();
    setShowDisableDialog(false);
  };

  return (
    <>
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-white/60">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              isEnabled
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }
          >
            {isEnabled ? "Enabled" : "Not Enabled"}
          </Badge>
        </div>

        {isEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-medium">2FA is active</p>
                <p className="text-sm text-white/60">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">Authenticator App</span>
                </div>
                <p className="text-white font-medium">Connected</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">Backup Codes</span>
                </div>
                <p className="text-white font-medium">6 remaining</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-white/70 border-white/20">
                View Backup Codes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                onClick={() => setShowDisableDialog(true)}
              >
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-white font-medium">2FA not enabled</p>
                <p className="text-sm text-white/60">
                  Enable two-factor authentication to secure your account
                </p>
              </div>
            </div>

            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black"
              onClick={handleEnableClick}
            >
              <Shield className="w-4 h-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}
      </GlassPanel>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="bg-gray-900 border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Setup Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {setupStep === "qr"
                ? "Scan the QR code with your authenticator app"
                : "Enter the verification code from your app"}
            </DialogDescription>
          </DialogHeader>

          {setupStep === "qr" ? (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Manual entry code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value="JBSWY3DPEHPK3PXP"
                    readOnly
                    className="bg-white/5 border-white/10 text-white font-mono"
                  />
                  <Button variant="ghost" size="icon" className="text-white/60">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => setSetupStep("verify")}
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Verification Code</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="bg-white/5 border-white/10 text-white text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
              >
                Verify and Enable
              </Button>

              <Button
                variant="ghost"
                className="w-full text-white/60"
                onClick={() => setSetupStep("qr")}
              >
                Back to QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Disable Two-Factor Authentication?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will make your account less secure. You'll only need your password to sign in.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDisableDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
            >
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
