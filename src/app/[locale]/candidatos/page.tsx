import { Suspense } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getOrganizationId } from "@/lib/api/auth";
import { ApplicantsPolling } from "./components/applicants-polling";
import { fetchApplicants } from "./actions";

export default async function CandidatosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const organizationId = await getOrganizationId();

  if (!organizationId) return null;

  const result = await fetchApplicants(organizationId);
  const applicants = result.error === null ? result.data : [];

  return (
    <Suspense>
      <ApplicantsPolling
        organizationId={organizationId}
        initialApplicants={applicants}
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
