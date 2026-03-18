"use client";

import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";

type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];
type ExtractionJobStatus = components["schemas"]["ExtractionJobStatus"];

const STATUS_STYLES: Record<
  ExtractionJobStatus,
  { border: string; badge: string }
> = {
  pending: {
    border: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700",
  },
  processing: {
    border: "border-l-blue-400",
    badge: "bg-blue-50 text-blue-700",
  },
  retrying: {
    border: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700",
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
  const isActive =
    job.status === "pending" ||
    job.status === "processing" ||
    job.status === "retrying";

  const statusLabel: Record<ExtractionJobStatus, string> = {
    pending: dict.extractionPending,
    processing: dict.extractionProcessing,
    retrying: dict.extractionRetrying,
    completed: dict.extractionCompleted,
    failed: dict.extractionFailed,
  };

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 bg-white",
        styles.border
      )}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* AI icon */}
          <div className="shrink-0 text-gray-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path>
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {dict.extractionJobTitle}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {job.document_keys.length}{" "}
              {job.document_keys.length === 1 ? dict.file : dict.filesLabel}
              {job.listing_type &&
                ` · ${dict[job.listing_type as keyof typeof dict] ?? job.listing_type}`}
              {job.typology &&
                ` · ${dict[job.typology as keyof typeof dict] ?? job.typology}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isActive && (
            <svg
              className="animate-spin h-4 w-4 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          <span
            className={cn(
              "inline-block px-2 py-0.5 text-xs font-medium rounded",
              styles.badge
            )}
          >
            {statusLabel[job.status]}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(job.created_at, locale)}
          </span>
        </div>
      </div>

      {/* {job.status === "failed" && job.error_message && (
        <div className="px-4 pb-3">
          <p className="text-xs text-red-600">{job.error_message}</p>
        </div>
      )} */}
    </div>
  );
}
