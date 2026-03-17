"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ManualForm } from "./manual-form";
import { AIForm } from "./ai-form";

type Mode = "manual" | "ai";

export function CreatePropertyContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [mode, setMode] = useState<Mode>("manual");

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/${locale}/imoveis`}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold font-heading">{dict.createProperty}</h1>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={cn(
                "px-4 py-2 text-sm font-medium border transition-colors cursor-pointer",
                mode === "manual"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
              )}
            >
              {dict.createPropertyManual}
            </button>
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={cn(
                "px-4 py-2 text-sm font-medium border transition-colors cursor-pointer",
                mode === "ai"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
              )}
            >
              {dict.createPropertyAI}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-6">
            {mode === "manual"
              ? dict.createPropertyManualDescription
              : dict.createPropertyAIDescription}
          </p>

          {/* Form */}
          {mode === "manual" ? (
            <ManualForm dict={dict} locale={locale} />
          ) : (
            <AIForm dict={dict} locale={locale} />
          )}
        </div>
        <div className="col-span-2" />
      </div>
    </main>
  );
}
