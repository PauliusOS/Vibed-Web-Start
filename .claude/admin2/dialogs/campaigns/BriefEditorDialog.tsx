"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Loader2,
  FileText,
  Link as LinkIcon,
  Hash,
  AtSign,
  CheckCircle,
  XCircle,
  Upload,
  File,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BriefEditorDialogProps {
  scheduledPostId: Id<"scheduledPosts">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReferenceType =
  | "example_video"
  | "brand_guidelines"
  | "product_page"
  | "inspiration"
  | "other";

interface ReferenceLink {
  title: string;
  url: string;
  type: ReferenceType;
}

export function BriefEditorDialog({
  scheduledPostId,
  open,
  onOpenChange,
}: BriefEditorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyMessages, setKeyMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [dosList, setDosList] = useState<string[]>([]);
  const [newDo, setNewDo] = useState("");
  const [dontsList, setDontsList] = useState<string[]>([]);
  const [newDont, setNewDont] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [newMention, setNewMention] = useState("");
  const [referenceLinks, setReferenceLinks] = useState<ReferenceLink[]>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "", type: "other" as ReferenceType });
  const [platformNotes, setPlatformNotes] = useState({
    instagram: "",
    tiktok: "",
  });

  // Query existing brief
  const existingBrief = useQuery(api.scheduledPostBriefs.getBriefForPost, {
    scheduledPostId,
  });

  const createBrief = useMutation(api.scheduledPostBriefs.createBrief);
  const updateBrief = useMutation(api.scheduledPostBriefs.updateBrief);

  // Load existing brief data
  useEffect(() => {
    if (existingBrief) {
      setTitle(existingBrief.title);
      setDescription(existingBrief.description);
      setKeyMessages(existingBrief.keyMessages);
      setDosList(existingBrief.dosList);
      setDontsList(existingBrief.dontsList);
      setHashtags(existingBrief.hashtags);
      setMentions(existingBrief.mentions);
      setReferenceLinks(existingBrief.referenceLinks);
      setPlatformNotes({
        instagram: existingBrief.platformNotes?.instagram || "",
        tiktok: existingBrief.platformNotes?.tiktok || "",
      });
    }
  }, [existingBrief]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    setIsLoading(true);
    try {
      if (existingBrief) {
        await updateBrief({
          briefId: existingBrief._id,
          title,
          description,
          keyMessages,
          dosList,
          dontsList,
          hashtags,
          mentions,
          referenceLinks,
          platformNotes,
        });
        toast.success("Brief updated");
      } else {
        await createBrief({
          scheduledPostId,
          title,
          description,
          keyMessages,
          dosList,
          dontsList,
          hashtags,
          mentions,
          referenceLinks,
          attachments: [],
          platformNotes,
        });
        toast.success("Brief created");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save brief");
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (
    list: string[],
    setList: (items: string[]) => void,
    value: string,
    setValue: (v: string) => void
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue("");
    }
  };

  const removeItem = (
    list: string[],
    setList: (items: string[]) => void,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const addReferenceLink = () => {
    if (newLink.title && newLink.url) {
      setReferenceLinks([...referenceLinks, newLink]);
      setNewLink({ title: "", url: "", type: "other" });
    }
  };

  const removeReferenceLink = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {existingBrief ? "Edit Brief" : "Create Brief"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="bg-white/5 border-b border-white/10 rounded-none p-0 h-auto">
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-2 text-[12px]"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="guidelines"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-2 text-[12px]"
            >
              Guidelines
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-2 text-[12px]"
            >
              Social
            </TabsTrigger>
            <TabsTrigger
              value="references"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/50 data-[state=active]:text-white px-4 py-2 text-[12px]"
            >
              References
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label className="text-[12px] text-white/60">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Holiday Product Feature"
                  className="border-white/10 bg-transparent text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] text-white/60">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed content description..."
                  className="border-white/10 bg-transparent text-white min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] text-white/60">Key Messages</Label>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addItem(keyMessages, setKeyMessages, newMessage, setNewMessage)
                    }
                    placeholder="Add a key message"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      addItem(keyMessages, setKeyMessages, newMessage, setNewMessage)
                    }
                    className="border-white/10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {keyMessages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keyMessages.map((msg, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-white/5 text-white/70 pr-1"
                      >
                        {msg}
                        <button
                          onClick={() => removeItem(keyMessages, setKeyMessages, i)}
                          className="ml-1 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Notes */}
              <div className="space-y-3">
                <Label className="text-[12px] text-white/60">
                  Platform-Specific Notes
                </Label>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-white/40">Instagram</Label>
                    <Textarea
                      value={platformNotes.instagram}
                      onChange={(e) =>
                        setPlatformNotes({ ...platformNotes, instagram: e.target.value })
                      }
                      placeholder="Instagram-specific instructions..."
                      className="border-white/10 bg-transparent text-white min-h-[60px] text-[13px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-white/40">TikTok</Label>
                    <Textarea
                      value={platformNotes.tiktok}
                      onChange={(e) =>
                        setPlatformNotes({ ...platformNotes, tiktok: e.target.value })
                      }
                      placeholder="TikTok-specific instructions..."
                      className="border-white/10 bg-transparent text-white min-h-[60px] text-[13px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6 mt-0">
              {/* Do's */}
              <div className="space-y-2">
                <Label className="text-[12px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Do&apos;s
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newDo}
                    onChange={(e) => setNewDo(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && addItem(dosList, setDosList, newDo, setNewDo)
                    }
                    placeholder="Add a do"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addItem(dosList, setDosList, newDo, setNewDo)}
                    className="border-white/10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {dosList.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {dosList.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[13px] text-white/70 bg-emerald-500/10 px-3 py-1.5 rounded"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="flex-1">{item}</span>
                        <button
                          onClick={() => removeItem(dosList, setDosList, i)}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Don'ts */}
              <div className="space-y-2">
                <Label className="text-[12px] text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Don&apos;ts
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newDont}
                    onChange={(e) => setNewDont(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addItem(dontsList, setDontsList, newDont, setNewDont)
                    }
                    placeholder="Add a don't"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addItem(dontsList, setDontsList, newDont, setNewDont)}
                    className="border-white/10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {dontsList.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {dontsList.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[13px] text-white/70 bg-red-500/10 px-3 py-1.5 rounded"
                      >
                        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="flex-1">{item}</span>
                        <button
                          onClick={() => removeItem(dontsList, setDontsList, i)}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-6 mt-0">
              {/* Hashtags */}
              <div className="space-y-2">
                <Label className="text-[12px] text-white/60 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Hashtags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value.replace("#", ""))}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addItem(hashtags, setHashtags, newHashtag, setNewHashtag)
                    }
                    placeholder="Add hashtag (without #)"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      addItem(hashtags, setHashtags, newHashtag, setNewHashtag)
                    }
                    className="border-white/10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hashtags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-400 pr-1"
                      >
                        #{tag}
                        <button
                          onClick={() => removeItem(hashtags, setHashtags, i)}
                          className="ml-1 hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Mentions */}
              <div className="space-y-2">
                <Label className="text-[12px] text-white/60 flex items-center gap-1">
                  <AtSign className="w-3 h-3" />
                  Mentions
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newMention}
                    onChange={(e) => setNewMention(e.target.value.replace("@", ""))}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      addItem(mentions, setMentions, newMention, setNewMention)
                    }
                    placeholder="Add account to mention (without @)"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      addItem(mentions, setMentions, newMention, setNewMention)
                    }
                    className="border-white/10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {mentions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentions.map((mention, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-purple-500/10 text-purple-400 pr-1"
                      >
                        @{mention}
                        <button
                          onClick={() => removeItem(mentions, setMentions, i)}
                          className="ml-1 hover:text-purple-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* References Tab */}
            <TabsContent value="references" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label className="text-[12px] text-white/60 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Reference Links
                </Label>
                <div className="grid gap-2">
                  <Input
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Link title"
                    className="border-white/10 bg-transparent text-white"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="URL"
                      className="border-white/10 bg-transparent text-white flex-1"
                    />
                    <select
                      value={newLink.type}
                      onChange={(e) =>
                        setNewLink({ ...newLink, type: e.target.value as ReferenceType })
                      }
                      className="bg-transparent border border-white/10 rounded-md px-2 text-[12px] text-white/70"
                    >
                      <option value="example_video">Example Video</option>
                      <option value="brand_guidelines">Brand Guidelines</option>
                      <option value="product_page">Product Page</option>
                      <option value="inspiration">Inspiration</option>
                      <option value="other">Other</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addReferenceLink}
                      className="border-white/10 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {referenceLinks.length > 0 && (
                  <ul className="space-y-2 mt-3">
                    {referenceLinks.map((link, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[13px] bg-white/5 px-3 py-2 rounded border border-white/5"
                      >
                        <LinkIcon className="w-3 h-3 text-white/40 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 truncate">{link.title}</p>
                          <p className="text-[11px] text-white/40 truncate">{link.url}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-white/10">
                          {link.type.replace("_", " ")}
                        </Badge>
                        <button
                          onClick={() => removeReferenceLink(i)}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {existingBrief ? "Update Brief" : "Create Brief"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
