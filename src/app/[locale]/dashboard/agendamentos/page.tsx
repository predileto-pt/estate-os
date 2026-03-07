import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { AgendamentoList } from "./components/agendamento-list";
import { getMockAgendamentos } from "./mock-data";
import type { AgendamentoStatus } from "@/lib/db-types";

const validStatuses: AgendamentoStatus[] = ["pending", "approved", "rejected"];

export default async function AgendamentosPage({
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

  let agendamentos;

  if (isTester) {
    const mock = getMockAgendamentos();
    agendamentos =
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
    agendamentos = data ?? [];
  }

  return (
    <div>
      <h1 className="text-lg font-bold font-heading mb-4">
        {dict.dashboard.agendamentos}
      </h1>
      <AgendamentoList
        agendamentos={agendamentos}
        dict={dict.dashboard}
        status={status}
        locale={locale as Locale}
      />
    </div>
  );
}
