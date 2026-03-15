"use client";

import type { Property } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { usePropertyDetail } from "./property-detail-context";

export function PropertyCard({
  property,
  dict,
  locale,
}: {
  property: Property;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const { selectedId, select } = usePropertyDetail();
  const isSelected = selectedId === property.uuid;

  const listingTypeLabel: Record<string, string> = {
    venda: dict.contractSale,
    arrendamento: dict.contractRental,
  };

  const propertyTypeLabel: Record<string, string> = {
    apartamento: dict.apartment,
    moradia: dict.house,
  };

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 border-l-gray-300 bg-white transition-shadow",
        isSelected && "ring-2 ring-blue-400 ring-offset-1",
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-gray-900">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
              {listingTypeLabel[property.listing_type] ?? property.listing_type}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
              {propertyTypeLabel[property.property_type] ?? property.property_type}
            </span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{property.address}</span>
        </div>
      </div>

      {/* Price */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="text-gray-400">{dict.price}: </span>
          {property.listing_type === "venda" ? (
            <span className="font-medium text-gray-900">{formatPrice(property.property_value, locale)}</span>
          ) : (
            <span className="font-medium text-gray-900">{formatPrice(property.monthly_rent!, locale)}/{dict.month}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
        <Button variant="steel" onClick={() => select(property)}>
          {dict.details}
        </Button>
      </div>
    </div>
  );
}
