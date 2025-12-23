"use client";

import { Suspense, lazy, ComponentType } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LazyDialogLoaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loader: () => Promise<{ default: ComponentType<any> }>;
  props?: any;
}

/**
 * Lazy loading wrapper for dialog components
 * Only loads the dialog code when it's actually opened
 * Reduces initial bundle size significantly
 */
export function LazyDialogLoader({
  open,
  onOpenChange,
  loader,
  props = {},
}: LazyDialogLoaderProps) {
  // Only load the component when the dialog is opened
  if (!open) return null;

  const LazyComponent = lazy(loader);

  return (
    <Suspense
      fallback={
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <LazyComponent open={open} onOpenChange={onOpenChange} {...props} />
    </Suspense>
  );
}
