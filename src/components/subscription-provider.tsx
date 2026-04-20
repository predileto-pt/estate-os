"use client";

/**
 * Mount point for subscription-aware UI. Currently a passthrough — the
 * `useSubscription()` hook (src/hooks/use-subscription.ts) reads directly
 * from TanStack Query (QueryProvider is mounted at the root layout) and
 * needs no additional context today. This component exists as a seam so
 * future behaviour (refetch-on-focus, optimistic updates after checkout,
 * etc.) can land without touching every consumer.
 */
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
