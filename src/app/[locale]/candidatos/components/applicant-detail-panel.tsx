"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useApplicantDetail } from "./applicant-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import type { RiskLevel } from "@/lib/db-types";

const riskBadgeStyles: Record<RiskLevel, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

export function ApplicantDetailPanel() {
  const { selected, close } = useApplicantDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const riskLabel: Record<RiskLevel, string> = {
    LOW: dict.riskLow,
    MEDIUM: dict.riskMedium,
    HIGH: dict.riskHigh,
  };

  const propertyTypeLabel: Record<string, string> = {
    RENTAL: dict.rental,
    PURCHASE: dict.purchase,
  };

  return (
    <AnimatePresence mode="wait">
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
          className="sticky top-4 border border-gray-200 bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold font-heading text-gray-900 truncate">
              {selected.name}
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
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              {selected.email}
            </span>
          </div>

          {/* Property info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <Small variant="label">{dict.property}</Small>
            <div className="space-y-1.5 mt-1">
              <div className="text-xs text-gray-500">
                <span className="text-gray-400">{dict.propertyType}: </span>
                {propertyTypeLabel[selected.property_type] ?? selected.property_type}
              </div>
              {selected.property_value != null && (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.propertyValue}: </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(selected.property_value, locale)}
                  </span>
                </div>
              )}
              {selected.monthly_rent != null && (
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.monthlyRent}: </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(selected.monthly_rent, locale)}/{dict.month}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Screening report */}
          <div className="px-4 py-3 border-b border-gray-100">
            <Small variant="label">{dict.screeningReport}</Small>
            {selected.screening_report ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{dict.riskLevel}</span>
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-xs font-medium rounded",
                      riskBadgeStyles[selected.screening_report.risk_level],
                    )}
                  >
                    {riskLabel[selected.screening_report.risk_level]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {selected.screening_report.identity_verified ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#dc2626" /><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  <span className="text-gray-500">{dict.identityVerified}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {selected.screening_report.income_verified ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#dc2626" /><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  <span className="text-gray-500">{dict.incomeVerified}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.dtiRatio}: </span>
                  <span className="font-medium text-gray-700">
                    {(selected.screening_report.dti_ratio * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.averageMonthlyIncome}: </span>
                  <span className="font-medium text-gray-700">
                    {formatPrice(selected.screening_report.average_monthly_income, locale)}
                  </span>
                </div>
                {selected.screening_report.justification && (
                  <div className="border-l-2 border-gray-200 bg-gray-50 px-2 py-1">
                    <span className="text-xs text-gray-400">{dict.justification}</span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {selected.screening_report.justification}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{dict.noScreeningReport}</p>
            )}
          </div>

          {/* IDs */}
          <div className="px-4 py-3">
            <div className="text-xs font-mono text-gray-400 truncate">
              ID: {selected.id}
            </div>
            <div className="text-xs font-mono text-gray-400 truncate mt-1">
              Form: {selected.form_request_id}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
