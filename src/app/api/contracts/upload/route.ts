import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";

const API_URL = process.env.API_URL || "http://localhost";

export async function POST(request: Request) {
  try {
    const { headers: authHeaders, organizationId } = await getAuthContext();

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const upstreamForm = new FormData();
    upstreamForm.append("file", file);
    upstreamForm.append("organization_id", organizationId);

    const res = await fetch(`${API_URL}/api/v1/admin/contracts/source-documents`, {
      method: "POST",
      headers: { Authorization: authHeaders.Authorization },
      body: upstreamForm,
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: body },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Network error" },
      { status: 500 },
    );
  }
}
