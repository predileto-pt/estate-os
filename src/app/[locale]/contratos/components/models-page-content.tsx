"use client";

import type { ContractModel } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { useDictionary } from "@/components/dictionary-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { ContractModelCard } from "./contract-model-card";
import { ContractModelDetailProvider } from "./contract-model-detail-context";
import { ContractModelDetailPanel } from "./contract-model-detail-panel";

const sparkleIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const penIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const focusIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);

export function ModelsPageContent({
  models,
  dict,
  locale,
}: {
  models: ContractModel[];
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const d = useDictionary().dashboard;

  return (
    <ContractModelDetailProvider>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold font-heading">
            {dict.contractModels}
          </h1>
          <Link href={`/${locale}/contratos/modelos/novo`}>
            <Button variant="primary">{dict.addContractModel}</Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FeatureCard
            imageSrc="/images/extract_transparent.png"
            imageAlt="Extract"
            icon={sparkleIcon}
            title={d.extractTitle}
            description={d.extractDescription}
          />
          <FeatureCard
            imageSrc="/images/edit_transparent.png"
            imageAlt="Edit"
            icon={penIcon}
            title={d.editTitle}
            description={d.editDescription}
          />
          <FeatureCard
            imageSrc="/images/parse_transparent.png"
            imageAlt="Parse"
            icon={focusIcon}
            title={d.parseTitle}
            description={d.parseDescription}
          />
        </div>
        {models.length === 0 ? (
          <p className="text-sm text-gray-400">{dict.noContractModels}</p>
        ) : (
          <div className="space-y-4">
            {models.map((m) => (
              <ContractModelCard
                key={m.uuid}
                model={m}
                dict={dict}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
      <ContractModelDetailPanel models={models} />
    </ContractModelDetailProvider>
  );
}
