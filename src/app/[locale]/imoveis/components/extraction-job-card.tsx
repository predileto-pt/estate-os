"use client";

import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";

type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];
type ExtractionJobStatus = components["schemas"]["ExtractionJobStatus"];

const STATUS_STYLES: Record<ExtractionJobStatus, { border: string; badge: string }> = {
  pending: {
    border: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700",
  },
  processing: {
    border: "border-l-blue-400",
    badge: "bg-blue-50 text-blue-700",
  },
  completed: {
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  failed: {
    border: "border-l-red-400",
    badge: "bg-red-50 text-red-700",
  },
};

export function ExtractionJobCard({
  job,
  dict,
  locale,
}: {
  job: ExtractionJobResponse;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const styles = STATUS_STYLES[job.status];
  const isActive = job.status === "pending" || job.status === "processing";

  const statusLabel: Record<ExtractionJobStatus, string> = {
    pending: dict.extractionPending,
    processing: dict.extractionProcessing,
    completed: dict.extractionCompleted,
    failed: dict.extractionFailed,
  };

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white",
        styles.border,
      )}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* AI icon */}
          <div className="shrink-0 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
              <path d="M8.24 4.23A4 4 0 0 1 12 2" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" />
              <path d="M12 12v10" /><path d="M12 22a4 4 0 0 0 0-8" /><path d="M12 22a4 4 0 0 1 0-8" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {dict.extractionJobTitle}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {job.document_keys.length} {job.document_keys.length === 1 ? dict.file : dict.filesLabel}
              {job.listing_type && ` · ${dict[job.listing_type as keyof typeof dict] ?? job.listing_type}`}
              {job.typology && ` · ${dict[job.typology as keyof typeof dict] ?? job.typology}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isActive && (
            <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <span className={cn("inline-block px-2 py-0.5 text-xs font-medium rounded", styles.badge)}>
            {statusLabel[job.status]}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(job.created_at, locale)}
          </span>
        </div>
      </div>

      {job.status === "failed" && job.error_message && (
        <div className="px-4 pb-3">
          <p className="text-xs text-red-600">{job.error_message}</p>
        </div>
      )}
    </div>
  );
}
