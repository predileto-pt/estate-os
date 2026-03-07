"use client";

import { usePathname } from "next/navigation";
import { AgendamentosSidebar } from "@/app/[locale]/dashboard/agendamentos/components/agendamentos-sidebar";
import { SettingsSidebar } from "@/app/[locale]/dashboard/settings/components/settings-sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const isSettings = pathname.includes("/settings");

  return (
    <div className="border border-gray-200 bg-white p-4">
      {isSettings ? <SettingsSidebar /> : <AgendamentosSidebar />}
    </div>
  );
}
