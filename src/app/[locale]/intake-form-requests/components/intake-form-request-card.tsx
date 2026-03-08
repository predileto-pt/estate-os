"use client";

import { useState, useTransition } from "react";
import type { IntakeFormRequestRow } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/small";
import { cn, formatDate } from "@/lib/utils";
import { resendIntakeFormEmail } from "../actions";

const statusBorderStyles = {
  pending: "border-l-gray-300",
  completed: "border-l-green-600",
  expired: "border-l-red-600",
} as const;

const statusBadgeStyles = {
  pending: "bg-gray-100 text-gray-600",
  completed: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
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
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      0,
      "second",
    );
  }

  for (const [unit, seconds] of units) {
    const value = Math.floor(diffSeconds / seconds);
    if (value >= 1) {
      if (unit === "day" && value >= 30) {
        return formatDate(dateString, locale);
      }
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -value,
        unit,
      );
    }
  }

  return formatDate(dateString, locale);
}

export function IntakeFormRequestCard({
  request,
  dict,
  locale,
}: {
  request: IntakeFormRequestRow;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const r = request;

  const intakeFormUrl =
    process.env.NEXT_PUBLIC_APPLICANT_INTAKE_FORM_URL || "http://localhost:5173";

  function handleCopyLink() {
    const link = `${intakeFormUrl}/${r.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleResendEmail() {
    startTransition(async () => {
      await resendIntakeFormEmail(r.id);
      setEmailResent(true);
      setTimeout(() => setEmailResent(false), 2000);
    });
  }

  const statusLabel = {
    pending: dict.pending,
    completed: dict.completed,
    expired: dict.expired,
  } as const;

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white",
        statusBorderStyles[r.status],
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-gray-900">
            {r.applicant_name}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded",
                statusBadgeStyles[r.status],
              )}
            >
              {statusLabel[r.status]}
            </span>
            <Small as="time" className="text-gray-400">
              {timeAgo(r.created_at, locale)}
            </Small>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
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
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {r.applicant_email}
          </div>
          {r.applicant_phone && (
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
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {r.applicant_phone}
            </div>
          )}
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
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {r.property_id}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <Button variant="steel" onClick={handleCopyLink} disabled={pending}>
          {linkCopied ? dict.linkCopied : dict.copyLink}
        </Button>
        {r.status === "pending" && (
          <Button
            variant="steel"
            onClick={handleResendEmail}
            disabled={pending}
          >
            {emailResent ? dict.emailResent : dict.resendEmail}
          </Button>
        )}
      </div>
    </div>
  );
}
