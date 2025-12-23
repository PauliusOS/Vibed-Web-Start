"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  LogOut,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface Session {
  id: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: Date;
  isCurrent: boolean;
}

interface SessionManagementProps {
  sessions: Session[];
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllOtherSessions: () => void;
}

export function SessionManagement({
  sessions,
  onRevokeSession,
  onRevokeAllOtherSessions,
}: SessionManagementProps) {
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const handleRevokeClick = (session: Session) => {
    setSessionToRevoke(session);
    setShowRevokeDialog(true);
  };

  const handleConfirmRevoke = () => {
    if (sessionToRevoke) {
      onRevokeSession(sessionToRevoke.id);
      setShowRevokeDialog(false);
      setSessionToRevoke(null);
    }
  };

  const handleRevokeAll = () => {
    onRevokeAllOtherSessions();
    setShowRevokeAllDialog(false);
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <>
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
              <p className="text-sm text-white/60">
                Manage devices and sessions signed in to your account
              </p>
            </div>
          </div>
          {otherSessions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              onClick={() => setShowRevokeAllDialog(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out All Others
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <div
                key={session.id}
                className={`p-4 rounded-lg border transition-colors ${
                  session.isCurrent
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.isCurrent ? "bg-emerald-500/20" : "bg-white/10"
                      }`}
                    >
                      <DeviceIcon
                        className={`w-5 h-5 ${
                          session.isCurrent ? "text-emerald-400" : "text-white/60"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">
                          {session.browser} on {session.os}
                        </p>
                        {session.isCurrent && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastActive(session.lastActive)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">IP: {session.ip}</p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-red-400"
                      onClick={() => handleRevokeClick(session)}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No active sessions found</p>
          </div>
        )}
      </GlassPanel>

      {/* Revoke Single Session Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Sign Out Device?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will sign out the device "{sessionToRevoke?.browser} on {sessionToRevoke?.os}"
              from your account. They will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowRevokeDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRevoke}>
              Sign Out Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke All Sessions Dialog */}
      <Dialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Sign Out All Other Devices?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will sign out all {otherSessions.length} other devices from your account. Only
              your current session will remain active.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowRevokeAllDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAll}>
              Sign Out All Others
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
