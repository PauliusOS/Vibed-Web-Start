"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  CheckCircle,
  XCircle,
  Hash,
  AtSign,
  Link as LinkIcon,
  Paperclip,
  Loader2,
} from "lucide-react";

interface BriefViewerProps {
  scheduledPostId: Id<"scheduledPosts">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BriefViewer({
  scheduledPostId,
  open,
  onOpenChange,
}: BriefViewerProps) {
  const brief = useQuery(api.scheduledPostBriefs.getBriefForPost, {
    scheduledPostId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Content Brief
          </DialogTitle>
        </DialogHeader>

        {!brief ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-white">{brief.title}</h2>
              {brief.description && (
                <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
                  {brief.description}
                </p>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Key Messages */}
            {brief.keyMessages && brief.keyMessages.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3">
                  Key Messages
                </h3>
                <ul className="space-y-2">
                  {brief.keyMessages.map((message, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] text-white/80"
                    >
                      <span className="text-white/40 mt-0.5">•</span>
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-2 gap-4">
              {/* Dos */}
              {brief.dosList && brief.dosList.length > 0 && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <h3 className="text-[12px] uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Do
                  </h3>
                  <ul className="space-y-2">
                    {brief.dosList.map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-white/70 flex items-start gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Don'ts */}
              {brief.dontsList && brief.dontsList.length > 0 && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <h3 className="text-[12px] uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Don't
                  </h3>
                  <ul className="space-y-2">
                    {brief.dontsList.map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-white/70 flex items-start gap-2"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Hashtags & Mentions */}
            {((brief.hashtags && brief.hashtags.length > 0) ||
              (brief.mentions && brief.mentions.length > 0)) && (
              <div className="grid grid-cols-2 gap-4">
                {/* Hashtags */}
                {brief.hashtags && brief.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Hashtags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {brief.hashtags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-white/10 text-white/60 text-[12px]"
                        >
                          #{tag.replace("#", "")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentions */}
                {brief.mentions && brief.mentions.length > 0 && (
                  <div>
                    <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                      <AtSign className="w-4 h-4" />
                      Mentions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {brief.mentions.map((mention, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-white/10 text-white/60 text-[12px]"
                        >
                          @{mention.replace("@", "")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Platform Notes */}
            {brief.platformNotes &&
              (brief.platformNotes.instagram || brief.platformNotes.tiktok) && (
                <div>
                  <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3">
                    Platform-Specific Notes
                  </h3>
                  <div className="space-y-3">
                    {brief.platformNotes.instagram && (
                      <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[12px] font-medium text-pink-400">
                            Instagram
                          </span>
                        </div>
                        <p className="text-[13px] text-white/70">
                          {brief.platformNotes.instagram}
                        </p>
                      </div>
                    )}
                    {brief.platformNotes.tiktok && (
                      <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[12px] font-medium text-cyan-400">
                            TikTok
                          </span>
                        </div>
                        <p className="text-[13px] text-white/70">
                          {brief.platformNotes.tiktok}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Reference Links */}
            {brief.referenceLinks && brief.referenceLinks.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Reference Links
                </h3>
                <div className="space-y-2">
                  {brief.referenceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.05] transition-colors group"
                    >
                      <LinkIcon className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white/80 truncate">
                          {link.title}
                        </p>
                        <p className="text-[11px] text-white/40 truncate">
                          {link.url}
                        </p>
                      </div>
                      {link.type && (
                        <Badge
                          variant="outline"
                          className="border-white/10 text-white/50 text-[10px] shrink-0"
                        >
                          {link.type}
                        </Badge>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {brief.attachments && brief.attachments.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                </h3>
                <div className="space-y-2">
                  {brief.attachments.map((attachment, i) => (
                    <a
                      key={i}
                      href={attachment.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-white/40" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white/80 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {attachment.fileType} •{" "}
                          {(attachment.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
