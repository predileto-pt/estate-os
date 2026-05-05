"use client";

import type { Dictionary } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/small";
import { cn, formatPrice } from "@/lib/utils";
import { useProposalDetail } from "./proposal-detail-context";
import type { Proposal } from "./proposal-types";

const statusStyles: Record<Proposal["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  partially_signed: "bg-blue-100 text-blue-700",
  signed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-700",
};

export function ProposalCard({
  proposal,
  dict,
}: {
  proposal: Proposal;
  dict: Dictionary["dashboard"];
}) {
  const locale = useLocale();
  const { selectedId, select } = useProposalDetail();
  const p = proposal;
  const isSelected = selectedId === p.id;

  const statusLabel: Record<Proposal["status"], string> = {
    pending: dict.proposalPending,
    partially_signed: dict.proposalPartiallySigned,
    signed: dict.proposalSigned,
    expired: dict.expired,
    cancelled: dict.proposalCancelled,
  };

  const propertyTypeLabel: Record<string, string> = {
    ARRENDAMENTO: dict.rental,
    VENDA: dict.purchase,
  };

  const borderColor: Record<Proposal["status"], string> = {
    pending: "border-l-yellow-400",
    partially_signed: "border-l-blue-400",
    signed: "border-l-green-500",
    expired: "border-l-gray-300",
    cancelled: "border-l-red-400",
  };

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white transition-shadow",
        borderColor[p.status],
        isSelected && "ring-2 ring-blue-400 ring-offset-1",
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-gray-900">
            {p.property.title}
          </h3>
          <span
            className={cn(
              "inline-block px-2 py-0.5 text-xs font-medium rounded",
              statusStyles[p.status],
            )}
          >
            {statusLabel[p.status]}
          </span>
        </div>
      </div>

      {/* Property details */}
      <div className="px-4 py-3 border-b border-gray-100">
        <Small variant="label">{dict.property}</Small>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.propertyType}: </span>
            {propertyTypeLabel[p.property.type] ?? p.property.type}
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.propertyValue}: </span>
            <span className="font-medium text-gray-700">
              {formatPrice(p.property.value, locale)}
            </span>
          </div>
          {p.property.monthlyRent != null && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.monthlyRent}: </span>
              <span className="font-medium text-gray-700">
                {formatPrice(p.property.monthlyRent, locale)}/{dict.month}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{p.property.address}</span>
        </div>
      </div>

      {/* Owner */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Small variant="label">{dict.proposalOwner}</Small>
          {p.owner.signed ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {dict.contractSigned}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" /><path d="M8 12h8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" /></svg>
              {dict.proposalAwaitingSignature}
            </span>
          )}
        </div>
        <div className="space-y-1 mt-1">
          <p className="text-xs font-medium text-gray-700">{p.owner.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {p.owner.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {p.owner.phone}
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.nif}: </span>
            {p.owner.nif}
          </div>
        </div>
      </div>

      {/* Applicant */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Small variant="label">{dict.proposalApplicant}</Small>
          {p.applicant.signed ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {dict.contractSigned}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" /><path d="M8 12h8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" /></svg>
              {dict.proposalAwaitingSignature}
            </span>
          )}
        </div>
        <div className="space-y-1 mt-1">
          <p className="text-xs font-medium text-gray-700">{p.applicant.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {p.applicant.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {p.applicant.phone}
          </div>
        </div>
      </div>

      {/* Contract */}
      <div className="px-4 py-3 border-b border-gray-100">
        <Small variant="label">{dict.proposalContract}</Small>
        <div className="space-y-1 mt-1">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.propertyType}: </span>
            {propertyTypeLabel[p.contract.type.toUpperCase()] ?? p.contract.type}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {p.contract.signed ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-green-600">{dict.contractSigned}</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" /><path d="M8 12h8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" /></svg>
                <span className="text-gray-400">{dict.contractNotSigned}</span>
              </>
            )}
          </div>
          <div className="text-xs font-mono text-gray-400 truncate">
            ID: {p.contract.id}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <Button variant="primary" disabled={p.status === "signed" || p.status === "expired"}>
          {dict.proposalRequestSignature}
        </Button>
        <Button variant="steel" onClick={() => select(p)}>
          {dict.details}
        </Button>
      </div>
    </div>
  );
}
