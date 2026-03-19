"use server";

import { cookies } from "next/headers";
import { getAuthHeaders } from "@/lib/api/auth";
import { corePatch } from "@/lib/api/core-client";
import { ApiError } from "@/lib/api/errors";
import type {
  ActionResult,
  MutationResult,
  UserResponse,
  OrganizationResponse,
  UserWithOrganizationResponse,
} from "@/lib/api/types";

const API_URL = process.env.API_URL || "http://localhost";

export async function getMe(): Promise<
  ActionResult<{
    user: UserResponse;
    organization: OrganizationResponse | null;
  }>
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, { headers });

    if (!res.ok) {
      return { error: `Failed to fetch user: ${res.status}` };
    }

    const data: UserWithOrganizationResponse = await res.json();

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

    return {
      error: null,
      data: { user: data.user, organization: data.organization },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function updateOrganization(data: {
  organization_id: string;
  name?: string;
  nif?: string;
  address?: string;
}): Promise<MutationResult> {
  try {
    await corePatch(`/api/v1/organizations/${data.organization_id}`, {
      name: data.name || null,
      nif: data.nif || null,
      address: data.address || null,
    });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}
