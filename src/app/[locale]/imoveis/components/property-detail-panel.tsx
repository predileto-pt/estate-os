"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { usePropertyDetail, useSelectedProperty } from "./property-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/db-types";

export function PropertyDetailPanel({
  properties,
}: {
  properties: Property[];
}) {
  const selected = useSelectedProperty(properties);
  const { close } = usePropertyDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const listingTypeLabel: Record<string, string> = {
    venda: dict.contractSale,
    arrendamento: dict.contractRental,
  };

  const propertyTypeLabel: Record<string, string> = {
    apartamento: dict.apartment,
    moradia: dict.house,
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
                {selected.title}
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

            {/* Type badges */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {listingTypeLabel[selected.listing_type] ?? selected.listing_type}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {propertyTypeLabel[selected.property_type] ?? selected.property_type}
              </span>
            </div>

            {/* Address */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.address}</Small>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{selected.address}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
              <Small variant="label">{dict.price}</Small>
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.propertyValue}: </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(selected.property_value, locale)}
                </span>
              </div>
              {selected.monthly_rent != null && (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.monthlyRent}: </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(selected.monthly_rent, locale)}/{dict.month}
                  </span>
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
