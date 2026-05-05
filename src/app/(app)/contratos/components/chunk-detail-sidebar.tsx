"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import type { ReductoChunk, ReductoBlock } from "@/lib/db-types";

const blockTypeColors: Record<ReductoBlock["type"], string> = {
  Title: "bg-blue-100 text-blue-700",
  Text: "bg-gray-100 text-gray-600",
  "Key Value": "bg-purple-100 text-purple-700",
  "Section Header": "bg-indigo-100 text-indigo-700",
  Footer: "bg-gray-50 text-gray-400",
};

const confidenceColors: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-red-100 text-red-600",
};

function BlockCard({ block }: { block: ReductoBlock }) {
  const d = useDictionary().dashboard;
  const [expanded, setExpanded] = useState(false);

  const blockTypeLabel: Record<ReductoBlock["type"], string> = {
    Title: d.blockTypeTitle,
    Text: d.blockTypeText,
    "Key Value": d.blockTypeKeyValue,
    "Section Header": d.blockTypeSectionHeader,
    Footer: d.blockTypeFooter,
  };

  const confidenceLabel: Record<string, string> = {
    high: d.confidenceHigh,
    medium: d.confidenceMedium,
    low: d.confidenceLow,
  };

  const truncated =
    block.content.length > 200 && !expanded
      ? block.content.slice(0, 200) + "..."
      : block.content;

  return (
    <div className="border border-gray-200 bg-white p-3 space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
            blockTypeColors[block.type],
          )}
        >
          {blockTypeLabel[block.type]}
        </span>
        <span
          className={cn(
            "inline-block px-1.5 py-0.5 text-xs font-medium rounded",
            confidenceColors[block.confidence],
          )}
        >
          {confidenceLabel[block.confidence]}
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {d.page} {block.bbox.page}
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
        {truncated}
      </p>
      {block.content.length > 200 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:underline cursor-pointer"
        >
          {expanded ? "−" : "+"}
        </button>
      )}
    </div>
  );
}

export function ChunkDetailSidebar({ chunk }: { chunk: ReductoChunk }) {
  const d = useDictionary().dashboard;

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500">
        {chunk.blocks.length} {d.blocks.toLowerCase()}
      </div>
      {chunk.blocks.map((block, i) => (
        <BlockCard key={i} block={block} />
      ))}
    </div>
  );
}
