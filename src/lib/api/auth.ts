import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ApiError } from "./errors";
import type { UserWithOrganizationResponse } from "./types";

const API_URL = process.env.API_URL || "http://localhost";

export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const supabase = await createClient();

  // getUser() validates the token against Supabase and rotates cookies on
  // refresh; getSession() alone never triggers rotation.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function getOrganizationId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cached = cookieStore.get("organization_id")?.value;
  if (cached) return cached;

  const headers = await getAuthHeaders();
  if (!headers) return null;

  const res = await fetch(`${API_URL}/api/v1/admin/auth/me`, { headers });
  if (!res.ok) return null;

  const data: UserWithOrganizationResponse = await res.json();
  const orgId = data.user.organization_id ?? null;

  if (orgId) {
    cookieStore.set("organization_id", orgId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return orgId;
}

export async function getAuthContext(): Promise<{
  headers: Record<string, string>;
  organizationId: string;
}> {
  const headers = await getAuthHeaders();
  if (!headers) throw new ApiError("Not authenticated", 401);

  const organizationId = await getOrganizationId();
  if (!organizationId) throw new ApiError("No organization found", 400);

  return { headers, organizationId };
}
