import { ApiError, parseApiError } from "./errors";

const SERVICE_URL = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;

function getServiceUrl(): string {
  if (!SERVICE_URL) throw new ApiError("Service URL not configured", 500);
  return SERVICE_URL;
}

export async function applicantsGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${getServiceUrl()}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw await parseApiError(res);
  return res.json();
}

export async function applicantsPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${getServiceUrl()}${path}`, init);
  if (!res.ok) throw await parseApiError(res);
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export async function applicantsPatch(path: string): Promise<void> {
  const res = await fetch(`${getServiceUrl()}${path}`, { method: "PATCH" });
  if (!res.ok) throw await parseApiError(res);
}
