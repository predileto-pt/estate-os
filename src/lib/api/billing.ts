import { getAuthHeaders } from "./auth";
import { ApiError, parseApiError } from "./errors";

const API_URL = process.env.API_URL || "http://localhost";

export type Plan = "freemium" | "pro" | "enterprise";
export type Cadence = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "inactive";

export interface CurrentSubscription {
  id: string | null;
  organization_id: string;
  plan: Plan;
  type: "stripe" | "manual" | "deposit";
  status: SubscriptionStatus;
  cadence: Cadence | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

async function authedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = await getAuthHeaders();
  if (!headers) throw new ApiError("Not authenticated", 401);

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
  });
}

export async function getCurrentSubscription(): Promise<CurrentSubscription> {
  const res = await authedFetch("/api/v1/admin/billing/subscription");
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function startCheckout(args: {
  plan: "pro" | "enterprise";
  cadence: Cadence;
}): Promise<{ url: string; session_id: string }> {
  const res = await authedFetch("/api/v1/admin/billing/checkout", {
    method: "POST",
    body: JSON.stringify(args),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function startPortal(): Promise<{ url: string }> {
  const res = await authedFetch("/api/v1/admin/billing/portal", {
    method: "POST",
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}
