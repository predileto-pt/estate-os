export async function clientFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(body);
  }
  return res.json();
}
