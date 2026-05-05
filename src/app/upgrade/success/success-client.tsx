"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type DashboardDict = Record<string, string>;

export function SuccessClient({ dictionary: d }: { dictionary: DashboardDict }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-7 text-green-700" />
        </div>

        <h1 className="text-xl font-bold font-heading">{d.checkoutSuccessTitle}</h1>
        <p className="mt-2 text-sm text-gray-600">{d.checkoutSuccessBody}</p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {d.backToDashboard}
          </Link>
          <Link
            href="/dashboard/settings/subscriptions"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {d.manageBilling}
          </Link>
        </div>
      </div>
    </div>
  );
}
