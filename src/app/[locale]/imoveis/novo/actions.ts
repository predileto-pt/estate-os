"use server";

import { createClient } from "@/lib/supabase/server";

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

export async function submitExtractionJob(params: {
  job_id: string;
  document_keys: string[];
  listing_type: string;
  typology: string;
}) {
  const headers = await getAuthHeaders();
  if (!headers) return { error: "Not authenticated" };

  try {
    const res = await fetch(`${CORE_API_URL}/api/v1/extraction-jobs/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
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
