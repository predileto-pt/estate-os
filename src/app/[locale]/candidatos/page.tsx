import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ApplicantList } from "./components/applicant-list";
import { ApplicantDetailProvider } from "./components/applicant-detail-context";
import { ApplicantDetailPanel } from "./components/applicant-detail-panel";
import type { Applicant } from "@/lib/db-types";

const EXAMPLE_APPLICANT: Applicant = {
  id: "example-applicant",
  name: "Joao Costa",
  email: "joao.costa@exemplo.pt",
  phone: "+351923456789",
  owner_id: "example-agency",
  form_request_id: "example-intake-form-request",
  property_type: "ARRENDAMENTO",
  property_value: 185000,
  monthly_rent: 850,
  status: "completed",
  screening_report: {
    applicant_id: "example-applicant",
    risk_level: "LOW",
    identity_verified: true,
    income_verified: true,
    dti_ratio: 0.28,
    justification: "Histórico de emprego estável com rendimento consistente. Rácio DTI dentro do intervalo aceitável para imóvel de arrendamento.",
    property_type: "ARRENDAMENTO",
    average_monthly_income: 2400,
  },
};

export default async function CandidatosPage({
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
  let applicants: Applicant[] = [];

  if (serviceUrl) {
    try {
      const response = await fetch(
        `${serviceUrl}/api/v1/applicants?owner_id=${user.id}`,
        { cache: "no-store" },
      );
      if (response.ok) {
        applicants = await response.json();
      }
    } catch {
      // Fall through with empty applicants
    }
  }

  const showExample = applicants.length === 0;

  return (
    <Suspense>
      <ApplicantDetailProvider applicants={applicants}>
        <div>
          <h1 className="text-lg font-bold font-heading mb-4">
            {dict.dashboard.candidatos}
          </h1>
          {showExample ? (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                {dict.dashboard.noCandidatos}
              </p>
              <div className="relative opacity-70">
                <ApplicantList
                  applicants={[EXAMPLE_APPLICANT]}
                  dict={dict.dashboard}
                  locale={locale as Locale}
                  isExample
                />
              </div>
            </div>
          ) : (
            <ApplicantList
              applicants={applicants}
              dict={dict.dashboard}
              locale={locale as Locale}
            />
          )}
        </div>
        <ApplicantDetailPanel applicants={applicants} />
      </ApplicantDetailProvider>
    </Suspense>
  );
}
