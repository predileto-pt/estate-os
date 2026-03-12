import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ApplicantsPolling } from "./components/applicants-polling";
import { fetchApplicants } from "./actions";

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

  const applicants = await fetchApplicants(user.id);

  return (
    <Suspense>
      <ApplicantsPolling
        userId={user.id}
        initialApplicants={applicants}
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
