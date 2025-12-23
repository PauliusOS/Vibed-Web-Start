"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Command, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: "campaigns" | "creators" | "clients" | "videos" | "settings";
  url: string;
  icon?: React.ReactNode;
  metadata?: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
  recentSearches?: string[];
  onRecentSearchClick?: (query: string) => void;
  placeholder?: string;
}

const categoryConfig = {
  campaigns: { label: "Campaigns", color: "text-blue-400" },
  creators: { label: "Creators", color: "text-purple-400" },
  clients: { label: "Clients", color: "text-green-400" },
  videos: { label: "Videos", color: "text-pink-400" },
  settings: { label: "Settings", color: "text-amber-400" },
};

export function SearchDialog({
  open,
  onOpenChange,
  onSearch,
  recentSearches = [],
  onRecentSearchClick,
  placeholder = "Search campaigns, creators, clients...",
}: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut handler (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Search handler with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      router.push(result.url);
      onOpenChange(false);
      setQuery("");
    },
    [router, onOpenChange]
  );

  const handleRecentSearchClick = useCallback(
    (search: string) => {
      setQuery(search);
      if (onRecentSearchClick) {
        onRecentSearchClick(search);
      }
    },
    [onRecentSearchClick]
  );

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="relative p-4 border-b border-white/[0.06]">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-12 pr-20 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 h-12 text-base"
            autoFocus
          />
          <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-white/[0.05] text-white/60 text-xs">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full mx-auto mb-3" />
              <p className="text-white/60 text-sm">Searching...</p>
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="text-white/60 text-sm">
                No results found for "{query}"
              </p>
            </div>
          ) : query.trim() ? (
            <div className="py-2">
              <AnimatePresence>
                {results.map((result, index) => {
                  const category = categoryConfig[result.category];
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        selectedIndex === index
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center mt-0.5">
                        {result.icon || <Search className="w-5 h-5 text-white/60" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white truncate">
                            {result.title}
                          </h4>
                          <span
                            className={`text-xs ${category.color} flex-shrink-0`}
                          >
                            {category.label}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-white/60 line-clamp-1">
                            {result.description}
                          </p>
                        )}
                        {result.metadata && (
                          <p className="text-xs text-white/40 mt-1">
                            {result.metadata}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className={`w-4 h-4 flex-shrink-0 mt-3 transition-all ${
                          selectedIndex === index
                            ? "text-white/80 translate-x-1"
                            : "text-white/20"
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            // Recent Searches & Quick Actions
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <span className="text-sm text-white/80">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Quick Actions
                </div>
                {[
                  {
                    label: "View Analytics",
                    url: "/admin2/analytics",
                    icon: <TrendingUp className="w-4 h-4" />,
                  },
                  {
                    label: "Create Campaign",
                    url: "/admin2/campaigns/new",
                    icon: <Search className="w-4 h-4" />,
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(action.url);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/60">
                      {action.icon}
                    </div>
                    <span className="text-sm text-white/80">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span>{results.length} results</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
