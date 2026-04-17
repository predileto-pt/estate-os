import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { getOrganizationId, getAuthHeaders } from "@/lib/api/auth";
import { IntakeFormRequestCard } from "./components/intake-form-request-card";
import { CreateIntakeFormRequestForm } from "./components/create-intake-form-request-form";
import { FormPreviewProvider } from "./components/form-preview-context";
import { FormPreviewCard } from "./components/form-preview-card";
import type { IntakeFormRequestRow } from "@/lib/db-types";

const EXAMPLE_INTAKE_FORM_REQUEST: IntakeFormRequestRow = {
  id: "example-intake-form-request",
  organization_id: "example-agency",
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

export default async function IntakeFormRequestsPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const organizationId = await getOrganizationId();

  if (!organizationId) return null;

  const apiUrl = process.env.API_URL || "http://localhost";
  let requests: IntakeFormRequestRow[] = [];

  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(
      `${apiUrl}/api/v1/applicants/intake-form-requests?organization_id=${organizationId}&limit=50&offset=0`,
      { cache: "no-store", headers: authHeaders ?? undefined }
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

  return (
    <FormPreviewProvider>
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
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-4">
          <FormPreviewCard dict={dict.dashboard} />
        </div>
      </div>
    </main>
    </FormPreviewProvider>
  );
}
