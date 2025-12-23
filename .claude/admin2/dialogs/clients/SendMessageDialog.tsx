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
import { Checkbox } from "@/components/ui/checkbox";
import { BriefEditor } from "@/components/admin2/forms/BriefEditor";
import {
  MessageSquare,
  Check,
  Paperclip,
  Send,
  Mail,
  Bell,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Client {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  avatar?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSend: (messageData: MessageData) => Promise<void>;
}

export interface MessageData {
  subject: string;
  message: string;
  attachments: Attachment[];
  sendEmail: boolean;
  sendNotification: boolean;
  markUrgent: boolean;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  client,
  onSend,
}: SendMessageDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [markUrgent, setMarkUrgent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!message.trim() || message === "<p></p>") {
      newErrors.message = "Message cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      await onSend({
        subject,
        message,
        attachments,
        sendEmail,
        sendNotification,
        markUrgent,
      });
      setSendSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setSendSuccess(false);
        // Reset form
        setSubject("");
        setMessage("");
        setAttachments([]);
        setSendEmail(true);
        setSendNotification(true);
        setMarkUrgent(false);
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddAttachment = () => {
    // Mock attachment for now
    const mockAttachment: Attachment = {
      id: Date.now().toString(),
      name: `document-${attachments.length + 1}.pdf`,
      size: 245678,
      type: "application/pdf",
    };
    setAttachments([...attachments, mockAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription className="mt-1">
                Send a message to {client.companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          {/* Recipient */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="bg-blue-500/20 text-blue-400">
                  {client.companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white/60">To:</span>
                  <span className="text-white font-medium">{client.companyName}</span>
                </div>
                <p className="text-white/60 text-sm">
                  {client.contactName} • {client.email}
                </p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white/80">
              Subject *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) {
                  setErrors({ ...errors, subject: "" });
                }
              }}
              placeholder="Enter message subject..."
              className={`bg-white/[0.02] border-white/[0.06] text-white ${
                errors.subject ? "border-red-500" : ""
              }`}
            />
            {errors.subject && (
              <p className="text-red-400 text-xs">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white/80">
              Message *
            </Label>
            <div
              className={`rounded-lg border ${
                errors.message ? "border-red-500" : "border-white/[0.06]"
              }`}
            >
              <BriefEditor
                content={message}
                onContentChange={(content) => {
                  setMessage(content);
                  if (errors.message) {
                    setErrors({ ...errors, message: "" });
                  }
                }}
                placeholder="Write your message here..."
              />
            </div>
            {errors.message && (
              <p className="text-red-400 text-xs">{errors.message}</p>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">Attachments (Optional)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAttachment}
                className="text-xs"
              >
                <Paperclip className="w-3 h-3 mr-2" />
                Add File
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <AnimatePresence>
                  {attachments.map((attachment, index) => (
                    <motion.div
                      key={attachment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {attachment.name}
                        </p>
                        <p className="text-white/60 text-xs">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label className="text-white/80">Delivery Options</Label>

            <div className="space-y-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setSendEmail(!sendEmail)}
              >
                <Checkbox
                  checked={sendEmail}
                  onCheckedChange={setSendEmail}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <p className="text-white text-sm font-medium">Send Email Copy</p>
                  </div>
                  <p className="text-white/60 text-xs">
                    Send this message to {client.email} via email
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setSendNotification(!sendNotification)}
              >
                <Checkbox
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <p className="text-white text-sm font-medium">
                      Send In-App Notification
                    </p>
                  </div>
                  <p className="text-white/60 text-xs">
                    Client will receive a notification in their dashboard
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setMarkUrgent(!markUrgent)}
              >
                <Checkbox
                  checked={markUrgent}
                  onCheckedChange={setMarkUrgent}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-red-400" />
                    <p className="text-white text-sm font-medium">Mark as Urgent</p>
                  </div>
                  <p className="text-white/60 text-xs">
                    Flag this message as high priority for immediate attention
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-blue-400 font-medium mb-1">Summary:</p>
                <ul className="text-white/80 space-y-1">
                  <li>• Message will be sent to {client.companyName}</li>
                  {sendEmail && <li>• Email copy will be sent to {client.email}</li>}
                  {sendNotification && <li>• In-app notification will be created</li>}
                  {attachments.length > 0 && (
                    <li>
                      • {attachments.length} attachment
                      {attachments.length !== 1 ? "s" : ""} will be included
                    </li>
                  )}
                  {markUrgent && <li>• Message will be marked as urgent</li>}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className={`${
              sendSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
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
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
