"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface DropSignupFormProps {
  slug: string;
  isExpired?: boolean;
  slotsRemaining?: number;
}

export function DropSignupForm({
  slug,
  isExpired = false,
  slotsRemaining,
}: DropSignupFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitSignup = useMutation(api.drops.submitDropSignup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const metadata = {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        utmSource: urlParams.get("utm_source") || undefined,
        utmMedium: urlParams.get("utm_medium") || undefined,
        utmCampaign: urlParams.get("utm_campaign") || undefined,
      };

      const result = await submitSignup({
        slug,
        email,
        name: name || undefined,
        metadata,
      });

      if (result.success) {
        setIsSuccess(true);
        // Clear form
        setEmail("");
        setName("");
      } else {
        setError(result.message || "Failed to sign up. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show expired message
  if (isExpired) {
    return (
      <Card className="bg-[#1a1a1a] border-[#3a3a3a] sticky top-6">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Opportunity Expired
              </h3>
              <p className="text-sm text-muted-foreground">
                This campaign opportunity has ended. Check back for future
                opportunities!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show slots filled message
  if (slotsRemaining !== undefined && slotsRemaining <= 0) {
    return (
      <Card className="bg-[#1a1a1a] border-[#3a3a3a] sticky top-6">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                All Spots Filled
              </h3>
              <p className="text-sm text-muted-foreground">
                All available spots for this campaign have been filled. Check
                back for future opportunities!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <Card className="bg-[#1a1a1a] border-[#3a3a3a] sticky top-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                You're In!
              </h3>
              <p className="text-muted-foreground">
                Thank you for your interest! We've received your submission and
                will be in touch soon with more details about this opportunity.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
              className="mt-2 bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
            >
              Submit Another Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show signup form
  return (
    <Card className="bg-[#1a1a1a] border-[#3a3a3a] sticky top-6">
      <CardHeader>
        <CardTitle className="text-white">Express Your Interest</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to be considered for this opportunity
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name (Optional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0A0A0A] border-[#3a3a3a] text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>

          {/* Email Field (Required) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#0A0A0A] border-[#3a3a3a] text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Sign Up Now
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to be contacted about this opportunity
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

