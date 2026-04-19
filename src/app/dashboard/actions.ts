"use server";

import { getAuthHeaders, getOrganizationId } from "@/lib/api/auth";
import type { IntakeFormRequestRow } from "@/lib/db-types";

const API_URL = process.env.API_URL || "http://localhost";

export async function getRecentIntakeFormRequests(
  limit = 5,
): Promise<IntakeFormRequestRow[]> {
  const organizationId = await getOrganizationId();
  if (!organizationId) return [];

  const headers = await getAuthHeaders();
  if (!headers) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/v1/applicants/intake-form-requests?organization_id=${organizationId}&limit=${limit}&offset=0`,
      { cache: "no-store", headers },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(
      (r: IntakeFormRequestRow & { status: string }) => ({
        ...r,
        status: r.status.toLowerCase() as IntakeFormRequestRow["status"],
      }),
    );
  } catch {
    return [];
  }
}
