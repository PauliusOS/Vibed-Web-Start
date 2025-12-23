"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Paperclip,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface BriefEditorProps {
  content?: string;
  onContentChange?: (content: string) => void;
  attachments?: Attachment[];
  onAttachmentsChange?: (attachments: Attachment[]) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function BriefEditor({
  content = "",
  onContentChange,
  attachments = [],
  onAttachmentsChange,
  placeholder = "Start writing your brief...",
  editable = true,
  className = "",
}: BriefEditorProps) {
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(attachments);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline hover:text-blue-300 cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] focus:outline-none px-4 py-3 text-white/90",
      },
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const updated = [...localAttachments, ...newAttachments];
    setLocalAttachments(updated);
    if (onAttachmentsChange) {
      onAttachmentsChange(updated);
    }
  };

  const removeAttachment = (id: string) => {
    const updated = localAttachments.filter((a) => a.id !== id);
    setLocalAttachments(updated);
    if (onAttachmentsChange) {
      onAttachmentsChange(updated);
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (!editor) {
    return <div className="text-white/60">Loading editor...</div>;
  }

  return (
    <div className={`${className} bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden`}>
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/[0.06] bg-white/[0.02]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-white/[0.1]" : ""}`}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-white/[0.1]" : ""}`}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/[0.1] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 1 }) ? "bg-white/[0.1]" : ""}`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 2 }) ? "bg-white/[0.1]" : ""}`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 3 }) ? "bg-white/[0.1]" : ""}`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/[0.1] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-white/[0.1]" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-white/[0.1]" : ""}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/[0.1] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-white/[0.1]" : ""}`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("codeBlock") ? "bg-white/[0.1]" : ""}`}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("blockquote") ? "bg-white/[0.1]" : ""}`}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/[0.1] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 w-8 p-0"
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 w-8 p-0"
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <div className="flex-1" />

          <label htmlFor="file-upload" className="cursor-pointer">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              asChild
            >
              <div>
                <Paperclip className="h-4 w-4" />
                <span className="text-sm">Attach</span>
              </div>
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      <EditorContent editor={editor} />

      {localAttachments.length > 0 && (
        <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="text-sm text-white/60 mb-2">Attachments ({localAttachments.length})</div>
          <div className="space-y-2">
            <AnimatePresence>
              {localAttachments.map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-2 rounded bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <Paperclip className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{attachment.name}</div>
                    <div className="text-xs text-white/40">{formatBytes(attachment.size)}</div>
                  </div>
                  {editable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white/60 hover:text-red-400"
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
