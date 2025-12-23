"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropInfo {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

interface ComponentPreviewProps {
  name: string;
  description: string;
  importPath: string;
  children: React.ReactNode;
  props?: PropInfo[];
  className?: string;
  previewClassName?: string;
  variant?: "default" | "compact" | "full";
  showImport?: boolean;
}

export function ComponentPreview({
  name,
  description,
  importPath,
  children,
  props,
  className,
  previewClassName,
  variant = "default",
  showImport = true,
}: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showProps, setShowProps] = useState(false);

  const importStatement = `import { ${name} } from "${importPath}";`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(importStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "compact") {
    return (
      <div className={cn("border border-white/10 rounded-lg overflow-hidden bg-black/40 hover:border-white/20 transition-colors", className)}>
        <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-mono text-cyan-400 text-sm font-medium truncate">{name}</h3>
          </div>
          {showImport && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={handleCopy}>
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-white/40" />}
            </Button>
          )}
        </div>
        <div className={cn("p-3", previewClassName)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-white/10 rounded-xl overflow-hidden bg-black/40 hover:border-white/20 transition-colors", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-mono text-cyan-400 font-semibold">{name}</h3>
          <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{description}</p>
        </div>
        {showImport && (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
          </Button>
        )}
      </div>

      {/* Import path */}
      {showImport && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10">
          <code className="text-xs text-white/60 font-mono">{importStatement}</code>
        </div>
      )}

      {/* Preview */}
      <div className={cn("p-4", previewClassName)}>
        {children}
      </div>

      {/* Props (collapsible) */}
      {props && props.length > 0 && (
        <div className="border-t border-white/10">
          <button
            onClick={() => setShowProps(!showProps)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-white/50 hover:bg-white/5 transition-colors"
          >
            <span>Props ({props.length})</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", showProps && "rotate-180")} />
          </button>
          {showProps && (
            <div className="px-4 py-3 space-y-3 bg-white/5">
              {props.map((prop) => (
                <div key={prop.name} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-mono">{prop.name}</span>
                    {prop.required && <span className="text-red-400 text-[10px]">required</span>}
                    <span className="text-white/30">:</span>
                    <span className="text-blue-400 font-mono">{prop.type}</span>
                  </div>
                  {prop.description && (
                    <p className="text-white/40 mt-0.5">{prop.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Grid wrapper for component previews
interface ComponentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ComponentGrid({ children, columns = 2, className }: ComponentGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Simple component card for directory listings
interface ComponentCardProps {
  name: string;
  description?: string;
  importPath: string;
  color?: "cyan" | "blue" | "purple" | "pink" | "emerald" | "yellow" | "orange";
}

export function ComponentCard({ name, description, importPath, color = "cyan" }: ComponentCardProps) {
  const [copied, setCopied] = useState(false);

  const colors = {
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
    emerald: "text-emerald-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`import { ${name} } from "${importPath}";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
      onClick={handleCopy}
    >
      <div className="flex items-center justify-between">
        <p className={cn("font-mono text-sm", colors[color])}>{name}</p>
        {copied ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : (
          <Copy className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      {description && (
        <p className="text-xs text-white/50 mt-1 line-clamp-2">{description}</p>
      )}
    </div>
  );
}

// Section header component
interface SectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  badge?: string;
  badgeColor?: "cyan" | "blue" | "purple" | "pink" | "emerald";
}

export function SectionHeader({ title, description, count, badge, badgeColor = "cyan" }: SectionHeaderProps) {
  const badgeColors = {
    cyan: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    blue: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    purple: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    pink: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    emerald: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  };

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {badge && (
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r border", badgeColors[badgeColor])}>
            {badge}
          </span>
        )}
        {count !== undefined && (
          <span className="text-xs text-white/40">{count} components</span>
        )}
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {description && <p className="text-white/60">{description}</p>}
    </div>
  );
}
