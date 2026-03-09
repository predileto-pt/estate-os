import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ApplicantList } from "./components/applicant-list";
import type { Applicant } from "@/lib/db-types";

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

  return (
    <div>
      <h1 className="text-lg font-bold font-heading mb-4">
        {dict.dashboard.candidatos}
      </h1>
      <ApplicantList
        applicants={applicants}
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </div>
  );
}
