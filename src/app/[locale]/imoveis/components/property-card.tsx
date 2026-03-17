"use client";

import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { usePropertyDetail } from "./property-detail-context";

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

export function PropertyCard({
  property,
  dict,
  locale,
}: {
  property: PropertyResponse;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const { selectedId, select } = usePropertyDetail();
  const isSelected = selectedId === property.id;

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

  const chars = property.characteristics;

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white transition-shadow",
        STATUS_STYLES[property.status]
          ? `border-l-current`
          : "border-l-gray-300",
        property.status === "active" && "border-l-emerald-500",
        property.status === "draft" && "border-l-gray-400",
        property.status === "sold" && "border-l-blue-500",
        property.status === "rented" && "border-l-violet-500",
        property.status === "withdrawn" && "border-l-red-400",
        isSelected && "ring-2 ring-blue-400 ring-offset-1",
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold font-heading text-gray-900 truncate">
            {property.address}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn("inline-block px-2 py-0.5 text-xs font-medium rounded", STATUS_STYLES[property.status])}>
              {statusLabel[property.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Type + Characteristics row */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
          {listingTypeLabel[property.listing_type] ?? property.listing_type}
        </span>
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
          {typologyLabel[property.typology] ?? property.typology}
        </span>

        {chars && (
          <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
            {chars.area_in_m2 != null && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                {chars.area_in_m2} m²
              </span>
            )}
            {chars.num_of_bedrooms != null && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
                </svg>
                {chars.num_of_bedrooms}
              </span>
            )}
            {chars.num_of_bathrooms != null && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                  <line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" />
                  <line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" />
                </svg>
                {chars.num_of_bathrooms}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Owners */}
      {property.owners.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100 space-y-1">
          <span className="text-xs text-gray-400">{dict.owners}</span>
          {property.owners.map((owner) => (
            <div key={owner.id} className="flex items-center gap-2 text-xs">
              <span className="font-medium text-gray-700">{owner.full_name}</span>
              <span className="inline-block px-2 py-0.5 font-medium rounded bg-blue-50 text-blue-600">
                {formatNif(owner.nif)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatDate(property.created_at, locale)}
        </span>
        <Button variant="steel" onClick={() => select(property)}>
          {dict.details}
        </Button>
      </div>
    </div>
  );
}
