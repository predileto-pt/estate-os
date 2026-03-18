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

async function getOrganizationId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cached = cookieStore.get("organization_id")?.value;
  if (cached) return cached;

  // Fallback: fetch from API and set cookie for next time
  const headers = await getAuthHeaders();
  if (!headers) return null;

  const res = await fetch(`${CORE_API_URL}/api/v1/auth/me`, { headers });
  if (!res.ok) return null;

  const data: components["schemas"]["UserWithOrganizationResponse"] = await res.json();
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

export async function getProperties(): Promise<
  | { error: string }
  | { error: null; properties: components["schemas"]["PropertyResponse"][] }
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  const organizationId = await getOrganizationId();
  if (!organizationId) return { error: "No organization found" };

  try {
    const url = new URL(`${CORE_API_URL}/api/v1/properties/`);
    url.searchParams.set("organization_id", organizationId);

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const body = await res.text();
      return { error: `Failed to fetch properties: ${body}` };
    }

    const properties: components["schemas"]["PropertyResponse"][] = await res.json();
    return { error: null, properties };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function getProperty(
  propertyId: string,
): Promise<
  | { error: string }
  | { error: null; property: components["schemas"]["PropertyResponse"] }
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  const organizationId = await getOrganizationId();
  if (!organizationId) return { error: "No organization found" };

  try {
    const url = new URL(`${CORE_API_URL}/api/v1/properties/${propertyId}`);
    url.searchParams.set("organization_id", organizationId);

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const body = await res.text();
      return { error: `Failed to fetch property: ${body}` };
    }

    const property: components["schemas"]["PropertyResponse"] = await res.json();
    return { error: null, property };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function presignExtractionFiles(
  files: { filename: string; content_type: string }[],
): Promise<
  | { error: string }
  | { error: null; job_id: string; files: { s3_key: string; upload_url: string }[] }
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${CORE_API_URL}/api/v1/extraction-jobs/presign`, {
      method: "POST",
      headers,
      body: JSON.stringify({ files }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { error: `Presign failed: ${body}` };
    }

    const data: {
      job_id: string;
      files: { s3_key: string; upload_url: string }[];
    } = await res.json();

    return { error: null, ...data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function getExtractionJobs(): Promise<
  | { error: string }
  | { error: null; jobs: components["schemas"]["ExtractionJobResponse"][] }
> {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  const organizationId = await getOrganizationId();
  if (!organizationId) return { error: "No organization found" };

  try {
    const url = new URL(`${CORE_API_URL}/api/v1/extraction-jobs/`);
    url.searchParams.set("organization_id", organizationId);

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const body = await res.text();
      return { error: `Failed to fetch jobs: ${body}` };
    }

    const jobs: components["schemas"]["ExtractionJobResponse"][] = await res.json();
    return { error: null, jobs };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function submitExtractionJob(params: {
  job_id: string;
  document_keys: string[];
  listing_type: string;
  typology: string;
}) {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  const organizationId = await getOrganizationId();
  if (!organizationId) return { error: "No organization found" };

  try {
    const res = await fetch(`${CORE_API_URL}/api/v1/extraction-jobs/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...params, organization_id: organizationId }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { error: `Submit failed: ${body}` };
    }

    return { success: true, jobId: params.job_id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
