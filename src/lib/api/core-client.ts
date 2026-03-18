import { getAuthContext, getAuthHeaders } from "./auth";
import { ApiError, parseApiError } from "./errors";

const CORE_API_URL = process.env.CORE_API_URL || "http://localhost:8000";

export async function coreGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();
  const url = new URL(`${CORE_API_URL}${path}`);
  url.searchParams.set("organization_id", organizationId);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function corePost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { headers, organizationId } = await getAuthContext();

  const res = await fetch(`${CORE_API_URL}${path}`, {
    method: "POST",
    headers,
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

  const res = await fetch(`${CORE_API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function corePatch<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  if (!headers) throw new ApiError("Not authenticated", 401);

  const res = await fetch(`${CORE_API_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}
