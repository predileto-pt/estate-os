import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { IntakeFormRequestCard } from "./components/intake-form-request-card";
import { CreateIntakeFormRequestForm } from "./components/create-intake-form-request-form";
import type { IntakeFormRequestRow } from "@/lib/db-types";

const EXAMPLE_INTAKE_FORM_REQUEST: IntakeFormRequestRow = {
  id: "example-intake-form-request",
  agency_id: "example-agency",
  applicant_name: "Maria Silva",
  applicant_email: "maria.silva@exemplo.pt",
  applicant_phone: "+351912345678",
  property_id: "PROP-2024-001",
  property_type: "APARTAMENTO",
  listing_type: "ARRENDAMENTO",
  property_title: "T2 Apartamento Centro do Porto",
  property_price: 950,
  property_address: "RUA DE SANTA CATARINA N123 2D, SANTO ILDEFONSO, PORTO, PORTO, 4000-450, PORTUGAL",
  status: "completed",
  created_at: "2026-03-10T14:30:00Z",
  updated_at: "2026-03-11T09:15:00Z",
  submission: {
    id: "sub-example-001",
    status: "PROCESSED",
    created_at: "2026-03-11T09:15:00Z",
  },
};

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

  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  let requests: IntakeFormRequestRow[] = [];

  if (serviceUrl) {
    try {
      const response = await fetch(
        `${serviceUrl}/api/v1/intake-form-requests?agency_id=${user.id}&limit=50&offset=0`,
        { cache: "no-store" }
      );
      if (response.ok) {
        const data = await response.json();
        requests = data.map(
          (r: IntakeFormRequestRow & { status: string }) => ({
            ...r,
            status: r.status.toLowerCase() as IntakeFormRequestRow["status"],
          })
        );
      }
    } catch {
      // Fall through with empty requests
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold font-heading">
              {dict.dashboard.intakeFormRequests}
            </h1>
          </div>

          <CreateIntakeFormRequestForm dict={dict.dashboard} />

          {requests.length === 0 ? (
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-4">
                {dict.dashboard.noIntakeFormRequests}
              </p>
              <div className="relative opacity-70">
                <IntakeFormRequestCard
                  request={EXAMPLE_INTAKE_FORM_REQUEST}
                  dict={dict.dashboard}
                  locale={locale as Locale}
                  isExample
                />
              </div>
            </div>
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
        </div>
        <div className="col-span-4" />
      </div>
    </main>
  );
}
