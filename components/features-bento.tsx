"use client";

import { AlertTriangle, Check, X, Zap, Shield, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

function CodeBadge({ children, variant = "default", className }: CodeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
        variant === "default"
          ? "bg-neutral-100 text-neutral-700 border border-neutral-200"
          : "bg-transparent text-neutral-500 border border-neutral-300",
        className
      )}
    >
      <Check className="h-3 w-3 text-neutral-500" />
      {children}
    </span>
  );
}

function HoneyCard() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Honey + CapitalOne no longer work
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Without coupon codes, there&apos;s none to leak. Stop monitoring codes and over-paying affiliate fees.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {/* Honey mockup */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold italic text-amber-500">honey</span>
          </div>

          {/* Error popup */}
          <div className="absolute right-4 top-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-3 max-w-[180px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-red-500">Error</span>
            </div>
            <p className="text-[10px] text-muted-foreground">No coupon code found</p>
          </div>

          <div className="mt-8 bg-neutral-50 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Honey is automatically trying to find the best coupons for you
            </p>
          </div>
        </div>

        {/* Testing codes */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Testing codes:</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-1 text-muted-foreground">
                <X className="h-3 w-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoLeftoverCodeCard() {
  return (
    <div className="h-full flex flex-col bg-neutral-900 text-white rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          No leftover code or scripts
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Once the campaign is over, the scripts disappear, so there&apos;s no leftover code slowing down your site.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {/* Floating icons in a row */}
        <div className="flex items-center justify-center gap-3">
          {/* Code block icon - JS */}
          <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
            <span className="text-white font-mono text-sm font-bold">JS</span>
          </div>

          {/* Lightning bolt - white background */}
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-7 w-7 text-neutral-900 fill-neutral-900" />
          </div>

          {/* Shield icon */}
          <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
            <Shield className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StopCodeAtCheckoutCard() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Stop &apos;Use code X at checkout&apos;
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Automatically apply discounts and change pricing dynamically to see an increase in conversions.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {/* Checkout mockup */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          {/* Strikethrough code */}
          <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-muted-foreground line-through">
              Use Code <span className="font-medium">200FF</span> at checkout
            </span>
            <X className="h-3 w-3 text-muted-foreground" />
          </div>

          {/* Applied offer */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-xs font-medium">Offer automatically applied</span>
              </div>
              <span className="text-lg font-bold">$28.98 <span className="text-xs font-normal text-muted-foreground">USD</span></span>
            </div>

            <button className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
              Checkout
            </button>
          </div>

          {/* Bottom code hint */}
          <div className="px-4 py-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground line-through">
              Use Code <span className="font-medium">NEW10</span> at checkout
            </span>
            <X className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateScriptsCard() {
  return (
    <div className="h-full flex flex-col bg-neutral-900 text-white rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          Create scripts + links in minutes
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Create and auto-apply scripts to your site or share links with your customers in 7 clicks.
        </p>
      </div>

      <div className="flex-1 flex items-end justify-center relative pb-4">
        {/* Background card - positioned behind and to the left */}
        <div className="absolute left-0 bottom-4 bg-neutral-800/80 rounded-xl p-3 w-[160px] border border-neutral-700/50 z-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-neutral-700 rounded-lg flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white font-medium">Codes found</p>
              <p className="text-[9px] text-neutral-500">14 total</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {["15OFF", "JAMES5", "ASTON", "SHAKEN", "GOODIE", "15OFF"].map((code, i) => (
              <span
                key={i}
                className="text-[8px] text-neutral-400 bg-neutral-700/50 rounded px-1.5 py-0.5"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Main card with codes - positioned in front and to the right */}
        <div className="bg-neutral-800 rounded-xl p-3 w-[180px] relative z-10 ml-auto mr-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neutral-400">Block Codes</span>
            <div className="w-7 h-3.5 bg-white rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-neutral-900 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {["15OFF", "JAMES5", "ASTON", "SHAKEN", "GOODIE", "15OFF"].map((code, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-neutral-700/50 rounded-full px-2 py-1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600 flex items-center justify-center">
                  <Check className="h-1.5 w-1.5 text-white" />
                </div>
                <span className="text-[9px] text-neutral-300">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SellAnywhereCard() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Left side - Title and description */}
        <div className="mb-4 md:mb-0 md:w-1/3">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Sell anywhere your customers are
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Shoppable links that allow you to sell anywhere your customers are.
          </p>
        </div>

        {/* Right side - Visual elements */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Link badge */}
          <div className="flex justify-end">
            <div className="bg-neutral-900 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
              <Link2 className="h-4 w-4" />
              <span className="text-sm font-medium">brand.com/welcome-575</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
            <p className="text-sm font-semibold mb-4">Dashboard</p>

            <div className="space-y-3">
              {/* Free shipping item */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mt-0.5">
                  <Check className="h-3.5 w-3.5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">FREESHIPPING</p>
                  <p className="text-xs text-muted-foreground">
                    Free Shipping entire order - <span className="text-neutral-500">One use</span>
                  </p>
                </div>
              </div>

              {/* Hello15 item */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-200 flex items-center justify-center mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">HELLO15</p>
                  <p className="text-xs text-muted-foreground">
                    15% off entire order - <span className="text-neutral-500">One use</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Row 1 - 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[380px]">
            <HoneyCard />
          </div>

          <div className="overflow-hidden min-h-[380px]">
            <NoLeftoverCodeCard />
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[380px]">
            <StopCodeAtCheckoutCard />
          </div>
        </div>

        {/* Row 2 - 2 columns with different widths */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 overflow-hidden min-h-[320px]">
            <CreateScriptsCard />
          </div>

          <div className="md:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[320px]">
            <SellAnywhereCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBento;
