"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MainWrapper } from "@/components/main-wrapper";
import { ManualForm } from "./manual-form";
import { AIForm } from "./ai-form";

type Mode = "manual" | "ai";

export function CreatePropertyContent({
  dict,
}: {
  dict: Dictionary["dashboard"];
}) {
  const [mode, setMode] = useState<Mode>("manual");

  return (
    <MainWrapper>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/imoveis"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold font-heading">
              {dict.createProperty}
            </h1>
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
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              {dict.createPropertyManual}
            </button>
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={cn(
                "px-4 flex py-2 text-sm font-medium border transition-colors cursor-pointer",
                mode === "ai"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              {dict.createPropertyAI}
              <span className="mt-0.5 shrink-0 ml-1">
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
              </span>
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
            <ManualForm dict={dict} />
          ) : (
            <AIForm dict={dict} />
          )}
        </div>
        <div className="col-span-2" />
      </div>
    </MainWrapper>
  );
}
