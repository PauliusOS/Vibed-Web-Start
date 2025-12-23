"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useDevBypass } from "@/components/auth/DevAuthGuard";

interface RequireRoleProps {
  /**
   * Required role to access this content
   */
  requiredRole: "admin" | "client" | "creator" | Array<"admin" | "client" | "creator">;
  /**
   * Organization ID to check role in
   */
  organizationId: Id<"organizations"> | null;
  /**
   * Content to show if authorized
   */
  children: ReactNode;
  /**
   * Optional loading component
   */
  loadingComponent?: ReactNode;
}

/**
 * Redirect to appropriate dashboard if user doesn't have required role
 *
 * Example:
 * <RequireRole requiredRole="admin" organizationId={orgId}>
 *   <AdminDashboard />
 * </RequireRole>
 */
export function RequireRole({
  requiredRole,
  organizationId,
  children,
  loadingComponent = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  ),
}: RequireRoleProps) {
  const isDevBypass = useDevBypass();
  const { role: userRole, isLoading } = useUserRole(organizationId);
  const router = useRouter();

  // Skip all role checks in dev bypass mode
  if (isDevBypass) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!isLoading && userRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      // Super admin has access to all roles
      const hasRole = userRole === "super_admin" || allowedRoles.includes(userRole as "admin" | "client" | "creator");

      if (!hasRole) {
        // Redirect to user's appropriate dashboard using Next.js router
        const role = userRole as string;
        if (role === "admin" || role === "super_admin") {
          router.push("/home");
        } else if (role === "client") {
          router.push("/client");
        } else if (role === "creator") {
          router.push("/creator");
        }
      }
    } else if (!isLoading && !userRole) {
      // No role found - redirect to home
      router.push("/");
    }
  }, [isLoading, userRole, requiredRole, router]);

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!userRole) {
    // No role found - show loading while redirecting
    return <>{loadingComponent}</>;
  }

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  // Super admin has access to all roles
  const hasRole = userRole === "super_admin" || allowedRoles.includes(userRole as "admin" | "client" | "creator");

  if (!hasRole) {
    // Wrong role - loading while redirecting
    return <>{loadingComponent}</>;
  }

  return <>{children}</>;
}
