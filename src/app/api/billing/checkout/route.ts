import { NextResponse } from "next/server";

import { startCheckout } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = body?.plan;
    const cadence = body?.cadence;

    if (plan !== "pro" && plan !== "enterprise") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (cadence !== "monthly" && cadence !== "yearly") {
      return NextResponse.json({ error: "Invalid cadence" }, { status: 400 });
    }

    const result = await startCheckout({ plan, cadence });
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
