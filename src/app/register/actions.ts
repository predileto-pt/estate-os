"use server";

import { cookies } from "next/headers";
import { getAuthHeaders } from "@/lib/api/auth";
import { coreGet, corePatch } from "@/lib/api/core-client";
import { ApiError } from "@/lib/api/errors";
import type {
  ActionResult,
  MutationResult,
  UserResponse,
  OrganizationResponse,
  MeResponse,
  MembershipSummary,
} from "@/lib/api/types";

const API_URL = process.env.API_URL || "http://localhost";

export async function getMe(): Promise<
  ActionResult<{
    user: UserResponse;
    memberships: MembershipSummary[];
    organizationId: string | null;
  }>
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${API_URL}/api/v1/admin/auth/me`, { headers });

    if (!res.ok) {
      return { error: `Failed to fetch user: ${res.status}` };
    }

    const data: MeResponse = await res.json();
    const organizationId = data.memberships[0]?.organization_id ?? null;

    if (organizationId) {
      const cookieStore = await cookies();
      cookieStore.set("organization_id", organizationId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return {
      error: null,
      data: { user: data.user, memberships: data.memberships, organizationId },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function getOrganization(
  organizationId: string,
): Promise<ActionResult<OrganizationResponse>> {
  try {
    const data = await coreGet<OrganizationResponse>(
      `/api/v1/admin/organizations/${organizationId}`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function updateOrganization(data: {
  organization_id: string;
  name?: string;
  nif?: string;
  address?: string;
  email?: string;
  phone_country_code?: string;
  phone_number?: string;
}): Promise<MutationResult> {
  try {
    await corePatch(`/api/v1/admin/organizations/${data.organization_id}`, {
      name: data.name || null,
      nif: data.nif || null,
      address: data.address || null,
      email: data.email || null,
      phone_country_code: data.phone_country_code || null,
      phone_number: data.phone_number || null,
    });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}
