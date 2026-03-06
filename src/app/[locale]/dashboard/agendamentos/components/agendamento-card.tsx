"use client";

import { useTransition } from "react";
import type { AgendamentoRow } from "@/lib/db-types";
import type { Dictionary } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { approveAgendamento, rejectAgendamento } from "../actions";

export function AgendamentoCard({
  agendamento,
  dict,
}: {
  agendamento: AgendamentoRow;
  dict: Dictionary["dashboard"];
}) {
  const [pending, startTransition] = useTransition();
  const a = agendamento;

  function handleApprove() {
    startTransition(() => approveAgendamento(a.id));
  }

  function handleReject() {
    startTransition(() => rejectAgendamento(a.id));
  }

  return (
    <div className="border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold font-heading text-blue-600">
          {a.visitor_name}
        </h3>
        <Badge>{a.property_title}</Badge>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{dict.idDocument}</span>
          <span className={a.has_id_document ? "text-green-600" : "text-red-600"}>
            {a.has_id_document ? dict.yes : dict.no}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{dict.proofOfIncome}</span>
          <span className={a.has_proof_of_income ? "text-green-600" : "text-red-600"}>
            {a.has_proof_of_income ? dict.yes : dict.no}
          </span>
        </div>
      </div>

      {a.message && (
        <p className="text-xs text-gray-400 mb-3">{a.message}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={pending}
          className="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {dict.approve}
        </button>
        <button
          onClick={handleReject}
          disabled={pending}
          className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          {dict.reject}
        </button>
      </div>
    </div>
  );
}
