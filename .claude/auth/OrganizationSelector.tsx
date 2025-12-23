"use client";

import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { useMyOrganizations } from "@/lib/hooks/useUserRole";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

export function OrganizationSelector() {
  const { selectedOrganizationId, setSelectedOrganizationId } = useOrganization();
  const { organizations, isLoading } = useMyOrganizations();

  // Auto-select first organization if none selected
  useEffect(() => {
    if (!selectedOrganizationId && organizations.length > 0) {
      setSelectedOrganizationId(organizations[0]._id ?? null);
    }
  }, [selectedOrganizationId, organizations, setSelectedOrganizationId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        <span className="text-sm text-white/60">Loading...</span>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="px-3 py-2 rounded-lg bg-white/5">
        <span className="text-sm text-white/60">No organizations</span>
      </div>
    );
  }

  // If only one organization, show it without dropdown
  if (organizations.length === 1) {
    return (
      <div className="px-3 py-2 rounded-lg bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-white">
            {organizations[0].name}
          </span>
          <span className="text-xs text-white/40 capitalize">
            ({organizations[0].role})
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedOrganizationId ?? ""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOrganizationId(e.target.value as Id<"organizations">)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
      >
        {organizations.map((org) => (
          <option key={org._id} value={org._id} className="bg-black">
            {org.name} ({org.role})
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
