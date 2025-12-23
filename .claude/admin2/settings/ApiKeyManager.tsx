"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsed: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  onCreateKey: (name: string) => Promise<string>;
  onRevokeKey: (keyId: string) => void;
}

export function ApiKeyManager({ apiKeys, onCreateKey, onRevokeKey }: ApiKeyManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    const key = await onCreateKey(newKeyName);
    setNewKeyValue(key);
    setShowCreateDialog(false);
    setShowNewKeyDialog(true);
    setNewKeyName("");
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(newKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeClick = (key: ApiKey) => {
    setKeyToRevoke(key);
    setShowRevokeDialog(true);
  };

  const handleConfirmRevoke = () => {
    if (keyToRevoke) {
      onRevokeKey(keyToRevoke.id);
      setShowRevokeDialog(false);
      setKeyToRevoke(null);
    }
  };

  return (
    <>
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">API Keys</h3>
              <p className="text-sm text-white/60">
                Manage API keys for programmatic access to your account
              </p>
            </div>
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Key
          </Button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{key.name}</p>
                      {key.expiresAt && new Date(key.expiresAt) < new Date() && (
                        <Badge
                          variant="outline"
                          className="bg-red-500/20 text-red-400 border-red-500/30"
                        >
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/60 font-mono mt-1">{key.prefix}•••••••••</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {formatDate(key.createdAt)}
                      </span>
                      {key.lastUsed && (
                        <span>Last used {formatDate(key.lastUsed)}</span>
                      )}
                      {!key.lastUsed && <span>Never used</span>}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4 text-white/60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-300 focus:text-red-300"
                      onClick={() => handleRevokeClick(key)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {apiKeys.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No API keys created</p>
            <p className="text-sm mt-1">Create an API key to integrate with external services</p>
          </div>
        )}

        <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-400 font-medium">Security Notice</p>
              <p className="text-xs text-white/60 mt-1">
                API keys provide full access to your account. Keep them secure and never share them
                publicly. Rotate keys regularly and revoke any that may have been compromised.
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Create Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Create API Key
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Give your API key a descriptive name to help you identify it later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Key Name</Label>
              <Input
                placeholder="e.g., Production Server"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCreateDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleCreateKey}
              disabled={!newKeyName.trim()}
            >
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Created Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              API Key Created
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Copy your API key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-400">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Your API Key</Label>
              <div className="flex items-center gap-2">
                <Input
                  type={showKeyValue ? "text" : "password"}
                  value={newKeyValue}
                  readOnly
                  className="bg-white/5 border-white/10 text-white font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeyValue(!showKeyValue)}
                  className="text-white/60"
                >
                  {showKeyValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyKey}
                  className={copied ? "text-emerald-400" : "text-white/60"}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                setShowNewKeyDialog(false);
                setNewKeyValue("");
                setShowKeyValue(false);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Key Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent className="bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Revoke API Key?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will permanently revoke the API key "{keyToRevoke?.name}". Any applications using
              this key will no longer be able to access your account.
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
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
