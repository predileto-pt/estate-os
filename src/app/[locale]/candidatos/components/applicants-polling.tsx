"use client";

import { useQuery } from "@tanstack/react-query";
import type { Applicant } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ApplicantList } from "./applicant-list";
import { ApplicantDetailProvider } from "./applicant-detail-context";
import { ApplicantDetailPanel } from "./applicant-detail-panel";
import { fetchApplicants } from "../actions";

const EXAMPLE_APPLICANT: Applicant = {
  id: "example-applicant",
  name: "Joao Costa",
  email: "joao.costa@exemplo.pt",
  phone: "+351923456789",
  organization_id: "example-agency",
  form_request_id: "example-intake-form-request",
  listing_type: "ARRENDAMENTO",
  property_type: "APARTAMENTO",
  property_value: 185000,
  monthly_rent: 850,
  property_title: "Apartamento T2 em Cedofeita",
  property_address: "RUA DE CEDOFEITA N45 3E, CEDOFEITA, PORTO, PORTO, 4050-180, PORTUGAL",
  status: "completed",
  screening_report: {
    applicant_id: "example-applicant",
    risk_level: "LOW",
    identity_verified: true,
    income_verified: true,
    dti_ratio: 0.28,
    justification:
      "Histórico de emprego estável com rendimento consistente. Rácio DTI dentro do intervalo aceitável para imóvel de arrendamento.",
    listing_type: "ARRENDAMENTO",
    property_type: "APARTAMENTO",
    average_monthly_income: 2400,
  },
};

export function ApplicantsPolling({
  organizationId,
  initialApplicants,
  dict,
  locale,
}: {
  organizationId: string;
  initialApplicants: Applicant[];
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const { data: applicants = initialApplicants } = useQuery({
    queryKey: ["applicants", organizationId],
    queryFn: async () => {
      const result = await fetchApplicants(organizationId);
      if (result.error !== null) throw new Error(result.error);
      return result.data;
    },
    initialData: initialApplicants,
    refetchInterval: 5000,
  });

  const showExample = applicants.length === 0;

  return (
    <ApplicantDetailProvider applicants={applicants}>
      <div>
        <h1 className="text-lg font-bold font-heading mb-4">
          {dict.candidatos}
        </h1>
        {showExample ? (
          <div>
            <p className="text-sm text-gray-400 mb-4">
              {dict.noCandidatos}
            </p>
            <div className="relative opacity-70">
              <ApplicantList
                applicants={[EXAMPLE_APPLICANT]}
                dict={dict}
                locale={locale}
              />
            </div>
          </div>
        ) : (
          <ApplicantList
            applicants={applicants}
            dict={dict}
            locale={locale}
          />
        )}
      </div>
      <ApplicantDetailPanel applicants={applicants} />
    </ApplicantDetailProvider>
  );
}
