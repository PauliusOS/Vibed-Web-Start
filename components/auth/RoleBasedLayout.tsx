"use client";

import { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserRole } from "@/lib/hooks/useUserRole";

interface RoleBasedLayoutProps {
  /**
   * Organization ID to check role in
   */
  organizationId: Id<"organizations"> | null;
  /**
   * Layout for admin role
   */
  adminLayout?: ReactNode;
  /**
   * Layout for client role
   */
  clientLayout?: ReactNode;
  /**
   * Layout for creator role
   */
  creatorLayout?: ReactNode;
  /**
   * Default layout if no role matches
   */
  defaultLayout?: ReactNode;
  /**
   * Loading state
   */
  loadingLayout?: ReactNode;
}

/**
 * Render different layouts based on user role
 *
 * Example:
 * <RoleBasedLayout
 *   organizationId={orgId}
 *   adminLayout={<AdminLayout />}
 *   clientLayout={<ClientLayout />}
 *   creatorLayout={<CreatorLayout />}
 * />
 */
export function RoleBasedLayout({
  organizationId,
  adminLayout,
  clientLayout,
  creatorLayout,
  defaultLayout = null,
  loadingLayout = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  ),
}: RoleBasedLayoutProps) {
  const { role, isLoading } = useUserRole(organizationId);

  if (isLoading) {
    return <>{loadingLayout}</>;
  }

  switch (role) {
    case "admin":
      return <>{adminLayout ?? defaultLayout}</>;
    case "client":
      return <>{clientLayout ?? defaultLayout}</>;
    case "creator":
      return <>{creatorLayout ?? defaultLayout}</>;
    default:
      return <>{defaultLayout}</>;
  }
}
