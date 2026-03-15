"use client";

import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ClientDetailProvider } from "./client-detail-context";
import { ClientList } from "./client-list";
import { ClientDetailPanel } from "./client-detail-panel";
import { FAKE_CLIENTS } from "./fake-data";

export function ClientsPageContent({
  dict,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const clients = FAKE_CLIENTS;

  return (
    <ClientDetailProvider clients={clients}>
      <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2" />
          <div className="col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold font-heading">
                {dict.clientes}
              </h1>
              <Button variant="primary">
                {dict.addClient}
              </Button>
            </div>
            <ClientList clients={clients} dict={dict} />
          </div>
          <div className="col-span-2" />
        </div>
      </main>
      <ClientDetailPanel clients={clients} />
    </ClientDetailProvider>
  );
}
