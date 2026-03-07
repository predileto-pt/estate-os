"use client";

import type { AgendamentoRow } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { AgendamentoCard } from "./agendamento-card";

export function AgendamentoList({
  agendamentos,
  dict,
  status,
  locale,
}: {
  agendamentos: AgendamentoRow[];
  dict: Dictionary["dashboard"];
  status: string;
  locale: Locale;
}) {
  if (agendamentos.length === 0) {
    return (
      <p className="text-sm text-gray-400">{dict.noAgendamentos}</p>
    );
  }

  return (
    <div className="space-y-4">
      {agendamentos.map((a) => (
        <AgendamentoCard key={a.id} agendamento={a} dict={dict} locale={locale} />
      ))}
    </div>
  );
}
