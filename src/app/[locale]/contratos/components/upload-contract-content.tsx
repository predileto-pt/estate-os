"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useUploadSourceDocument } from "@/lib/api/hooks/use-upload-source-document";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = ".pdf,.docx";

export function UploadContractContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useUploadSourceDocument();

  const handleFileChange = useCallback(
    (f: File | null) => {
      setFile(f);
      reset();
    },
    [reset]
  );

  const handleUpload = useCallback(() => {
    if (!file) return;
    mutate(file, {
      onSuccess: (res) => {
        router.push(`/${locale}/contratos/modelos/${res.id}`);
      },
    });
  }, [file, mutate, locale, router]);

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-bold font-heading mb-1">
        {dict.uploadContractModel}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        {dict.uploadContractDescription}
      </p>

      <FileUpload
        accept={ACCEPTED_EXTENSIONS}
        acceptMimeTypes={ACCEPTED_MIME_TYPES}
        file={file}
        onFileChange={handleFileChange}
        labels={{
          hint: dict.dragDropHint,
          formats: dict.acceptedFormats,
          fileSize: dict.fileSize,
          remove: dict.removeFile,
        }}
      />

      {/* Error */}
      {isError && (
        <p className="mt-3 text-sm text-red-600">
          {dict.uploadError}
          {error?.message && (
            <span className="block text-xs mt-1 text-red-400">
              {error.message}
            </span>
          )}
        </p>
      )}

      {/* Success */}
      {isSuccess && data && (
        <p className="mt-3 text-sm text-green-600">{dict.uploadSuccess}</p>
      )}

      {/* Upload button */}
      <div className="mt-6">
        <Button
          variant="primary"
          disabled={!file || isPending}
          onClick={handleUpload}
        >
          {isPending ? dict.uploading : dict.uploadButton}
        </Button>
      </div>
    </div>
  );
}
