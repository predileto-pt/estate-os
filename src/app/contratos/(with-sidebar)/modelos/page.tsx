import { Suspense } from "react";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { coreGet } from "@/lib/api";
import { ModelsPageContent } from "../../components/models-page-content";
import { FAKE_CONTRACT_MODELS } from "../../components/fake-data";
import type { components } from "@/lib/types/contract-intelligence-service-api";
import type { ContractModel } from "@/lib/db-types";

type SourceDocumentListItem =
  components["schemas"]["SourceDocumentListItem"];

export default async function ModelosPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  let models: ContractModel[] = [];
  try {
    const items = await coreGet<SourceDocumentListItem[]>(
      "/api/v1/admin/contracts/source-documents",
    );
    models = items.map((item) => ({
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
  } catch {
    // API unavailable
  }

  // Append fake models so the UI is never empty during development
  const fakeModels = FAKE_CONTRACT_MODELS.map(({ parse_result, ...rest }) => rest);
  models = [...models, ...fakeModels];

  return (
    <Suspense>
      <ModelsPageContent models={models} dict={dict.dashboard} />
    </Suspense>
  );
}
