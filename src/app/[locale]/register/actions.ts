"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { components } from "@/lib/api-types";

const CORE_API_URL = process.env.CORE_API_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function getMe(): Promise<
  | { error: string }
  | { error: null; user: components["schemas"]["UserResponse"]; organization: components["schemas"]["OrganizationResponse"] | null }
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${CORE_API_URL}/api/v1/auth/me`, {
      headers,
    });

    if (!res.ok) {
      return { error: `Failed to fetch user: ${res.status}` };
    }

    const data: components["schemas"]["UserWithOrganizationResponse"] = await res.json();

    // Cache organization_id in cookie
    const orgId = data.user.organization_id;
    if (orgId) {
      const cookieStore = await cookies();
      cookieStore.set("organization_id", orgId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return { error: null, user: data.user, organization: data.organization };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function updateOrganization(data: {
  organization_id: string;
  name?: string;
  nif?: string;
  address?: string;
}): Promise<{ error: string } | { error: null }> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(
      `${CORE_API_URL}/api/v1/organizations/${data.organization_id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          name: data.name || null,
          nif: data.nif || null,
          address: data.address || null,
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      return { error: `Update failed: ${body}` };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
