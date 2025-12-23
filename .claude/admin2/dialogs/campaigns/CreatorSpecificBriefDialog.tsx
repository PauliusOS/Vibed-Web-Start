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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BriefEditor } from "@/components/admin2/forms/BriefEditor";
import {
  User,
  FileText,
  Paperclip,
  Send,
  Save,
  Copy,
  Mail,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
}

interface CreatorSpecificBriefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creator: Creator;
  campaignName: string;
  campaignBrief?: string;
  onSave: (data: {
    title: string;
    content: string;
    attachments: Attachment[];
    sendEmail: boolean;
  }) => Promise<void>;
}

export function CreatorSpecificBriefDialog({
  open,
  onOpenChange,
  creator,
  campaignName,
  campaignBrief,
  onSave,
}: CreatorSpecificBriefDialogProps) {
  const [title, setTitle] = useState(`Brief for ${creator.name}`);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyCampaignBrief = () => {
    if (campaignBrief) {
      setContent(campaignBrief);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file), // In real app, upload to storage first
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSave = async (asDraft: boolean) => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave({
        title,
        content,
        attachments,
        sendEmail: asDraft ? false : sendEmail,
      });
      setSaveSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSaveSuccess(false);
        // Reset form
        setTitle(`Brief for ${creator.name}`);
        setContent("");
        setAttachments([]);
        setSendEmail(true);
      }, 1000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Creator-Specific Brief</DialogTitle>
          <DialogDescription>
            Create a customized brief for {creator.name} in {campaignName}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Creator Info */}
          <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="bg-blue-500/20 text-blue-400">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-white/60" />
                <h4 className="text-sm font-medium text-white">
                  {creator.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-white/40" />
                <p className="text-xs text-white/60">{creator.email}</p>
              </div>
            </div>

            {campaignBrief && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCampaignBrief}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Campaign Brief
              </Button>
            )}
          </div>

          {/* Brief Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80">
              Brief Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Launch Brief for Sarah"
              className="bg-white/[0.02] border-white/[0.06] text-white"
            />
          </div>

          {/* Brief Content */}
          <div className="space-y-2">
            <Label className="text-white/80">Brief Content</Label>
            <BriefEditor
              content={content}
              onContentChange={setContent}
              placeholder="Write the detailed brief for this creator..."
            />
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">Attachments</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Add Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <motion.div
                    key={attachment.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 rounded hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Email Option */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <input
              type="checkbox"
              id="send-email"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="mt-1 rounded"
            />
            <div className="flex-1">
              <label
                htmlFor="send-email"
                className="text-sm text-white cursor-pointer font-medium block mb-1"
              >
                Send email notification
              </label>
              <p className="text-xs text-white/60">
                Creator will receive an email with this brief when you save
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={isSaving || !title.trim() || !content.trim()}
            className={`${
              saveSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Brief
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
