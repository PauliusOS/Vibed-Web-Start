"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  redirectUrl?: string;
}

/**
 * Client Component that protects routes by checking authentication.
 * Redirects unauthenticated users to sign-in page.
 *
 * Uses client-side auth to avoid Vercel Edge Runtime issues with Clerk middleware.
 */
export function AuthGuard({ children, redirectUrl }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const redirect = redirectUrl || pathname;
      const signInPath = `/sign-in?redirect_url=${encodeURIComponent(redirect)}`;
      router.replace(signInPath);
    }
  }, [isLoaded, isSignedIn, router, pathname, redirectUrl]);

  // Show nothing while loading or redirecting
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
