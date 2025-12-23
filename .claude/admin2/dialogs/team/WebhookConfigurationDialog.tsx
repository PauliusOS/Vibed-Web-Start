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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Webhook,
  Plus,
  Trash2,
  Check,
  Link,
  AlertCircle,
  Activity,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/lib/hooks/use-toast";

interface WebhookConfig {
  _id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  createdAt: number;
  lastTriggered?: number;
  successCount: number;
  failureCount: number;
}

interface WebhookConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhooks: WebhookConfig[];
  onCreate: (webhookData: CreateWebhookData) => Promise<void>;
  onUpdate: (webhookId: string, data: Partial<CreateWebhookData>) => Promise<void>;
  onDelete: (webhookId: string) => Promise<void>;
  onTest: (webhookId: string) => Promise<boolean>;
}

export interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
}

const availableEvents = [
  { value: "campaign.created", label: "Campaign Created", group: "Campaigns" },
  { value: "campaign.updated", label: "Campaign Updated", group: "Campaigns" },
  { value: "campaign.deleted", label: "Campaign Deleted", group: "Campaigns" },
  { value: "video.uploaded", label: "Video Uploaded", group: "Videos" },
  { value: "video.approved", label: "Video Approved", group: "Videos" },
  { value: "video.rejected", label: "Video Rejected", group: "Videos" },
  { value: "creator.invited", label: "Creator Invited", group: "Creators" },
  { value: "creator.joined", label: "Creator Joined", group: "Creators" },
  { value: "payment.processed", label: "Payment Processed", group: "Finance" },
  { value: "withdrawal.approved", label: "Withdrawal Approved", group: "Finance" },
];

const groupedEvents = availableEvents.reduce((groups, event) => {
  if (!groups[event.group]) {
    groups[event.group] = [];
  }
  groups[event.group].push(event);
  return groups;
}, {} as Record<string, typeof availableEvents>);

export function WebhookConfigurationDialog({
  open,
  onOpenChange,
  webhooks,
  onCreate,
  onUpdate,
  onDelete,
  onTest,
}: WebhookConfigurationDialogProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [secret, setSecret] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const selectAllEvents = () => {
    setSelectedEvents(availableEvents.map((e) => e.value));
  };

  const clearAllEvents = () => {
    setSelectedEvents([]);
  };

  const resetForm = () => {
    setName("");
    setUrl("");
    setSelectedEvents([]);
    setSecret("");
    setIsActive(true);
    setEditingWebhook(null);
  };

  const startCreate = () => {
    resetForm();
    setMode("create");
  };

  const startEdit = (webhook: WebhookConfig) => {
    setName(webhook.name);
    setUrl(webhook.url);
    setSelectedEvents(webhook.events);
    setSecret(webhook.secret || "");
    setIsActive(webhook.isActive);
    setEditingWebhook(webhook);
    setMode("edit");
  };

  const handleSave = async () => {
    if (!name || !url || selectedEvents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Name, URL, and at least one event are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const webhookData = {
        name,
        url,
        events: selectedEvents,
        secret: secret || undefined,
        isActive,
      };

      if (mode === "edit" && editingWebhook) {
        await onUpdate(editingWebhook._id, webhookData);
        toast({
          title: "Webhook Updated",
          description: `"${name}" has been updated successfully.`,
        });
      } else {
        await onCreate(webhookData);
        toast({
          title: "Webhook Created",
          description: `"${name}" has been created successfully.`,
        });
      }

      setMode("list");
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save webhook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (webhookId: string, webhookName: string) => {
    if (!confirm(`Are you sure you want to delete "${webhookName}"?`)) {
      return;
    }

    try {
      await onDelete(webhookId);
      toast({
        title: "Webhook Deleted",
        description: `"${webhookName}" has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTest = async (webhookId: string, webhookName: string) => {
    setTestingWebhook(webhookId);

    try {
      const success = await onTest(webhookId);
      if (success) {
        toast({
          title: "Test Successful",
          description: `Test event sent to "${webhookName}" successfully.`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: `Failed to send test event to "${webhookName}".`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test webhook.",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Webhook className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <DialogTitle>Webhooks</DialogTitle>
              <DialogDescription className="mt-1">
                {mode === "list"
                  ? "Manage webhook endpoints for real-time event notifications"
                  : mode === "edit"
                  ? `Editing "${editingWebhook?.name}"`
                  : "Create a new webhook endpoint"}
              </DialogDescription>
            </div>
            {mode === "list" && (
              <Button
                onClick={startCreate}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Webhook
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
                {webhooks.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Webhook className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No webhooks configured</p>
                    <p className="text-sm mt-1">Create one to receive event notifications</p>
                  </div>
                ) : (
                  webhooks.map((webhook, index) => (
                    <motion.div
                      key={webhook._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-white font-medium">{webhook.name}</p>
                            <div
                              className={`px-2 py-0.5 rounded ${
                                webhook.isActive
                                  ? "bg-green-500/20"
                                  : "bg-white/[0.06]"
                              }`}
                            >
                              <span
                                className={`text-xs ${
                                  webhook.isActive
                                    ? "text-green-400"
                                    : "text-white/60"
                                }`}
                              >
                                {webhook.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Link className="w-3 h-3 text-blue-400" />
                            <code className="text-xs text-white/60 break-all">
                              {webhook.url}
                            </code>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {webhook.events.slice(0, 3).map((event) => (
                              <div
                                key={event}
                                className="px-2 py-0.5 rounded bg-purple-500/20"
                              >
                                <span className="text-xs text-purple-400">
                                  {event}
                                </span>
                              </div>
                            ))}
                            {webhook.events.length > 3 && (
                              <div className="px-2 py-0.5 rounded bg-white/[0.06]">
                                <span className="text-xs text-white/60">
                                  +{webhook.events.length - 3} more
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-green-400" />
                              <span>{webhook.successCount} successful</span>
                            </div>
                            {webhook.failureCount > 0 && (
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3 text-red-400" />
                                <span>{webhook.failureCount} failed</span>
                              </div>
                            )}
                            {webhook.lastTriggered && (
                              <span>
                                Last triggered:{" "}
                                {new Date(webhook.lastTriggered).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(webhook._id, webhook.name)}
                            disabled={testingWebhook === webhook._id}
                          >
                            {testingWebhook === webhook._id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Activity className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(webhook)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(webhook._id, webhook.name)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Create/Edit Form */}
            {(mode === "create" || mode === "edit") && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    Webhook Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Production Notifications"
                    className="bg-white/[0.02] border-white/[0.06] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-white/80">
                    Endpoint URL *
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/webhooks"
                    className="bg-white/[0.02] border-white/[0.06] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/80">Events to Subscribe *</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAllEvents}
                        className="text-xs h-7"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllEvents}
                        className="text-xs h-7"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {Object.entries(groupedEvents).map(([group, events]) => (
                    <div
                      key={group}
                      className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <p className="text-white font-medium text-sm mb-2">{group}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {events.map((event) => (
                          <label
                            key={event.value}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                              selectedEvents.includes(event.value)
                                ? "bg-purple-500/20"
                                : "hover:bg-white/[0.02]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.value)}
                              onChange={() => toggleEvent(event.value)}
                              className="rounded border-white/[0.06]"
                            />
                            <span className="text-white/80 text-xs">{event.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret" className="text-white/80">
                    Webhook Secret (Optional)
                  </Label>
                  <Input
                    id="secret"
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="For request signature verification"
                    className="bg-white/[0.02] border-white/[0.06] text-white"
                  />
                  <p className="text-xs text-white/40">
                    Used to sign webhook requests for verification
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div>
                    <Label htmlFor="active" className="text-white/80">
                      Active
                    </Label>
                    <p className="text-xs text-white/60 mt-1">
                      Enable this webhook to receive events
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-medium text-blue-400 mb-1">
                        Webhook Delivery Notes:
                      </p>
                      <ul className="space-y-1">
                        <li>• Events are delivered in real-time as they occur</li>
                        <li>• Failed deliveries will be retried up to 3 times</li>
                        <li>• Your endpoint must respond with a 2xx status code</li>
                        <li>• Signature verification is recommended for security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          {mode !== "list" ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setMode("list");
                  resetForm();
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !name || !url || selectedEvents.length === 0}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {mode === "edit" ? "Update" : "Create"} Webhook
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
