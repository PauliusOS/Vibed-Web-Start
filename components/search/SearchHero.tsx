"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sparkles } from "lucide-react";

interface SearchHeroProps {
  onSearch?: (url: string, platform: "instagram" | "tiktok") => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch?.(url.trim(), platform);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-primary p-12 mb-8">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.3),transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-300 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">
              Find the perfect match
            </h1>
            <Sparkles className="w-6 h-6 text-blue-300 animate-pulse" />
          </div>
          <p className="text-blue-100 text-lg">
            Discover and analyze creators for your campaigns
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3 max-w-2xl mx-auto">
            {/* Platform Selector */}
            <Select
              value={platform}
              onValueChange={(value: "instagram" | "tiktok") => setPlatform(value)}
            >
              <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>

            {/* URL Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Paste creator profile URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 bg-white/95 backdrop-blur-sm border-white/20 text-foreground placeholder:text-muted-foreground h-12"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="px-8 bg-white text-blue-900 hover:bg-blue-50 font-semibold"
            >
              Analyze Creator
            </Button>
          </div>

          {/* Example URLs */}
          <div className="text-sm text-blue-200">
            <span className="opacity-75">Example: </span>
            <button
              type="button"
              onClick={() => setUrl("https://instagram.com/username")}
              className="underline hover:text-white transition-colors"
            >
              instagram.com/username
            </button>
            <span className="mx-2 opacity-50">or</span>
            <button
              type="button"
              onClick={() => setUrl("https://tiktok.com/@username")}
              className="underline hover:text-white transition-colors"
            >
              tiktok.com/@username
            </button>
          </div>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
    </div>
  );
}
