"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import { Small } from "@/components/ui/small";
import type { components } from "@/lib/types/contract-intelligence-service-api";

type SourceSectionRead = components["schemas"]["SourceSectionRead"];

const reviewStatusColors: Record<string, string> = {
  accepted: "bg-green-100 text-green-700",
  corrected: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
  pending: "bg-gray-100 text-gray-600",
  merged: "bg-purple-100 text-purple-700",
  split: "bg-indigo-100 text-indigo-700",
};

export function SectionsTabContent({
  sections,
}: {
  sections: SourceSectionRead[];
}) {
  const d = useDictionary().dashboard;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? sections[selectedIndex] : null;

  const reviewStatusLabel: Record<string, string> = {
    accepted: d.reviewAccepted,
    corrected: d.reviewCorrected,
    rejected: d.reviewRejected,
    pending: d.reviewPending,
    merged: d.reviewMerged,
    split: d.reviewSplit,
  };

  if (sections.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-12">{d.noSections}</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-3">
        {sections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
            className={cn(
              "w-full border border-gray-200 border-l-4 bg-white p-4 transition-all cursor-pointer hover:shadow-sm text-left",
              selectedIndex === i
                ? "border-l-blue-400 ring-2 ring-blue-400"
                : "border-l-gray-300 hover:border-l-gray-400",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800">
                {section.title ?? section.section_key ?? `${d.sections} ${section.sort_order}`}
              </h3>
              <span
                className={cn(
                  "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                  reviewStatusColors[section.review_status] ?? "bg-gray-100 text-gray-600",
                )}
              >
                {reviewStatusLabel[section.review_status] ?? section.review_status}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {section.extracted_text}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {section.page_start != null && (
                <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {d.page} {section.page_start}
                  {section.page_end != null && section.page_end !== section.page_start
                    ? `–${section.page_end}`
                    : ""}
                </span>
              )}
              {section.classification_confidence != null && (
                <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {d.confidence} {(parseFloat(section.classification_confidence) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="col-span-4">
        <div className="sticky top-4">
          {selected ? (
            <div className="space-y-4">
              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <Small variant="label">
                    {selected.title ?? selected.section_key}
                  </Small>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {selected.section_key && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.sectionKey}: </span>
                      <span className="font-mono font-medium text-gray-700">
                        {selected.section_key}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">{d.reviewStatus}: </span>
                    <span
                      className={cn(
                        "inline-block px-1.5 py-0.5 font-medium rounded",
                        reviewStatusColors[selected.review_status] ?? "bg-gray-100 text-gray-600",
                      )}
                    >
                      {reviewStatusLabel[selected.review_status] ?? selected.review_status}
                    </span>
                  </div>
                  {selected.classification_confidence != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.confidence}: </span>
                      <span className="font-medium text-gray-700">
                        {(parseFloat(selected.classification_confidence) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <Small variant="label">{d.extractedText}</Small>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {selected.extracted_text}
                  </p>
                </div>
              </div>

              {selected.normalized_text && (
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.normalizedText}</Small>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {selected.normalized_text}
                    </p>
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
  );
}
