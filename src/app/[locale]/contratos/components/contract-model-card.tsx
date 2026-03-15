"use client";

import type { ContractModel } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export function ContractModelCard({
  model,
  dict,
  locale,
}: {
  model: ContractModel;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const filename = model.url.split("/").pop() ?? model.url;

  return (
    <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold font-heading text-gray-900 truncate">
          {filename}
        </h3>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="text-gray-400">{dict.createdAt}: </span>
          <span className="font-medium text-gray-700">{formatDate(model.created_at, locale)}</span>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center gap-3">
        <a
          href={model.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {dict.view}
        </a>
        <a
          href={model.url}
          download
          className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {dict.download}
        </a>
      </div>
    </div>
  );
}
