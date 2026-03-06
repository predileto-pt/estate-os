import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { AgendamentoList } from "./components/agendamento-list";

export default async function AgendamentosPage({
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

  const { data: agendamentos } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("agency_id", user!.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-bold font-heading mb-4">
        {dict.dashboard.agendamentos}
      </h1>
      <AgendamentoList
        agendamentos={agendamentos ?? []}
        dict={dict.dashboard}
      />
    </div>
  );
}
