"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useContractDetail, useSelectedContract } from "./contract-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { Contract, Person } from "@/lib/db-types";

function PersonSection({ person, label }: { person: Person; label: string }) {
  return (
    <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2 space-y-1">
      <p className="text-xs font-medium text-gray-700">{label}: {person.full_name}</p>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        {person.email}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        {person.phone_number}
      </div>
      <div className="text-xs text-gray-500">
        <span className="text-gray-400">NIF: </span>
        <span className="font-medium text-gray-700">{person.nif}</span>
      </div>
    </div>
  );
}

export function ContractDetailPanel({
  contracts,
}: {
  contracts: Contract[];
}) {
  const selected = useSelectedContract(contracts);
  const { close } = useContractDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const typeLabel: Record<string, string> = {
    venda: dict.contractSale,
    arrendamento: dict.contractRental,
  };

  return (
    <AnimatePresence>
      {selected && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={close}
          />

          <motion.aside
            key="sidebar"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[420px] bg-white border-l border-gray-200 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                  {typeLabel[selected.type] ?? selected.type}
                </span>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 text-xs font-medium rounded",
                    selected.is_signed
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {selected.is_signed ? dict.contractSigned : dict.contractNotSigned}
                </span>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={dict.close}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Date */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.createdAt}: </span>
                <span className="font-medium text-gray-700">{formatDate(selected.created_at, locale)}</span>
              </div>
            </div>

            {/* Property */}
            <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
              <Small variant="label">{dict.property}</Small>
              <p className="text-xs font-medium text-gray-700 mt-1">{selected.property.property_title}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate">{selected.property.property_address}</span>
              </div>
              {selected.type === "venda" && selected.property.property_value != null ? (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.propertyValue}: </span>
                  <span className="font-medium text-gray-900">{formatPrice(selected.property.property_value, locale)}</span>
                </div>
              ) : selected.property.monthly_rent != null ? (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.monthlyRent}: </span>
                  <span className="font-medium text-gray-900">{formatPrice(selected.property.monthly_rent, locale)}/{dict.month}</span>
                </div>
              ) : null}
            </div>

            {/* Parties */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">
                {selected.type === "arrendamento"
                  ? `${dict.contractLandlord} / ${dict.contractTenant}`
                  : `${dict.contractSeller} / ${dict.contractBuyer}`}
              </Small>
              <div className="mt-2 space-y-2">
                {selected.type === "arrendamento" ? (
                  <>
                    {selected.landlord && (
                      <PersonSection person={selected.landlord} label={dict.contractLandlord} />
                    )}
                    {selected.tenant && (
                      <PersonSection person={selected.tenant} label={dict.contractTenant} />
                    )}
                  </>
                ) : (
                  <>
                    {selected.seller && (
                      <PersonSection person={selected.seller} label={dict.contractSeller} />
                    )}
                    {selected.buyer && (
                      <PersonSection person={selected.buyer} label={dict.contractBuyer} />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* URL */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">URL</Small>
              <p className="text-xs text-blue-400 mt-1 truncate">{selected.url}</p>
            </div>

            {/* ID */}
            <div className="px-4 py-3">
              <div className="text-xs font-mono text-gray-400 truncate">
                ID: {selected.uuid}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
