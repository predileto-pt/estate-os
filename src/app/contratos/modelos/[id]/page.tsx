import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { coreGet } from "@/lib/api";
import { ContractModelPageContent } from "../../components/contract-model-page-content";
import {
  FAKE_CONTRACT_MODELS,
  FAKE_SOURCE_SECTIONS,
  FAKE_FIELD_EVIDENCE,
  FAKE_SECTION_ANALYSIS_BUNDLE,
} from "../../components/fake-data";
import { notFound } from "next/navigation";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type { ContractModel, ReductoParseResult, UploadStatus } from "@/lib/db-types";

type SourceDocumentDetail =
  components["schemas"]["SourceDocumentDetail"];
type SourceDocumentRead =
  components["schemas"]["SourceDocumentRead"];
type SourceSectionRead =
  components["schemas"]["SourceSectionRead"];
type FieldEvidenceRead =
  components["schemas"]["FieldEvidenceRead"];
type SourceReviewBundleRead =
  components["schemas"]["SourceReviewBundleRead"];

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  let model: ContractModel;
  let sections: SourceSectionRead[] = [];
  let fieldEvidence: FieldEvidenceRead[] = [];
  let useFakeExtras = false;

  try {
    const [detail, doc] = await Promise.all([
      coreGet<SourceDocumentDetail>(
        `/api/v1/admin/contracts/source-documents/${id}/detail`,
      ),
      coreGet<SourceDocumentRead>(
        `/api/v1/admin/contracts/source-documents/${id}`,
      ),
    ]);

    model = {
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

    // Try to fetch review bundle (sections + field evidence)
    try {
      const reviewBundle = await coreGet<SourceReviewBundleRead>(
        `/api/v1/admin/contracts/review/source-documents/${id}`,
      );
      sections = reviewBundle.sections;
      fieldEvidence = reviewBundle.field_evidence;
    } catch {
      // Review data not available yet
    }
  } catch {
    const fakeModel = FAKE_CONTRACT_MODELS.find((m) => m.uuid === id);
    if (!fakeModel) notFound();
    model = fakeModel;
    useFakeExtras = true;
  }

  return (
    <Suspense>
      <ContractModelPageContent
        model={model}
        dict={dict.dashboard}
        sections={useFakeExtras ? FAKE_SOURCE_SECTIONS : sections}
        fieldEvidence={useFakeExtras ? FAKE_FIELD_EVIDENCE : fieldEvidence}
        analysisBundle={useFakeExtras ? FAKE_SECTION_ANALYSIS_BUNDLE : null}
      />
    </Suspense>
  );
}
