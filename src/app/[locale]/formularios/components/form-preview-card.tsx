"use client";

import type { Dictionary } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormPreview } from "./form-preview-context";

function Value({
  value,
  width,
  field,
}: {
  value: string | number | undefined;
  width?: string;
  field?: string;
}) {
  if (!value && value !== 0)
    return (
      <Skeleton
        className={width}
        data-testid={field ? `skeleton-${field}` : undefined}
      />
    );
  return (
    <span
      className="text-gray-900"
      data-testid={field ? `value-${field}` : undefined}
    >
      {value}
    </span>
  );
}

export function FormPreviewCard({ dict }: { dict: Dictionary["dashboard"] }) {
  const { open, values } = useFormPreview();

  if (!open) return null;

  const propertyTypeLabel: Record<string, string> = {
    MORADIA: dict.house,
    APARTAMENTO: dict.apartment,
    TERRENO: dict.land,
  };

  const listingTypeLabel: Record<string, string> = {
    VENDA: dict.sale,
    ARRENDAMENTO: dict.rental,
  };

  return (
    <div className="sticky top-6" data-testid="form-preview-card">
      <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading text-gray-900">
              <Value
                value={values.applicant_name}
                width="w-32"
                field="applicant_name"
              />
            </h3>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
              {dict.pending}
            </span>
          </div>
        </div>

        {/* Contact */}
        <div className="px-4 py-3 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <Value
              value={values.applicant_email}
              width="w-40"
              field="applicant_email"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <Value
              value={
                values.applicant_phone
                  ? values.applicant_phone
                      .replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1 $2 $3")
                      .replace(/^(\d{3})(\d{1,3})$/, "$1 $2")
                  : undefined
              }
              width="w-28"
              field="applicant_phone"
            />
          </div>
        </div>

        {/* Property details */}
        <div className="px-4 py-3 border-b border-gray-100 space-y-2">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.propertyId}: </span>
            <Value
              value={values.property_id}
              width="w-20"
              field="property_id"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.propertyType}: </span>
              <Value
                value={
                  values.property_type
                    ? (propertyTypeLabel[values.property_type] ??
                      values.property_type)
                    : undefined
                }
                width="w-16"
                field="property_type"
              />
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.listingType}: </span>
              <Value
                value={
                  values.listing_type
                    ? (listingTypeLabel[values.listing_type] ??
                      values.listing_type)
                    : undefined
                }
                width="w-16"
                field="listing_type"
              />
            </div>
          </div>
          {(values.property_title || !values.property_id) && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.propertyTitle}: </span>
              <Value
                value={values.property_title}
                width="w-36"
                field="property_title"
              />
            </div>
          )}
          {(values.property_price || !values.property_id) && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.propertyPrice}: </span>
              <Value
                value={
                  values.property_price
                    ? `€${values.property_price.toLocaleString()}`
                    : undefined
                }
                width="w-16"
                field="property_price"
              />
            </div>
          )}
        </div>

        {/* Address */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <Value
              value={values.property_address}
              width="w-48"
              field="property_address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
