"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import type { ReductoChunk } from "@/lib/db-types";

function extractHeading(content: string): string | null {
  const match = content.match(/^##?\s+(.+)/m);
  return match ? match[1].trim() : null;
}

function getPageRange(chunk: ReductoChunk): string {
  const pages = chunk.blocks.map((b) => b.bbox.page);
  const min = Math.min(...pages);
  const max = Math.max(...pages);
  return min === max ? `${min}` : `${min}-${max}`;
}

export function ChunkCard({
  chunk,
  index,
  selected,
  onClick,
}: {
  chunk: ReductoChunk;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const d = useDictionary().dashboard;
  const heading = extractHeading(chunk.content);
  const title = heading ?? `${d.chunk} ${index + 1}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full border border-gray-200 border-l-4 bg-white p-4 transition-all cursor-pointer hover:shadow-sm",
        selected
          ? "border-l-blue-400 ring-2 ring-blue-400"
          : "border-l-gray-300 hover:border-l-gray-400",
      )}
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-2 text-left">{title}</h3>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h4 className="text-sm font-bold text-gray-800 mb-1 text-left">{children}</h4>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm font-semibold text-gray-700 mb-1 text-left">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-sm text-gray-500 leading-7 mb-2 text-justify">{children}</p>
          ),
        }}
      >
        {chunk.content}
      </ReactMarkdown>
      <div className="flex items-center gap-2">
        <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
          {chunk.blocks.length} {d.blocks.toLowerCase()}
        </span>
        <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
          {d.page} {getPageRange(chunk)}
        </span>
      </div>
    </button>
  );
}
