"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import type { CurrentSubscription } from "@/lib/api/billing";
import { cn } from "@/lib/utils";

type DashboardDict = Record<string, string>;

function planLabel(plan: string, d: DashboardDict): string {
  if (plan === "pro") return d.planPro;
  if (plan === "enterprise") return d.planEnterprise;
  return d.planFreemium;
}

function statusLabel(status: string, d: DashboardDict): string {
  if (status === "trialing") return d.trialActive;
  if (status === "active") return d.currentPlan;
  return status;
}

export function SubscriptionsClient({
  dictionary: d,
  subscription,
}: {
  dictionary: DashboardDict;
  subscription: CurrentSubscription | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = subscription?.plan ?? "freemium";
  const hasStripeCustomer = Boolean(subscription?.stripe_customer_id);
  const isFreemium = plan === "freemium";

  async function onStartPortal() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const body = (await res.json()) as { url: string };
      window.location.href = body.url;
    } catch {
      setError(d.billingUnavailable);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h1 className="text-lg font-bold font-heading">{d.subscriptions}</h1>

      {error ? (
        <div className="text-xs border border-red-300 bg-red-50 text-red-800 p-2">
          {error}
        </div>
      ) : null}

      {isFreemium ? (
        <div className="border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-heading">{planLabel(plan, d)}</h2>
              <span className="text-[10px] rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                {d.free}
              </span>
            </div>
            <p className="text-xs text-gray-500">{d.chooseYourPlanSubtitle}</p>
          </div>
          <Link
            href="/upgrade"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5",
              "text-xs font-medium text-white hover:bg-gray-800",
            )}
          >
            <Sparkles className="size-3.5" />
            {d.upgradePlan}
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold font-heading">{planLabel(plan, d)}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {statusLabel(subscription?.status ?? "", d)}
                {subscription?.cadence
                  ? ` · ${subscription.cadence === "monthly" ? d.monthly : d.yearly}`
                  : null}
              </p>
            </div>
            <span className="text-[10px] rounded-full bg-gray-900 px-2 py-0.5 text-white">
              {statusLabel(subscription?.status ?? "", d)}
            </span>
          </div>

          {hasStripeCustomer ? (
            <button
              type="button"
              className="text-xs rounded-md border border-gray-900 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50"
              onClick={onStartPortal}
              disabled={busy}
            >
              {busy ? "…" : d.manageBilling}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
