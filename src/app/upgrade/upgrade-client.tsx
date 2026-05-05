"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

type Cadence = "monthly" | "yearly";
type PaidPlan = "pro" | "enterprise";
type DashboardDict = Record<string, string>;

interface PlanConfig {
  plan: PaidPlan;
  monthlyPrice: number;
  yearlyPrice: number;
}

const PLANS: PlanConfig[] = [
  { plan: "pro", monthlyPrice: 29, yearlyPrice: 290 },
  { plan: "enterprise", monthlyPrice: 99, yearlyPrice: 990 },
];

function planName(plan: PaidPlan, d: DashboardDict): string {
  return plan === "pro" ? d.planPro : d.planEnterprise;
}

function planDescription(plan: PaidPlan, d: DashboardDict): string {
  return plan === "pro" ? d.proDescription : d.enterpriseDescription;
}

function planFeatures(plan: PaidPlan, d: DashboardDict): string[] {
  if (plan === "pro") {
    return [d.proFeature1, d.proFeature2, d.proFeature3, d.proFeature4];
  }
  return [
    d.enterpriseFeature1,
    d.enterpriseFeature2,
    d.enterpriseFeature3,
    d.enterpriseFeature4,
  ];
}

export function UpgradeClient({
  dictionary: d,
}: {
  dictionary: DashboardDict;
}) {
  const params = useSearchParams();
  const { data: subscription } = useSubscription();

  const [cadence, setCadence] = useState<Cadence>(
    subscription?.cadence ?? "monthly"
  );
  const [busyPlan, setBusyPlan] = useState<PaidPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("checkout") === "cancelled") {
      setBanner(d.checkoutCancelled);
    }
  }, [params, d.checkoutCancelled]);

  const currentPlan = subscription?.plan ?? "freemium";

  async function onCheckout(plan: PaidPlan) {
    setBusyPlan(plan);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, cadence }),
      });
      if (!res.ok) throw new Error(await res.text());
      const body = (await res.json()) as { url: string };
      window.location.href = body.url;
    } catch {
      setError(d.billingUnavailable);
      setBusyPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="size-4" />
          {d.backToDashboard}
        </Link>

        <div className="text-center space-y-1 mb-8">
          <h1 className="text-2xl font-bold font-heading">
            {d.chooseYourPlan}
          </h1>
          <p className="text-sm text-gray-500">{d.chooseYourPlanSubtitle}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md border border-gray-200 bg-white text-xs shadow-sm">
            <button
              type="button"
              className={cn(
                "rounded-l-md px-4 py-1.5 transition-colors",
                cadence === "monthly"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setCadence("monthly")}
            >
              {d.monthly}
            </button>
            <button
              type="button"
              className={cn(
                "rounded-r-md px-4 py-1.5 transition-colors",
                cadence === "yearly"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setCadence("yearly")}
            >
              {d.yearly}
            </button>
          </div>
        </div>

        {banner ? (
          <div className="mx-auto mb-6 max-w-md rounded-md border border-gray-200 bg-white p-3 text-center text-xs text-gray-700">
            {banner}
          </div>
        ) : null}

        {error ? (
          <div className="mx-auto mb-6 max-w-md rounded-md border border-red-300 bg-red-50 p-3 text-center text-xs text-red-800">
            {error}
          </div>
        ) : null}

        <div className="container p-20 mx-auto">
          <div className="grid gap-6 grid-cols-2">
            {PLANS.map((p) => {
              const isCurrent = currentPlan === p.plan;
              const price =
                cadence === "monthly" ? p.monthlyPrice : p.yearlyPrice;
              const unit = cadence === "monthly" ? d.month : d.year;
              const busy = busyPlan === p.plan;

              return (
                <div
                  key={p.plan}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold font-heading">
                      {planName(p.plan, d)}
                    </h2>
                    {isCurrent ? <Badge>{d.currentPlan}</Badge> : null}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {planDescription(p.plan, d)}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{price}&euro;</span>
                    <span className="text-sm text-gray-500">/{unit}</span>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {planFeatures(p.plan, d).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-gray-900" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="mt-6 w-full"
                    disabled={busy || isCurrent}
                    onClick={() => onCheckout(p.plan)}
                  >
                    {isCurrent ? d.currentPlan : busy ? "…" : d.startTrial}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
