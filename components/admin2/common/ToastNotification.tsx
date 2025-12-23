"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: "bg-green-500/10 border-green-500/20",
    iconClass: "text-green-400",
  },
  error: {
    icon: XCircle,
    bgClass: "bg-red-500/10 border-red-500/20",
    iconClass: "text-red-400",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-amber-500/10 border-amber-500/20",
    iconClass: "text-amber-400",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-500/10 border-blue-500/20",
    iconClass: "text-blue-400",
  },
};

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border backdrop-blur-lg ${config.bgClass}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            {toast.message && (
              <p className="mt-1 text-sm text-white/80">{toast.message}</p>
            )}

            {toast.action && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.action!.onClick();
                    onClose(toast.id);
                  }}
                  className="h-8 text-white/80 hover:text-white"
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={() => onClose(toast.id)}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar for duration */}
      {toast.duration && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
          className={`h-1 ${config.iconClass.replace("text-", "bg-")}/50`}
        />
      )}
    </motion.div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export function ToastContainer({
  toasts,
  onClose,
  position = "top-right",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${positionClasses[position]}`}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...toast, id, duration: toast.duration ?? 5000 }]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title: string, message?: string, action?: Toast["action"]) =>
      addToast({ type: "success", title, message, action }),
    error: (title: string, message?: string, action?: Toast["action"]) =>
      addToast({ type: "error", title, message, action }),
    warning: (title: string, message?: string, action?: Toast["action"]) =>
      addToast({ type: "warning", title, message, action }),
    info: (title: string, message?: string, action?: Toast["action"]) =>
      addToast({ type: "info", title, message, action }),
  };

  return {
    toasts,
    toast,
    removeToast,
  };
}
