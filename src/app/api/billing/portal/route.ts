import { NextResponse } from "next/server";

import { startPortal } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/errors";

export async function POST() {
  try {
    const result = await startPortal();
    return NextResponse.json(result);
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
