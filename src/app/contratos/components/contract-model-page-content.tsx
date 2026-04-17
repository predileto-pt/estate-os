"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/dictionary-provider";
import { Small } from "@/components/ui/small";
import { cn, formatDate } from "@/lib/utils";
import type {
  ContractModel,
  TemplateVersionStatus,
  UploadStatus,
} from "@/lib/db-types";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type { Dictionary } from "@/lib/i18n";
import type { SourceSectionAnalysisBundleRead } from "./fake-data";
import { ChunkCard } from "./chunk-card";
import { ChunkDetailSidebar } from "./chunk-detail-sidebar";
import { SectionsTabContent } from "./sections-tab-content";
import { FieldEvidenceTabContent } from "./field-evidence-tab-content";
import { AnalysisTabContent } from "./analysis-tab-content";

type SourceSectionRead = components["schemas"]["SourceSectionRead"];
type FieldEvidenceRead = components["schemas"]["FieldEvidenceRead"];

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

type Tab = "preview" | "parsed" | "sections" | "fields" | "analysis";

export function ContractModelPageContent({
  model,
  dict,
  sections = [],
  fieldEvidence = [],
  analysisBundle = null,
}: {
  model: ContractModel;
  dict: Dictionary["dashboard"];
  sections?: SourceSectionRead[];
  fieldEvidence?: FieldEvidenceRead[];
  analysisBundle?: SourceSectionAnalysisBundleRead | null;
}) {
  const d = useDictionary().dashboard;
  const locale = useLocale();
  const filename = model.source_document?.filename ?? model.url.split("/").pop()?.split("?")[0] ?? model.url;
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(
    null,
  );

  const chunks = model.parse_result?.result.chunks ?? [];
  const selectedChunk =
    selectedChunkIndex !== null ? chunks[selectedChunkIndex] : null;

  const statusLabel: Record<TemplateVersionStatus, string> = {
    draft: d.statusDraft,
    review: d.statusReview,
    approved: d.statusApproved,
    deprecated: d.statusDeprecated,
    archived: d.statusArchived,
  };

  const uploadStatusLabel: Record<UploadStatus, string> = {
    pending: d.uploadPending,
    processing: d.uploadProcessing,
    completed: d.uploadCompleted,
    failed: d.uploadFailed,
  };

  function handleChunkClick(index: number) {
    setSelectedChunkIndex(selectedChunkIndex === index ? null : index);
  }

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "preview", label: d.preview, show: true },
    { key: "parsed", label: d.parsedResult, show: chunks.length > 0 },
    { key: "sections", label: d.sections, show: sections.length > 0 },
    { key: "fields", label: d.fieldEvidence, show: fieldEvidence.length > 0 },
    { key: "analysis", label: d.analysis, show: analysisBundle !== null },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/contratos/modelos"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          {dict.contractModels}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold font-heading">{filename}</h1>
          {model.template_version && (
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-xs font-medium rounded",
                statusColors[model.template_version.status],
              )}
            >
              {statusLabel[model.template_version.status]}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span className="text-gray-400">{dict.createdAt}: </span>
          <span className="font-medium text-gray-700">
            {formatDate(model.created_at, locale)}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs
          .filter((t) => t.show)
          .map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== "parsed") setSelectedChunkIndex(null);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Preview tab — 8 + 4 grid with metadata sidebar */}
      {activeTab === "preview" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="border border-gray-200 bg-white">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <Small variant="label">{d.pdfPreview}</Small>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[400px] bg-gray-50">
                <PdfPreview url={model.url} />
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
                <a
                  href={model.url}
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
                  {d.view}
                </a>
                <a
                  href={model.url}
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
                  {d.download}
                </a>
              </div>
            </div>
          </div>

          {/* Metadata sidebar */}
          <div className="col-span-4">
            <div className="sticky top-4 space-y-4">
              {model.template_version && (
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.templateVersion}</Small>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.versionNumber}:{" "}
                      </span>
                      <span className="font-medium text-gray-700">
                        v{model.template_version.version}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.renderEngine}:{" "}
                      </span>
                      <span className="font-medium text-gray-700">
                        {model.template_version.render_engine}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {dict.createdAt}:{" "}
                      </span>
                      <span className="font-medium text-gray-700">
                        {formatDate(
                          model.template_version.created_at,
                          locale,
                        )}
                      </span>
                    </div>
                    {model.template_version.approved_at && (
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-400">
                          {d.approvedAt}:{" "}
                        </span>
                        <span className="font-medium text-gray-700">
                          {formatDate(
                            model.template_version.approved_at,
                            locale,
                          )}
                        </span>
                      </div>
                    )}
                    {model.template_version.review_notes && (
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-400">
                          {d.reviewNotes}:{" "}
                        </span>
                        <span className="font-medium text-gray-700">
                          {model.template_version.review_notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {model.source_document && (
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.sourceDocument}</Small>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      {model.source_document.filename}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.pageCount}:{" "}
                      </span>
                      <span className="font-medium text-gray-700">
                        {model.source_document.page_count}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.language}:{" "}
                      </span>
                      <span className="font-medium text-gray-700">
                        {model.source_document.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.uploadStatus}:{" "}
                      </span>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                          uploadStatusColors[
                            model.source_document.upload_status
                          ],
                        )}
                      >
                        {
                          uploadStatusLabel[
                            model.source_document.upload_status
                          ]
                        }
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">
                        {d.documentHash}:{" "}
                      </span>
                      <span className="font-mono font-medium text-gray-700">
                        {model.source_document.sha256_hash.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {model.template_version?.schema_json && (
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.schemaFields}</Small>
                  </div>
                  <div className="px-4 py-3 flex flex-wrap gap-1.5">
                    {Object.keys(model.template_version.schema_json).map(
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

              <div className="text-xs font-mono text-gray-400 truncate">
                ID: {model.uuid}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Result tab — 8 + 4 grid with chunk detail sidebar */}
      {activeTab === "parsed" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-3">
            {chunks.map((chunk, i) => (
              <ChunkCard
                key={i}
                chunk={chunk}
                index={i}
                selected={selectedChunkIndex === i}
                onClick={() => handleChunkClick(i)}
              />
            ))}
          </div>

          <div className="col-span-4">
            <div className="sticky top-4">
              {selectedChunk ? (
                <ChunkDetailSidebar chunk={selectedChunk} />
              ) : (
                <p className="text-xs text-gray-400 text-center">
                  {d.selectChunkHint}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sections tab */}
      {activeTab === "sections" && (
        <SectionsTabContent sections={sections} />
      )}

      {/* Field Evidence tab */}
      {activeTab === "fields" && (
        <FieldEvidenceTabContent fields={fieldEvidence} />
      )}

      {/* Analysis tab */}
      {activeTab === "analysis" && (
        <AnalysisTabContent bundle={analysisBundle ?? null} sections={sections} />
      )}
    </div>
  );
}
