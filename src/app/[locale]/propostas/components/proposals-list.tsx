"use client";

import { Suspense } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ProposalDetailProvider } from "./proposal-detail-context";
import { ProposalCard } from "./proposal-card";
import { ProposalDetailPanel } from "./proposal-detail-panel";
import { MOCK_PROPOSALS } from "./mock-data";

export function ProposalsList({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const proposals = MOCK_PROPOSALS;

  return (
    <Suspense>
      <ProposalDetailProvider>
        <h1 className="text-lg font-bold font-heading text-gray-900 mb-4">
          {dict.propostas}
        </h1>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>
        <ProposalDetailPanel proposals={proposals} />
      </ProposalDetailProvider>
    </Suspense>
  );
}
