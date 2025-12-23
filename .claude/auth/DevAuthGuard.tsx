"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState, createContext, useContext } from "react";

interface DevAuthGuardProps {
  children: ReactNode;
  redirectUrl?: string;
  role?: "admin" | "client" | "creator";
}

export const DEV_PASSWORDS: Record<string, string> = {
  admin: "cmvamer@gmail.com",
  creator: "amerboom59@gmail.com",
  client: "avvapex@gmail.com",
};

// Context to share dev bypass state
const DevBypassContext = createContext<boolean>(false);
export const useDevBypass = () => useContext(DevBypassContext);

/**
 * Auth Guard with dev bypass using ?dev=EMAIL
 *
 * Usage:
 * - https://sylcroad.com/admin?dev=cmvamer@gmail.com
 * - https://sylcroad.com/client?dev=admin@sylcroad.com
 * - https://sylcroad.com/creator?dev=obre@sylcroad.com
 */
export function DevAuthGuard({ children, redirectUrl, role }: DevAuthGuardProps) {
  const searchParams = useSearchParams();
  const devParam = searchParams.get("dev");
  const expectedPassword = role ? DEV_PASSWORDS[role] : null;
  const bypassAuth = expectedPassword && devParam === expectedPassword;

  // If bypassing auth, render children immediately without calling Clerk
  if (bypassAuth) {
    return (
      <DevBypassContext.Provider value={true}>
        {children}
      </DevBypassContext.Provider>
    );
  }

  // Only use Clerk auth when not bypassing
  return (
    <DevBypassContext.Provider value={false}>
      <ClerkAuthGuard redirectUrl={redirectUrl}>{children}</ClerkAuthGuard>
    </DevBypassContext.Provider>
  );
}

function ClerkAuthGuard({ children, redirectUrl }: { children: ReactNode; redirectUrl?: string }) {
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

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
