import { parseApiError } from "./errors";

const API_URL = process.env.API_URL || "http://localhost";

export async function applicantsGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
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
  body?: unknown
): Promise<T> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) throw await parseApiError(res);
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export async function applicantsPatch(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { method: "PATCH" });
  if (!res.ok) throw await parseApiError(res);
}
