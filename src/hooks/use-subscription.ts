"use client";

import { useQuery } from "@tanstack/react-query";

import type { CurrentSubscription } from "@/lib/api/billing";

/**
 * Fetches the caller's organization subscription via the Next.js API route
 * proxy at `/api/billing/subscription`. Backend returns a synthetic
 * freemium row when no subscription exists yet, so this hook never 404s
 * on newly-registered orgs.
 *
 * Data is cached for 30 s; consumers (sidebar badge, upgrade page) share
 * the same `["billing", "subscription"]` TanStack Query key so there's
 * no duplicate fetching.
 */
export function useSubscription() {
  return useQuery<CurrentSubscription>({
    queryKey: ["billing", "subscription"],
    queryFn: async () => {
      const res = await fetch("/api/billing/subscription");
      if (!res.ok) throw new Error(`failed to load subscription: ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });
}
