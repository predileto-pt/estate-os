"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { usePropertyDetail, useSelectedProperty } from "./property-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { components } from "@/lib/api-types";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type PropertyStatus = components["schemas"]["PropertyStatus"];

function formatNif(nif: string) {
  const digits = nif.replace(/\D/g, "");
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

const STATUS_STYLES: Record<PropertyStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-emerald-50 text-emerald-700",
  sold: "bg-blue-50 text-blue-700",
  rented: "bg-violet-50 text-violet-700",
  withdrawn: "bg-red-50 text-red-600",
};

export function PropertyDetailPanel({
  properties,
}: {
  properties: PropertyResponse[];
}) {
  const selected = useSelectedProperty(properties);
  const { close } = usePropertyDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const listingTypeLabel: Record<string, string> = {
    sale: dict.sale,
    purchase: dict.purchase,
  };

  const typologyLabel: Record<string, string> = {
    house: dict.house,
    apartment: dict.apartment,
    land: dict.land,
    ruin: dict.ruin,
  };

  const statusLabel: Record<PropertyStatus, string> = {
    draft: dict.propertyStatusDraft,
    active: dict.propertyStatusActive,
    sold: dict.propertyStatusSold,
    rented: dict.propertyStatusRented,
    withdrawn: dict.propertyStatusWithdrawn,
  };

  const civilStatusLabel: Record<string, string> = {
    single: dict.civilStatusSingle,
    married: dict.civilStatusMarried,
    divorced: dict.civilStatusDivorced,
    widowed: dict.civilStatusWidowed,
    civil_union: dict.civilStatusCivilUnion,
    separated: dict.civilStatusSeparated,
  };

  const chars = selected?.characteristics;

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
                {selected.address}
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

            {/* Status + Type badges */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[selected.status]}`}>
                {statusLabel[selected.status]}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {listingTypeLabel[selected.listing_type] ?? selected.listing_type}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {typologyLabel[selected.typology] ?? selected.typology}
              </span>
            </div>

            {/* Description */}
            {selected.description && (
              <div className="px-4 py-3 border-b border-gray-100">
                <Small variant="label">{dict.description}</Small>
                <p className="text-xs text-gray-600 mt-1">{selected.description}</p>
              </div>
            )}

            {/* Characteristics */}
            {chars && (
              <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
                <Small variant="label">{dict.characteristics}</Small>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {chars.area_in_m2 != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.areaM2}: </span>
                      <span className="font-medium text-gray-900">{chars.area_in_m2} m²</span>
                    </div>
                  )}
                  {chars.num_of_bedrooms != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.bedrooms}: </span>
                      <span className="font-medium text-gray-900">{chars.num_of_bedrooms}</span>
                    </div>
                  )}
                  {chars.num_of_bathrooms != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.bathrooms}: </span>
                      <span className="font-medium text-gray-900">{chars.num_of_bathrooms}</span>
                    </div>
                  )}
                  {chars.floor != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.floor}: </span>
                      <span className="font-medium text-gray-900">{chars.floor}</span>
                    </div>
                  )}
                  {chars.built_at != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.builtAt}: </span>
                      <span className="font-medium text-gray-900">{chars.built_at}</span>
                    </div>
                  )}
                  {chars.energy_rating != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.energyRating}: </span>
                      <span className="font-medium text-gray-900">{chars.energy_rating}</span>
                    </div>
                  )}
                  {chars.parking_spaces != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.parkingSpaces}: </span>
                      <span className="font-medium text-gray-900">{chars.parking_spaces}</span>
                    </div>
                  )}
                </div>
                {/* Boolean amenities */}
                <div className="flex items-center gap-3 mt-1">
                  {chars.has_elevator && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                      {dict.hasElevator}
                    </span>
                  )}
                  {chars.has_garden && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                      {dict.hasGarden}
                    </span>
                  )}
                  {chars.has_pool && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                      {dict.hasPool}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Owners */}
            {selected.owners.length > 0 && (
              <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                <Small variant="label">{dict.owners}</Small>
                {selected.owners.map((owner) => (
                  <div key={owner.id} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">{owner.full_name}</span>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600">
                        {formatNif(owner.nif)}
                      </span>
                    </div>
                    {owner.civil_status && (
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-400">{dict.civilStatus}: </span>
                        {civilStatusLabel[owner.civil_status] ?? owner.civil_status}
                      </div>
                    )}
                    {owner.date_of_birth && (
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-400">{dict.dateOfBirth}: </span>
                        {formatDate(owner.date_of_birth, locale)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{dict.ownerAddress}: </span>{owner.address}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dates + ID */}
            <div className="px-4 py-3 space-y-1">
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.createdAt}: </span>
                {formatDate(selected.created_at, locale)}
              </div>
              <div className="text-xs font-mono text-gray-400 truncate">
                ID: {selected.id}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
