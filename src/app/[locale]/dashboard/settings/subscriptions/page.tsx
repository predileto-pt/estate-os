import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const plans = [
  { key: "free" as const, price: 0, current: true },
  { key: "pro" as const, price: 29, current: false },
  { key: "enterprise" as const, price: 99, current: false },
];

export default async function SubscriptionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const d = dict.dashboard;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold font-heading">{d.subscriptions}</h1>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "border p-4 space-y-2",
              plan.current
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-heading">
                {d[plan.key]}
              </h2>
              {plan.current && (
                <span className="text-xs bg-gray-900 text-white px-2 py-0.5">
                  {d.currentPlan}
                </span>
              )}
            </div>
            <p className="text-4xl font-bold">
              {plan.price === 0 ? (
                d.free
              ) : (
                <>
                  {plan.price}&euro;
                  <span className="text-sm font-normal text-gray-400">
                    /{d.month}
                  </span>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
