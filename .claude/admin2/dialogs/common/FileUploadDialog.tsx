"use client";

import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  title?: string;
  description?: string;
}

export function FileUploadDialog({
  open,
  onOpenChange,
  onUpload,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = true,
  title = "Upload Files",
  description = "Drag and drop files or click to browse",
}: FileUploadDialogProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);

      if (!multiple && fileArray.length > 1) {
        return;
      }

      if (files.length + fileArray.length > maxFiles) {
        return;
      }

      const uploadedFiles: UploadedFile[] = fileArray.map((file) => {
        const error = validateFile(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: error ? "error" : "pending",
          error: error || undefined,
        };
      });

      setFiles((prev) => [...prev, ...uploadedFiles]);
    },
    [files.length, maxFiles, multiple]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const simulateUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: 100, status: "success" } : f
            )
          );
          resolve();
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress, status: "uploading" } : f
            )
          );
        }
      }, 200);
    });
  };

  const handleUpload = async () => {
    const validFiles = files.filter((f) => f.status === "pending");
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Simulate upload progress for each file
      await Promise.all(
        validFiles.map((file) => simulateUpload(file.id))
      );

      // Call the actual upload function
      await onUpload(validFiles.map((f) => f.file));

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error", error: "Upload failed" }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const hasValidFiles = files.some((f) => f.status === "pending" || f.status === "success");
  const hasErrors = files.some((f) => f.status === "error");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]"
            }`}
          >
            <Upload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragging ? "text-blue-400" : "text-white/40"
              }`}
            />
            <p className="text-white/80 font-medium mb-1">
              {isDragging ? "Drop files here" : "Click or drag files to upload"}
            </p>
            <p className="text-sm text-white/60">
              {multiple ? `Up to ${maxFiles} files` : "Single file only"} • Max{" "}
              {formatFileSize(maxSize)} per file
            </p>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={accept}
              multiple={multiple}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center">
                      {file.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : file.status === "error" ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <File className="w-5 h-5 text-blue-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-white/40">
                          {formatFileSize(file.file.size)}
                        </p>
                        {file.status === "uploading" && (
                          <p className="text-xs text-blue-400">
                            {Math.round(file.progress)}%
                          </p>
                        )}
                        {file.status === "error" && file.error && (
                          <p className="text-xs text-red-400">{file.error}</p>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <div className="mt-2 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.2 }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {file.status !== "uploading" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="flex-shrink-0 p-1 rounded hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!hasValidFiles || isUploading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isUploading ? "Uploading..." : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
