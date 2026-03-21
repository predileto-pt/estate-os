import { Suspense } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { coreGet } from "@/lib/api";
import { ContractModelPageContent } from "../../../components/contract-model-page-content";
import { notFound } from "next/navigation";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type { ContractModel, ReductoParseResult, UploadStatus } from "@/lib/db-types";

type SourceDocumentDetail =
  components["schemas"]["SourceDocumentDetail"];
type SourceDocumentRead =
  components["schemas"]["SourceDocumentRead"];

function mapUploadStatus(apiStatus: string): UploadStatus {
  switch (apiStatus) {
    case "uploaded":
      return "pending";
    case "parsed":
    case "extracted":
      return "processing";
    case "analyzed":
      return "completed";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}

export default async function ContractModelPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);

  let detail: SourceDocumentDetail;
  let doc: SourceDocumentRead;
  try {
    [detail, doc] = await Promise.all([
      coreGet<SourceDocumentDetail>(
        `/api/v1/contracts/source-documents/${id}/detail`,
      ),
      coreGet<SourceDocumentRead>(
        `/api/v1/contracts/source-documents/${id}`,
      ),
    ]);
  } catch {
    notFound();
  }

  const model: ContractModel = {
    uuid: detail.id,
    url: detail.file_url,
    tenant_id: doc.organization_id,
    created_at: detail.created_at,
    source_document: {
      filename: detail.filename,
      page_count: detail.page_count ?? 0,
      language: doc.language_code ?? "pt",
      upload_status: mapUploadStatus(detail.upload_status),
      sha256_hash: doc.document_hash,
    },
    parse_result: detail.parse_response_json
      ? (detail.parse_response_json as unknown as ReductoParseResult)
      : undefined,
  };

  return (
    <Suspense>
      <ContractModelPageContent
        model={model}
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
