import { createClient } from "@/lib/supabase/server";
import { getAuthContext, getAuthHeaders } from "./auth";
import { ApiError, parseApiError } from "./errors";

const API_URL = process.env.API_URL || "http://localhost";
const DEFAULT_TIMEOUT_MS = 10_000;

function fetchWithTimeout(
  input: string | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(timeoutMs),
  });
}

// On 401, force a Supabase refresh and retry the request once with the
// rotated access token. Covers the window where a token expires between
// getAuthHeaders() and the upstream fetch.
async function fetchWithAuthRetry(
  url: string,
  headers: Record<string, string>,
  init: Omit<RequestInit, "headers"> = {},
): Promise<Response> {
  const res = await fetchWithTimeout(url, { ...init, headers });
  if (res.status !== 401) return res;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) return res;

  const retryHeaders = {
    ...headers,
    Authorization: `Bearer ${data.session.access_token}`,
  };
  return fetchWithTimeout(url, { ...init, headers: retryHeaders });
}

export async function coreGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("organization_id", organizationId);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetchWithAuthRetry(url.toString(), headers);
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function corePost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();

  const res = await fetchWithAuthRetry(`${API_URL}${path}`, headers, {
    method: "POST",
    body: JSON.stringify({ organization_id: organizationId, ...body }),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function coreAuthPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  if (!headers) throw new ApiError("Not authenticated", 401);

  const res = await fetchWithAuthRetry(`${API_URL}${path}`, headers, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function corePatch<T>(
  path: string,
  body: unknown,
  params?: Record<string, string>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("organization_id", organizationId);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetchWithAuthRetry(url.toString(), headers, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function corePut<T>(
  path: string,
  body: unknown,
  params?: Record<string, string>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("organization_id", organizationId);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetchWithAuthRetry(url.toString(), headers, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function coreDelete(
  path: string,
  params?: Record<string, string>,
): Promise<void> {
  const { headers, organizationId } = await getAuthContext();
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("organization_id", organizationId);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetchWithAuthRetry(url.toString(), headers, {
    method: "DELETE",
  });
  if (!res.ok) throw await parseApiError(res);
}
