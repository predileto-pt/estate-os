"use client";

import type { Dictionary, Locale } from "@/lib/i18n";
import { ContractDetailProvider } from "./contract-detail-context";
import { ContractCard } from "./contract-card";
import { ContractDetailPanel } from "./contract-detail-panel";
import { FAKE_CONTRACTS } from "./fake-data";

export function ContractsPageContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const contracts = FAKE_CONTRACTS;

  return (
    <ContractDetailProvider contracts={contracts}>
      <div>
        <h1 className="text-lg font-bold font-heading mb-4">
          {dict.contratos}
        </h1>
        {contracts.length === 0 ? (
          <p className="text-sm text-gray-400">{dict.noContracts}</p>
        ) : (
          <div className="space-y-4">
            {contracts.map((c) => (
              <ContractCard key={c.uuid} contract={c} dict={dict} locale={locale} />
            ))}
          </div>
        )}
      </div>
      <ContractDetailPanel contracts={contracts} />
    </ContractDetailProvider>
  );
}
