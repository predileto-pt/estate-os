"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreview({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[200px] text-xs text-gray-400">
        PDF preview unavailable
      </div>
    );
  }

  return (
    <Document
      file={url}
      onLoadError={() => setError(true)}
      loading={
        <div className="flex items-center justify-center w-full h-[200px] text-xs text-gray-400">
          Loading...
        </div>
      }
    >
      <Page
        pageNumber={1}
        width={388}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}
