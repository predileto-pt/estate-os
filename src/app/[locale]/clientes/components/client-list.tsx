"use client";

import type { Client } from "@/lib/db-types";
import type { Dictionary } from "@/lib/i18n";
import { ClientCard } from "./client-card";

export function ClientList({
  clients,
  dict,
}: {
  clients: Client[];
  dict: Dictionary["dashboard"];
}) {
  if (clients.length === 0) {
    return (
      <p className="text-sm text-gray-400">{dict.noClients}</p>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((c) => (
        <ClientCard key={c.uuid} client={c} dict={dict} />
      ))}
    </div>
  );
}
