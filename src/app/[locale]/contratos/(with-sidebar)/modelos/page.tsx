import { Suspense } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { coreGet } from "@/lib/api";
import { ModelsPageContent } from "../../components/models-page-content";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type { ContractModel } from "@/lib/db-types";

type SourceDocumentListItem =
  components["schemas"]["SourceDocumentListItem"];

export default async function ModelosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  let items: SourceDocumentListItem[] = [];
  try {
    items = await coreGet<SourceDocumentListItem[]>(
      "/api/v1/contracts/source-documents/",
    );
  } catch {
    // API unavailable — show empty list
  }

  const models: ContractModel[] = items.map((item) => ({
    uuid: item.id,
    url: item.file_url,
    tenant_id: "",
    created_at: item.created_at,
    source_document: {
      filename: item.filename,
      page_count: item.page_count ?? 0,
      language: "pt",
      upload_status: "completed",
      sha256_hash: "",
    },
  }));

  return (
    <Suspense>
      <ModelsPageContent
        models={models}
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
