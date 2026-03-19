import { useMutation } from "@tanstack/react-query";
import type { components } from "@/lib/types/contract-intelligence-service-api";

type UploadResponse =
  components["schemas"]["UploadSourceDocumentResponse"];

export function useUploadSourceDocument() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/contracts/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(body);
      }

      return res.json();
    },
  });
}
