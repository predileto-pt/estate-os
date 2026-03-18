"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useApplicantDetail, useSelectedApplicant } from "./applicant-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import type { Applicant, RiskLevel } from "@/lib/db-types";

const riskBadgeStyles: Record<RiskLevel, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

export function ApplicantDetailPanel({
  applicants,
}: {
  applicants: Applicant[];
}) {
  const selected = useSelectedApplicant(applicants);
  const { close } = useApplicantDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const riskLabel: Record<RiskLevel, string> = {
    LOW: dict.riskLow,
    MEDIUM: dict.riskMedium,
    HIGH: dict.riskHigh,
  };

  const propertyTypeLabel: Record<string, string> = {
    APARTAMENTO: dict.apartment,
    MORADIA: dict.house,
    TERRENO: dict.land,
  };

  return (
    <AnimatePresence>
      {selected && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={close}
          />

          {/* Sidebar */}
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
            <div className="px-4 py-3 border-b border-gray-100 space-y-1">
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                {selected.email}
              </span>
              {selected.phone && (
                <span className="flex items-center gap-1.5 text-xs text-blue-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  {selected.phone}
                </span>
              )}
            </div>

            {/* Property info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.property}</Small>
              {selected.property_title && (
                <p className="text-xs font-medium text-gray-700 mt-1">{selected.property_title}</p>
              )}
              <div className="space-y-1.5 mt-1">
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.propertyType}: </span>
                  {selected.property_type ? (propertyTypeLabel[selected.property_type] ?? selected.property_type) : "—"}
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
                {selected.property_address && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{selected.property_address}</span>
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
