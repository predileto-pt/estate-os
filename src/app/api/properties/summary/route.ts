import { NextResponse } from "next/server";
import { coreGet } from "@/lib/api/core-client";
import { ApiError } from "@/lib/api/errors";
import type { PropertySummary } from "@/lib/api/types";

export async function GET() {
  try {
    const properties = await coreGet<PropertySummary[]>(
      "/api/v1/properties/summary",
    );
    return NextResponse.json(properties);
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
