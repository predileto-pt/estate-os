import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

async function getOrganizationId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cached = cookieStore.get("organization_id")?.value;
  if (cached) return cached;

  const headers = await getAuthHeaders();
  if (!headers) return null;

  const res = await fetch(`${CORE_API_URL}/api/v1/auth/me`, { headers });
  if (!res.ok) return null;

  const data = await res.json();
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

export async function GET() {
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const organizationId = await getOrganizationId();
  if (!organizationId) {
    return NextResponse.json({ error: "No organization found" }, { status: 400 });
  }

  try {
    const url = new URL(`${CORE_API_URL}/api/v1/properties/summary`);
    url.searchParams.set("organization_id", organizationId);

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: `Failed to fetch properties: ${body}` },
        { status: res.status },
      );
    }

    const properties = await res.json();
    return NextResponse.json(properties);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Network error" },
      { status: 500 },
    );
  }
}
