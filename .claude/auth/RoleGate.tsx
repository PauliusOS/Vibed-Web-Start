"use client";

import { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserRole } from "@/lib/hooks/useUserRole";

interface RoleGateProps {
  /**
   * Required role(s) to view content
   */
  role: "admin" | "client" | "creator" | Array<"admin" | "client" | "creator">;
  /**
   * Organization ID to check role in
   */
  organizationId: Id<"organizations"> | null;
  /**
   * Content to show if user has correct role
   */
  children: ReactNode;
  /**
   * Optional fallback content if user doesn't have role
   */
  fallback?: ReactNode;
  /**
   * Optional loading state
   */
  loadingFallback?: ReactNode;
}

/**
 * Conditionally render content based on user role
 *
 * Example:
 * <RoleGate role="admin" organizationId={orgId}>
 *   Admin-only content
 * </RoleGate>
 */
export function RoleGate({
  role,
  organizationId,
  children,
  fallback = null,
  loadingFallback = null,
}: RoleGateProps) {
  const { role: userRole, isLoading } = useUserRole(organizationId);

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!userRole) {
    return <>{fallback}</>;
  }

  // Check if user has one of the allowed roles
  const allowedRoles = Array.isArray(role) ? role : [role];
  // Super admin has access to all roles
  const hasRole = userRole === "super_admin" || allowedRoles.includes(userRole as "admin" | "client" | "creator");

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
