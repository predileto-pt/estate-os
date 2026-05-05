import { NextResponse } from "next/server";

import { getCurrentSubscription } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const sub = await getCurrentSubscription();
    return NextResponse.json(sub);
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
