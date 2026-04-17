"use client";

import type { Contract } from "@/lib/db-types";
import type { Dictionary } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { useContractDetail } from "./contract-detail-context";

export function ContractCard({
  contract,
  dict,
}: {
  contract: Contract;
  dict: Dictionary["dashboard"];
}) {
  const locale = useLocale();
  const { selectedId, select } = useContractDetail();
  const isSelected = selectedId === contract.uuid;

  const typeLabel: Record<string, string> = {
    venda: dict.contractSale,
    arrendamento: dict.contractRental,
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
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
              {typeLabel[contract.type] ?? contract.type}
            </span>
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded",
                contract.is_signed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500",
              )}
            >
              {contract.is_signed ? dict.contractSigned : dict.contractNotSigned}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(contract.created_at, locale)}
          </span>
        </div>
      </div>

      {/* Property */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1">
        <p className="text-xs font-medium text-gray-700">{contract.property.property_title}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{contract.property.property_address}</span>
        </div>
        <div className="text-xs text-gray-500">
          {contract.type === "venda" && contract.property.property_value != null ? (
            <>
              <span className="text-gray-400">{dict.propertyValue}: </span>
              <span className="font-medium text-gray-700">{formatPrice(contract.property.property_value, locale)}</span>
            </>
          ) : contract.property.monthly_rent != null ? (
            <>
              <span className="text-gray-400">{dict.monthlyRent}: </span>
              <span className="font-medium text-gray-700">{formatPrice(contract.property.monthly_rent, locale)}/{dict.month}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Parties */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1">
        {contract.type === "arrendamento" ? (
          <>
            {contract.landlord && (
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.contractLandlord}: </span>
                <span className="font-medium text-gray-700">{contract.landlord.full_name}</span>
              </div>
            )}
            {contract.tenant && (
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.contractTenant}: </span>
                <span className="font-medium text-gray-700">{contract.tenant.full_name}</span>
              </div>
            )}
          </>
        ) : (
          <>
            {contract.seller && (
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.contractSeller}: </span>
                <span className="font-medium text-gray-700">{contract.seller.full_name}</span>
              </div>
            )}
            {contract.buyer && (
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.contractBuyer}: </span>
                <span className="font-medium text-gray-700">{contract.buyer.full_name}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={contract.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {dict.view}
          </a>
          <a
            href={contract.url}
            download
            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {dict.download}
          </a>
        </div>
        <div className="flex items-center gap-2">
          {!contract.is_signed && (
            <Button
              variant="steel"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: send signature request emails to parties
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {dict.contractRequestSignatures}
            </Button>
          )}
          <Button variant="steel" onClick={() => select(contract)}>
            {dict.details}
          </Button>
        </div>
      </div>
    </div>
  );
}
