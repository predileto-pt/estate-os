"use client";

import { useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ListingType, Typology } from "@/lib/db-types";
import { presignExtractionFiles, submitExtractionJob } from "../actions";

export function AIForm({
  dict,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [typology, setTypology] = useState<Typology>("apartment");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const listingTypeOptions = [
    { value: "sale", label: dict.sale },
    { value: "purchase", label: dict.purchase },
  ];

  const typologyOptions = [
    { value: "apartment", label: dict.apartment },
    { value: "house", label: dict.house },
    { value: "land", label: dict.land },
    { value: "ruin", label: dict.ruin },
  ];

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const combined = [...files, ...Array.from(incoming)].slice(0, 5);
    setFiles(combined);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1. Get presigned upload URLs (server action — lightweight, no files)
      const presign = await presignExtractionFiles(
        files.map((f) => ({
          filename: f.name,
          content_type: f.type || "application/pdf",
        }))
      );

      if (presign.error !== null) {
        setError(presign.error);
        return;
      }

      const { job_id, files: presignedFiles } = presign.data;

      // 2. Upload files directly to S3 from the browser (sequential to avoid partial uploads)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await fetch(presignedFiles[i].upload_url, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/pdf" },
          body: file,
        });
        if (!res.ok) {
          throw new Error(`Upload failed for ${file.name}: ${res.status}`);
        }
      }

      // 3. Submit the extraction job (server action — lightweight)
      const result = await submitExtractionJob({
        job_id,
        document_keys: presignedFiles.map((f) => f.s3_key),
        listing_type: listingType,
        typology,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-green-200 bg-green-50 px-4 py-6 text-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto text-green-600 mb-3"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <p className="text-sm text-green-800">{dict.aiJobSubmitted}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selects */}
      <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {dict.listingType} *
          </label>
          <Select
            value={listingType}
            onValueChange={(v) => setListingType(v as ListingType)}
            options={listingTypeOptions}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {dict.typology} *
          </label>
          <Select
            value={typology}
            onValueChange={(v) => setTypology(v as Typology)}
            options={typologyOptions}
            className="w-full"
          />
        </div>
      </div>

      {/* File upload */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {dict.files} *
        </label>
        <p className="text-xs text-gray-400 mb-2">{dict.filesHint}</p>

        <div className="border border-amber-200 bg-amber-50 px-3 py-2 mb-3">
          <p className="text-xs text-amber-800">{dict.filesDocumentHint}</p>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 px-6 py-10 text-center cursor-pointer transition-colors"
        >
          <div className="text-center p-4">
            <div className="mx-auto w-10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 mb-2 mx-auto"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{dict.dragOrClick}</p>
            <p className="text-xs text-gray-400 mt-1">{dict.maxFiles}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={(e) => addFiles(e.target.files)}
            className="hidden mx-auto w-10"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between border border-gray-200 bg-white px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 shrink-0"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500 cursor-pointer ml-2"
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
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-2 pb-8 mt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || files.length === 0}
        >
          {submitting ? dict.submitting : dict.submit}
        </Button>
      </div>
    </form>
  );
}
