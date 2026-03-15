"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useClientDetail, useSelectedClient } from "./client-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { Client } from "@/lib/db-types";

export function ClientDetailPanel({
  clients,
}: {
  clients: Client[];
}) {
  const selected = useSelectedClient(clients);
  const { close } = useClientDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const listingTypeLabel: Record<string, string> = {
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
              <h2 className="text-sm font-bold font-heading text-gray-900 truncate">
                {selected.person.full_name}
              </h2>
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

            {/* Contact */}
            <div className="px-4 py-3 border-b border-gray-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                {selected.person.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                {selected.person.phone_number}
              </span>
            </div>

            {/* Personal info */}
            <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.clientNif}: </span>
                <span className="font-medium text-gray-700">{selected.person.nif}</span>
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.dateOfBirth}: </span>
                <span className="font-medium text-gray-700">{selected.person.date_of_birth}</span>
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.documentId}: </span>
                <span className="font-medium text-gray-700">{selected.person.document_id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate">{selected.person.address}</span>
              </div>
            </div>

            {/* Properties */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.properties}</Small>
              {selected.properties.length === 0 ? (
                <p className="text-xs text-gray-400 mt-1">{dict.noProperties}</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {selected.properties.map((prop) => (
                    <div key={prop.uuid} className="rounded border border-gray-100 bg-gray-50 px-3 py-2 space-y-1">
                      <p className="text-xs font-medium text-gray-700">{prop.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-200 text-gray-600">
                          {listingTypeLabel[prop.listing_type] ?? prop.listing_type}
                        </span>
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-200 text-gray-600">
                          {prop.property_type === "apartamento" ? dict.apartment : dict.house}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {prop.listing_type === "venda" ? (
                          <span className="font-medium text-gray-700">{formatPrice(prop.property_value, locale)}</span>
                        ) : (
                          <span className="font-medium text-gray-700">{formatPrice(prop.monthly_rent!, locale)}/{dict.month}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="truncate">{prop.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
