import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { IntakeFormRequestCard } from "./components/intake-form-request-card";
import { CreateIntakeFormRequestForm } from "./components/create-intake-form-request-form";

export default async function IntakeFormRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("intake_form_requests")
    .select("*")
    .eq("agency_id", user.id)
    .order("created_at", { ascending: false });

  const requests = data ?? [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold font-heading">
          {dict.dashboard.intakeFormRequests}
        </h1>
      </div>

      <CreateIntakeFormRequestForm dict={dict.dashboard} />

      {requests.length === 0 ? (
        <p className="text-sm text-gray-400 mt-6">
          {dict.dashboard.noIntakeFormRequests}
        </p>
      ) : (
        <div className="space-y-3 mt-4">
          {requests.map((request) => (
            <IntakeFormRequestCard
              key={request.id}
              request={request}
              dict={dict.dashboard}
              locale={locale as Locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
