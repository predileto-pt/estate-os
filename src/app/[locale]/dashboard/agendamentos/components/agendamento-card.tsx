"use client";

import { useTransition } from "react";
import type { AgendamentoRow } from "@/lib/db-types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Small } from "@/components/ui/small";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { approveAgendamento, rejectAgendamento } from "../actions";

const statusBorderStyles = {
  pending: "border-l-gray-300",
  approved: "border-l-green-600",
  rejected: "border-l-red-600",
} as const;

const statusBadgeStyles = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
} as const;

function timeAgo(dateString: string, locale: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  if (diffSeconds < 60) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second");
  }

  for (const [unit, seconds] of units) {
    const value = Math.floor(diffSeconds / seconds);
    if (value >= 1) {
      if (unit === "day" && value >= 30) {
        return formatDate(dateString, locale);
      }
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-value, unit);
    }
  }

  return formatDate(dateString, locale);
}

export function AgendamentoCard({
  agendamento,
  dict,
  locale,
}: {
  agendamento: AgendamentoRow;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const a = agendamento;

  function handleApprove() {
    startTransition(() => approveAgendamento(a.id));
  }

  function handleReject() {
    startTransition(() => rejectAgendamento(a.id));
  }

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white",
        statusBorderStyles[a.status]
      )}
    >
      {/* A. Property header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-gray-900">
            {a.property_title}
          </h3>
          <div className="flex items-center gap-2">
            {a.property_price != null && (
              <span className="text-sm font-bold font-heading text-gray-700">
                {formatPrice(a.property_price, locale)}
              </span>
            )}
            <Small as="time" className="text-gray-400">
              {timeAgo(a.created_at, locale)}
            </Small>
          </div>
        </div>
        {a.property_address && (
          <p className="text-xs text-gray-400 mt-0.5">{a.property_address}</p>
        )}
      </div>

      {/* B. Visitor info */}
      <div className="px-4 py-3">
        <Small variant="label">{dict.visitor}</Small>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-bold text-blue-600">{a.visitor_name}</p>
          <div className="flex items-center space-x-4">
            {a.visitor_phone && (
              <span className="flex items-center gap-1 text-xs text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                {a.visitor_phone}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              {a.visitor_email}
            </span>
          </div>
        </div>
      </div>

      {/* C. Documents */}
      <div className="px-4 py-3 border-t border-gray-100">
        <Small variant="label">{dict.documents}</Small>
        <div className="space-y-1 mt-1">
          <div className="flex items-center gap-2 text-sm">
            {a.has_id_document ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="text-red-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            )}
            <span className="text-gray-500">{dict.idDocument}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {a.has_proof_of_income ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="text-red-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            )}
            <span className="text-gray-500">{dict.proofOfIncome}</span>
          </div>
          {!a.has_proof_of_income && a.justification && (
            <p className="text-xs text-red-600 ml-6">{a.justification}</p>
          )}
        </div>
      </div>

      {/* D. Message (conditional) */}
      {a.message && (
        <div className="px-4 py-3 border-t border-gray-100">
          <Small variant="label">{dict.visitorMessage}</Small>
          <div className="mt-1 border-l-2 border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-600">{a.message}</p>
          </div>
        </div>
      )}

      {/* E. Actions footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        {a.status === "pending" ? (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={pending}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 border border-green-700 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.1),inset_0_-2px_0_0_rgba(0,0,0,0.1)] disabled:opacity-50 transition-colors duration-300 cursor-pointer"
            >
              {dict.approve}
            </button>
            <button
              onClick={handleReject}
              disabled={pending}
              className="px-3 py-1.5 text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] disabled:opacity-50 transition-colors duration-300 cursor-pointer"
            >
              {dict.reject}
            </button>
          </div>
        ) : (
          <span
            className={cn(
              "inline-block px-2 py-1 text-xs font-medium rounded",
              statusBadgeStyles[a.status as "approved" | "rejected"]
            )}
          >
            {dict[a.status as "approved" | "rejected"]}
          </span>
        )}
      </div>
    </div>
  );
}
