import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ApplicantList } from "./components/applicant-list";
import { getMockApplicants } from "./mock-data";
import type { ApplicantStatus } from "@/lib/db-types";

const validStatuses: ApplicantStatus[] = ["pending", "approved", "rejected"];

export default async function CandidatosPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status: statusParam } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  const supabase = await createClient();

  const status =
    statusParam && [...validStatuses, "all"].includes(statusParam)
      ? statusParam
      : "pending";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isTester =
    process.env.TESTER_EMAIL && user?.email === process.env.TESTER_EMAIL;

  let applicants;

  if (isTester) {
    const mock = getMockApplicants();
    applicants =
      status === "all"
        ? mock
        : mock.filter((a) => a.status === status);
  } else {
    let query = supabase
      .from("agendamentos")
      .select("*")
      .eq("agency_id", user!.id)
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data } = await query;
    applicants = data ?? [];
  }

  return (
    <div>
      <h1 className="text-lg font-bold font-heading mb-4">
        {dict.dashboard.candidatos}
      </h1>
      <ApplicantList
        applicants={applicants}
        dict={dict.dashboard}
        status={status}
        locale={locale as Locale}
      />
    </div>
  );
}
