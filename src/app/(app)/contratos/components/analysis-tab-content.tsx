"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import { Small } from "@/components/ui/small";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type {
  SourceSectionAnalysisBundleRead,
  SourceSectionAnalysisRead,
} from "./fake-data";

type SourceSectionRead = components["schemas"]["SourceSectionRead"];

const reviewStatusColors: Record<string, string> = {
  accepted: "bg-green-100 text-green-700",
  corrected: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
  pending: "bg-gray-100 text-gray-600",
};

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-600",
};

const sectionTypeColors: Record<string, string> = {
  static: "bg-gray-100 text-gray-600",
  parameterized: "bg-blue-100 text-blue-700",
  conditional: "bg-purple-100 text-purple-700",
  generative: "bg-orange-100 text-orange-700",
};

export function AnalysisTabContent({
  bundle,
  sections = [],
}: {
  bundle: SourceSectionAnalysisBundleRead | null;
  sections?: SourceSectionRead[];
}) {
  const sectionsById = useMemo(() => new Map(sections.map((s) => [s.id, s])), [sections]);
  const d = useDictionary().dashboard;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!bundle) {
    return <p className="text-sm text-gray-400 text-center py-12">{d.noAnalysis}</p>;
  }

  const { analysis_run, analyses } = bundle;
  const selected: SourceSectionAnalysisRead | null =
    selectedIndex !== null ? analyses[selectedIndex] : null;

  const reviewStatusLabel: Record<string, string> = {
    accepted: d.reviewAccepted,
    corrected: d.reviewCorrected,
    rejected: d.reviewRejected,
    pending: d.reviewPending,
  };

  const sectionTypeLabel: Record<string, string> = {
    static: d.sectionTypeStatic,
    parameterized: d.sectionTypeParameterized,
    conditional: d.sectionTypeConditional,
    generative: d.sectionTypeGenerative,
  };

  const strategyLabel: Record<string, string> = {
    literal: d.strategyLiteral,
    template: d.strategyTemplate,
    template_variant: d.strategyTemplateVariant,
    ai_draft: d.strategyAiDraft,
  };

  const riskLabel: Record<string, string> = {
    low: d.riskLow,
    medium: d.riskMedium,
    high: d.riskHigh,
  };

  const refTypeLabel: Record<string, string> = {
    field: d.referenceTypeField,
    condition: d.referenceTypeCondition,
  };

  return (
    <div>
      {/* Analysis run header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <span className="text-xs text-gray-400">{d.analysisProvider}:</span>
        <span className="text-xs font-medium text-gray-700">
          {analysis_run.provider}
        </span>
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs text-gray-400">{d.analysisModel}:</span>
        <span className="text-xs font-medium text-gray-700">
          {analysis_run.model_name}
        </span>
        <span className="text-xs text-gray-300">|</span>
        <span
          className={cn(
            "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
            analysis_run.status === "succeeded"
              ? "bg-green-100 text-green-700"
              : analysis_run.status === "failed"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-700",
          )}
        >
          {analysis_run.status}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-3">
          {analyses.map((analysis, i) => {
            const section = sectionsById.get(analysis.source_section_id);
            return (
              <button
                key={analysis.id}
                type="button"
                onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                className={cn(
                  "w-full border border-gray-200 border-l-4 bg-white p-4 transition-all cursor-pointer hover:shadow-sm text-left",
                  selectedIndex === i
                    ? "border-l-blue-400 ring-2 ring-blue-400"
                    : "border-l-gray-300 hover:border-l-gray-400",
                )}
              >
                {section && (
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    {section.title ?? section.section_key}
                  </h3>
                )}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                      sectionTypeColors[analysis.section_type] ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    {sectionTypeLabel[analysis.section_type] ?? analysis.section_type}
                  </span>
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                      riskColors[analysis.risk_level] ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    {d.riskLevel}: {riskLabel[analysis.risk_level] ?? analysis.risk_level}
                  </span>
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 text-xs font-medium rounded ml-auto",
                      reviewStatusColors[analysis.review_status] ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    {reviewStatusLabel[analysis.review_status] ?? analysis.review_status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {analysis.reasoning}
                </p>
                {section?.extracted_text && (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-2 italic">
                    {section.extracted_text}
                  </p>
                )}
                {analysis.references.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {analysis.references.map((ref) => (
                      <span
                        key={ref.id}
                        className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded font-mono"
                      >
                        {ref.reference_key}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="col-span-4">
          <div className="sticky top-4">
            {selected ? (
              <div className="space-y-4">
                {(() => {
                  const selectedSection = sectionsById.get(selected.source_section_id);
                  if (!selectedSection?.extracted_text) return null;
                  return (
                    <div className="border border-gray-200 bg-white">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                        <Small variant="label">
                          {selectedSection.title ?? selectedSection.section_key ?? d.extractedText}
                        </Small>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                          {selectedSection.extracted_text}
                        </p>
                        {selectedSection.page_start != null && (
                          <p className="text-xs text-gray-400 mt-2">
                            {d.page} {selectedSection.page_start}
                            {selectedSection.page_end != null && selectedSection.page_end !== selectedSection.page_start
                              ? `–${selectedSection.page_end}`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.analysis}</Small>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.sectionType}: </span>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 font-medium rounded",
                          sectionTypeColors[selected.section_type],
                        )}
                      >
                        {sectionTypeLabel[selected.section_type]}
                      </span>
                      {selected.corrected_section_type && (
                        <>
                          <span className="mx-1 text-gray-300">&rarr;</span>
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.5 font-medium rounded",
                              sectionTypeColors[selected.corrected_section_type],
                            )}
                          >
                            {sectionTypeLabel[selected.corrected_section_type]}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.riskLevel}: </span>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 font-medium rounded",
                          riskColors[selected.risk_level],
                        )}
                      >
                        {riskLabel[selected.risk_level]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.recommendedStrategy}: </span>
                      <span className="font-medium text-gray-700">
                        {strategyLabel[selected.recommended_strategy]}
                      </span>
                      {selected.corrected_strategy && (
                        <>
                          <span className="mx-1 text-gray-300">&rarr;</span>
                          <span className="font-medium text-green-700">
                            {strategyLabel[selected.corrected_strategy]}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.reviewStatus}: </span>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 font-medium rounded",
                          reviewStatusColors[selected.review_status],
                        )}
                      >
                        {reviewStatusLabel[selected.review_status]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.reasoning}</Small>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selected.reasoning}
                    </p>
                  </div>
                </div>

                {selected.review_notes && (
                  <div className="border border-gray-200 bg-white">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <Small variant="label">{d.reviewNotes}</Small>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selected.review_notes}
                      </p>
                    </div>
                  </div>
                )}

                {selected.references.length > 0 && (
                  <div className="border border-gray-200 bg-white">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <Small variant="label">{d.references}</Small>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      {selected.references.map((ref) => (
                        <div
                          key={ref.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.5 font-medium rounded",
                              ref.reference_type === "field"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700",
                            )}
                          >
                            {refTypeLabel[ref.reference_type]}
                          </span>
                          <span className="font-mono text-gray-700">
                            {ref.reference_key}
                          </span>
                          {ref.display_label && (
                            <span className="text-gray-400">
                              ({ref.display_label})
                            </span>
                          )}
                          {ref.confidence != null && (
                            <span className="text-gray-400 ml-auto">
                              {(parseFloat(ref.confidence) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center">
                {d.selectSectionHint}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
