"use client";

import { AgendamentosSidebar } from "@/app/[locale]/dashboard/agendamentos/components/agendamentos-sidebar";

export function DashboardSidebar() {
  return (
    <div className="border border-gray-200 bg-white p-4">
      <AgendamentosSidebar />
    </div>
  );
}
