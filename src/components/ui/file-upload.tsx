"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  /** Comma-separated extensions, e.g. ".pdf,.docx" */
  accept?: string;
  /** MIME types for drag-and-drop validation */
  acceptMimeTypes?: string[];
  /** Currently selected file (controlled) */
  file: File | null;
  /** Called when user selects or drops a valid file */
  onFileChange: (file: File | null) => void;
  /** Labels — keeps i18n out of the component */
  labels: {
    hint: string;
    formats: string;
    fileSize: string;
    remove: string;
  };
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  acceptMimeTypes,
  file,
  onFileChange,
  labels,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      if (!acceptMimeTypes || acceptMimeTypes.includes(f.type)) {
        onFileChange(f);
      }
    },
    [acceptMimeTypes, onFileChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onFileChange]);

  return (
    <div className={cn(className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            dragOver
              ? "border-green-500 bg-green-50"
              : "border-[var(--border)] hover:border-green-400"
          }
        `}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-3 text-[var(--text-tertiary)]"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">{labels.hint}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          {labels.formats}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Selected file info */}
      {file && (
        <div className="mt-4 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {labels.fileSize}: {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="text-xs text-red-500 hover:text-red-700 ml-3 shrink-0 cursor-pointer"
          >
            {labels.remove}
          </button>
        </div>
      )}
    </div>
  );
}
