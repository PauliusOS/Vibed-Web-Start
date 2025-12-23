"use client";

import { useState } from "react";
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
import {
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/lib/hooks/use-toast";

interface APIKey {
  _id: string;
  name: string;
  key: string;
  description?: string;
  scope: string[];
  createdAt: number;
  lastUsed?: number;
  expiresAt?: number;
}

interface APIKeyManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: APIKey[];
  onCreate: (keyData: CreateKeyData) => Promise<{_id: string; key: string}>;
  onDelete: (keyId: string) => Promise<void>;
}

export interface CreateKeyData {
  name: string;
  description?: string;
  scope: string[];
  expiresIn?: number; // Days until expiration
}

const scopes = [
  { value: "campaigns.read", label: "Read Campaigns" },
  { value: "campaigns.write", label: "Write Campaigns" },
  { value: "creators.read", label: "Read Creators" },
  { value: "creators.write", label: "Write Creators" },
  { value: "videos.read", label: "Read Videos" },
  { value: "videos.write", label: "Write Videos" },
  { value: "analytics.read", label: "Read Analytics" },
  { value: "finance.read", label: "Read Finance" },
  { value: "finance.write", label: "Write Finance" },
];

export function APIKeyManagementDialog({
  open,
  onOpenChange,
  apiKeys,
  onCreate,
  onDelete,
}: APIKeyManagementDialogProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<"list" | "create">("list");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  const handleCreate = async () => {
    if (!name || selectedScopes.length === 0) {
      toast({
        title: "Error",
        description: "Name and at least one scope are required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const result = await onCreate({
        name,
        description,
        scope: selectedScopes,
        expiresIn: expiresIn === "never" ? undefined : parseInt(expiresIn),
      });

      setNewlyCreatedKey(result.key);
      setMode("list");
      setName("");
      setDescription("");
      setSelectedScopes([]);
      setExpiresIn("never");

      toast({
        title: "API Key Created",
        description: "Your new API key has been generated. Copy it now - it won't be shown again!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to delete "${keyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await onDelete(keyId);
      toast({
        title: "API Key Deleted",
        description: `"${keyName}" has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}${"*".repeat(24)}${key.substring(key.length - 4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <DialogTitle>API Keys</DialogTitle>
              <DialogDescription className="mt-1">
                {mode === "list"
                  ? "Manage API keys for programmatic access"
                  : "Create a new API key with specific permissions"}
              </DialogDescription>
            </div>
            {mode === "list" && (
              <Button
                onClick={() => setMode("create")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Key
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          <AnimatePresence mode="wait">
            {/* List View */}
            {mode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Newly Created Key Alert */}
                {newlyCreatedKey && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-400 font-medium mb-2">
                          Your API Key is Ready!
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-black/20 rounded text-white font-mono text-sm break-all">
                            {newlyCreatedKey}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              copyToClipboard(newlyCreatedKey, "new");
                              setNewlyCreatedKey(null);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-white/60 text-xs mt-2">
                          Make sure to copy this now. You won't be able to see it again!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {apiKeys.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No API keys yet</p>
                    <p className="text-sm mt-1">Create one to get started</p>
                  </div>
                ) : (
                  apiKeys.map((apiKey, index) => (
                    <motion.div
                      key={apiKey._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-white font-medium">{apiKey.name}</p>
                            <div className="px-2 py-0.5 rounded bg-blue-500/20">
                              <span className="text-xs text-blue-400">
                                {apiKey.scope.length} scopes
                              </span>
                            </div>
                          </div>

                          {apiKey.description && (
                            <p className="text-white/60 text-sm mb-2">
                              {apiKey.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <code className="flex-1 px-3 py-2 bg-black/20 rounded text-white/60 font-mono text-xs">
                              {showKey[apiKey._id]
                                ? apiKey.key
                                : maskKey(apiKey.key)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setShowKey({
                                  ...showKey,
                                  [apiKey._id]: !showKey[apiKey._id],
                                })
                              }
                            >
                              {showKey[apiKey._id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key, apiKey._id)}
                            >
                              {copiedKey === apiKey._id ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span>
                              Created:{" "}
                              {new Date(apiKey.createdAt).toLocaleDateString()}
                            </span>
                            {apiKey.lastUsed && (
                              <span>
                                Last used:{" "}
                                {new Date(apiKey.lastUsed).toLocaleDateString()}
                              </span>
                            )}
                            {apiKey.expiresAt && (
                              <span className="text-amber-400">
                                Expires:{" "}
                                {new Date(apiKey.expiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(apiKey._id, apiKey.name)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Create View */}
            {mode === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    Key Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="bg-white/[0.02] border-white/[0.06] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white/80">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this key used for?"
                    className="bg-white/[0.02] border-white/[0.06] text-white min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Scopes *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {scopes.map((scope) => (
                      <label
                        key={scope.value}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedScopes.includes(scope.value)
                            ? "border-blue-500/30 bg-blue-500/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope.value)}
                          onChange={() => toggleScope(scope.value)}
                          className="rounded border-white/[0.06]"
                        />
                        <span className="text-white/80 text-sm">{scope.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires" className="text-white/80">
                    Expiration
                  </Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-medium text-amber-400 mb-1">
                        Important Security Notes:
                      </p>
                      <ul className="space-y-1">
                        <li>• The API key will only be shown once upon creation</li>
                        <li>• Store it securely - never commit it to version control</li>
                        <li>• Rotate keys regularly for better security</li>
                        <li>• Delete unused keys immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          {mode === "create" ? (
            <>
              <Button
                variant="outline"
                onClick={() => setMode("list")}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !name || selectedScopes.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Create API Key
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
