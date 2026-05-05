"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import { Small } from "@/components/ui/small";
import type { components } from "@/lib/types/contract-intelligence-service-api";

type FieldEvidenceRead = components["schemas"]["FieldEvidenceRead"];

const reviewStatusColors: Record<string, string> = {
  accepted: "bg-green-100 text-green-700",
  corrected: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-600",
  pending: "bg-gray-100 text-gray-600",
};

export function FieldEvidenceTabContent({
  fields,
}: {
  fields: FieldEvidenceRead[];
}) {
  const d = useDictionary().dashboard;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? fields[selectedIndex] : null;

  const reviewStatusLabel: Record<string, string> = {
    accepted: d.reviewAccepted,
    corrected: d.reviewCorrected,
    rejected: d.reviewRejected,
    pending: d.reviewPending,
  };

  if (fields.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-12">{d.noFieldEvidence}</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                  {d.fieldKey}
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                  {d.fieldValue}
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                  {d.confidence}
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                  {d.reviewStatus}
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, i) => (
                <tr
                  key={field.id}
                  onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                  className={cn(
                    "border-b border-gray-100 cursor-pointer transition-colors",
                    selectedIndex === i
                      ? "bg-blue-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-700">
                    {field.field_key}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-700 max-w-48 truncate">
                    {field.corrected_value_json != null
                      ? String(field.corrected_value_json)
                      : field.field_value_json != null
                        ? String(field.field_value_json)
                        : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {field.confidence != null
                      ? `${(parseFloat(field.confidence) * 100).toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
                        reviewStatusColors[field.review_status] ?? "bg-gray-100 text-gray-600",
                      )}
                    >
                      {reviewStatusLabel[field.review_status] ?? field.review_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-4">
        <div className="sticky top-4">
          {selected ? (
            <div className="space-y-4">
              <div className="border border-gray-200 bg-white">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <Small variant="label">
                    <span className="font-mono">{selected.field_key}</span>
                  </Small>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">{d.fieldValue}: </span>
                    <span className="font-medium text-gray-700">
                      {selected.field_value_json != null ? String(selected.field_value_json) : "—"}
                    </span>
                  </div>
                  {selected.corrected_value_json != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.correctedValue}: </span>
                      <span className="font-medium text-green-700">
                        {String(selected.corrected_value_json)}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">{d.confidence}: </span>
                    <span className="font-medium text-gray-700">
                      {selected.confidence != null
                        ? `${(parseFloat(selected.confidence) * 100).toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
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
                  {selected.page_number != null && (
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">{d.page}: </span>
                      <span className="font-medium text-gray-700">{selected.page_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {selected.source_text && (
                <div className="border border-gray-200 bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <Small variant="label">{d.sourceText}</Small>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      &ldquo;{selected.source_text}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center">
              {d.selectFieldHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
