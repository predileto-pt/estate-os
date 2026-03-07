"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useApplicantDetail } from "./applicant-detail-context";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";

export function ApplicantDetailPanel() {
  const { selected, close } = useApplicantDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

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
              {selected.visitor_name}
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

          {/* Personal info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Small variant="label">{dict.nif}</Small>
                <p className="text-sm text-gray-700 mt-0.5">
                  {selected.visitor_nif ?? dict.notProvided}
                </p>
              </div>
              <div>
                <Small variant="label">{dict.dateOfBirth}</Small>
                <p className="text-sm text-gray-700 mt-0.5">
                  {selected.visitor_date_of_birth
                    ? formatDate(selected.visitor_date_of_birth, locale)
                    : dict.notProvided}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-4 py-3 border-b border-gray-100">
            <Small variant="label">{dict.visitor}</Small>
            <div className="mt-1 space-y-1">
              {selected.visitor_phone && (
                <span className="flex items-center gap-1.5 text-xs text-blue-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  {selected.visitor_phone}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                {selected.visitor_email}
              </span>
            </div>
          </div>

          {/* Income history */}
          <div className="px-4 py-3 border-b border-gray-100">
            <Small variant="label">{dict.incomeHistory}</Small>
            {selected.income_records && selected.income_records.length > 0 ? (
              <div className="mt-2 space-y-2">
                {selected.income_records.map((r) => (
                  <div
                    key={r.month}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="text-gray-700">{r.source}</span>
                      <span className="text-gray-400 ml-2 text-xs">{r.month}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatPrice(r.amount, locale)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{dict.noIncomeRecords}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3">
            <Button variant="steel" className="w-full">
              {dict.openDocuments}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
