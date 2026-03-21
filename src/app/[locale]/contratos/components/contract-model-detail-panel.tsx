"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useDictionary } from "@/components/dictionary-provider";
import {
  useContractModelDetail,
  useSelectedContractModel,
} from "./contract-model-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import type {
  ContractModel,
  TemplateVersionStatus,
  UploadStatus,
} from "@/lib/db-types";

const PdfPreview = dynamic(() => import("./pdf-preview"), { ssr: false });

const statusColors: Record<TemplateVersionStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  deprecated: "bg-orange-100 text-orange-700",
  archived: "bg-red-100 text-red-600",
};

const uploadStatusColors: Record<UploadStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  processing: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
};

export function ContractModelDetailPanel({ models }: { models: ContractModel[] }) {
  const selected = useSelectedContractModel(models);
  const { close } = useContractModelDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const statusLabel: Record<TemplateVersionStatus, string> = {
    draft: dict.statusDraft,
    review: dict.statusReview,
    approved: dict.statusApproved,
    deprecated: dict.statusDeprecated,
    archived: dict.statusArchived,
  };

  const uploadStatusLabel: Record<UploadStatus, string> = {
    pending: dict.uploadPending,
    processing: dict.uploadProcessing,
    completed: dict.uploadCompleted,
    failed: dict.uploadFailed,
  };

  return (
    <AnimatePresence>
      {selected && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={close}
          />

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
              <div className="flex items-center gap-2">
                {selected.template_version && (
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-xs font-medium rounded",
                      statusColors[selected.template_version.status],
                    )}
                  >
                    {statusLabel[selected.template_version.status]}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={dict.close}
              >
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* PDF Preview */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.pdfPreview}</Small>
              <div className="mt-2 rounded border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center min-h-[200px]">
                <PdfPreview url={selected.url} />
              </div>
            </div>

            {/* Template Version */}
            {selected.template_version && (
              <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
                <Small variant="label">{dict.templateVersion}</Small>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">
                    {dict.versionNumber}:{" "}
                  </span>
                  <span className="font-medium text-gray-700">
                    v{selected.template_version.version}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">
                    {dict.renderEngine}:{" "}
                  </span>
                  <span className="font-medium text-gray-700">
                    {selected.template_version.render_engine}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.createdAt}: </span>
                  <span className="font-medium text-gray-700">
                    {formatDate(selected.template_version.created_at, locale)}
                  </span>
                </div>
                {selected.template_version.approved_at && (
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">
                      {dict.approvedAt}:{" "}
                    </span>
                    <span className="font-medium text-gray-700">
                      {formatDate(
                        selected.template_version.approved_at,
                        locale,
                      )}
                    </span>
                  </div>
                )}
                {selected.template_version.review_notes && (
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">
                      {dict.reviewNotes}:{" "}
                    </span>
                    <span className="font-medium text-gray-700">
                      {selected.template_version.review_notes}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Source Document */}
            {selected.source_document && (
              <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
                <Small variant="label">{dict.sourceDocument}</Small>
                <p className="text-xs font-medium text-gray-700">
                  {selected.source_document.filename}
                </p>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.pageCount}: </span>
                  <span className="font-medium text-gray-700">
                    {selected.source_document.page_count}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.language}: </span>
                  <span className="font-medium text-gray-700">
                    {selected.source_document.language}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-gray-400">
                    {dict.uploadStatus}:{" "}
                  </span>
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                      uploadStatusColors[
                        selected.source_document.upload_status
                      ],
                    )}
                  >
                    {uploadStatusLabel[selected.source_document.upload_status]}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">
                    {dict.documentHash}:{" "}
                  </span>
                  <span className="font-mono font-medium text-gray-700">
                    {selected.source_document.sha256_hash.slice(0, 16)}...
                  </span>
                </div>
              </div>
            )}

            {/* Schema Fields */}
            {selected.template_version?.schema_json && (
              <div className="px-4 py-3 border-b border-gray-100">
                <Small variant="label">{dict.schemaFields}</Small>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.keys(selected.template_version.schema_json).map(
                    (key) => (
                      <span
                        key={key}
                        className="inline-block px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded"
                      >
                        {key}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
              >
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {dict.view}
              </a>
              <a
                href={selected.url}
                download
                className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
              >
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {dict.download}
              </a>
            </div>

            {/* ID */}
            <div className="px-4 py-3">
              <div className="text-xs font-mono text-gray-400 truncate">
                ID: {selected.uuid}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
