"use client";

import { useTransition } from "react";
import type { Applicant, RiskLevel } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/small";
import { cn, formatPrice } from "@/lib/utils";
import { useApplicantDetail } from "./applicant-detail-context";
import { approveApplicant, denyApplicant, requestOwnerApproval } from "../actions";

const riskBadgeStyles: Record<RiskLevel, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

export function ApplicantCard({
  applicant,
  dict,
  locale,
  isExample,
}: {
  applicant: Applicant;
  dict: Dictionary["dashboard"];
  locale: Locale;
  isExample?: boolean;
}) {
  const { selectedId, select } = useApplicantDetail();
  const [approvePending, startApprove] = useTransition();
  const [denyPending, startDeny] = useTransition();
  const [ownerApprovalPending, startOwnerApproval] = useTransition();
  const a = applicant;
  const r = a.screening_report;
  const isSelected = selectedId === a.id;

  const riskLabel: Record<RiskLevel, string> = {
    LOW: dict.riskLow,
    MEDIUM: dict.riskMedium,
    HIGH: dict.riskHigh,
  };

  const propertyTypeLabel: Record<string, string> = {
    ARRENDAMENTO: dict.rental,
    VENDA: dict.purchase,
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
            {a.name}
          </h3>
          {r && (
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded",
                riskBadgeStyles[r.risk_level],
              )}
            >
              {riskLabel[r.risk_level]}
            </span>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {a.email}
        </div>
        {a.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {a.phone}
          </div>
        )}
      </div>

      {/* Property details */}
      <div className="px-4 py-3 border-b border-gray-100">
        <Small variant="label">{dict.property}</Small>
        {a.property_title && (
          <p className="text-xs font-medium text-gray-700 mt-1">{a.property_title}</p>
        )}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">{dict.propertyType}: </span>
            {propertyTypeLabel[a.property_type] ?? a.property_type}
          </div>
          {a.property_value != null && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.propertyValue}: </span>
              <span className="font-medium text-gray-700">
                {formatPrice(a.property_value, locale)}
              </span>
            </div>
          )}
          {a.monthly_rent != null && (
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.monthlyRent}: </span>
              <span className="font-medium text-gray-700">
                {formatPrice(a.monthly_rent, locale)}/{dict.month}
              </span>
            </div>
          )}
        </div>
        {a.property_address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{a.property_address}</span>
          </div>
        )}
      </div>

      {/* Screening report subcard */}
      {r ? (
        <div className="mx-4 my-3 rounded border border-gray-100 bg-gray-50 px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <Small variant="label">{dict.screeningReport}</Small>
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded",
                riskBadgeStyles[r.risk_level],
              )}
            >
              {dict.riskLevel}: {riskLabel[r.risk_level]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              {r.identity_verified ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#dc2626" /><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
              <span className="text-gray-500">{dict.identityVerified}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {r.income_verified ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#dc2626" /><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
              <span className="text-gray-500">{dict.incomeVerified}</span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.dtiRatio}: </span>
              <span className="font-medium text-gray-700">{(r.dti_ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">{dict.averageMonthlyIncome}: </span>
              <span className="font-medium text-gray-700">
                {formatPrice(r.average_monthly_income, locale)}
              </span>
            </div>
          </div>
          {r.justification && (
            <div className="mt-2 border-l-2 border-gray-200 bg-white px-2 py-1">
              <p className="text-xs text-gray-600">{r.justification}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400">{dict.noScreeningReport}</p>
        </div>
      )}

      {/* Footer */}
      {!isExample && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              disabled={approvePending}
              onClick={() => startApprove(async () => { await approveApplicant(a.id); })}
            >
              {dict.approve}
            </Button>
            <Button
              variant="steel"
              disabled={denyPending}
              onClick={() => startDeny(async () => { await denyApplicant(a.id); })}
            >
              {dict.reject}
            </Button>
            <Button
              variant="default"
              disabled={ownerApprovalPending}
              onClick={() => startOwnerApproval(async () => { await requestOwnerApproval(a.id); })}
            >
              {dict.requestOwnerApproval}
            </Button>
          </div>
          <Button variant="steel" onClick={() => select(a)}>
            {dict.details}
          </Button>
        </div>
      )}
    </div>
  );
}
