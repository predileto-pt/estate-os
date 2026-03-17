import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ContractModelPageContent } from "../../../components/contract-model-page-content";
import { FAKE_CONTRACT_MODELS } from "../../../components/fake-data";
import { notFound } from "next/navigation";

export default async function ContractModelPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const model = FAKE_CONTRACT_MODELS.find((m) => m.uuid === id);
  if (!model) notFound();

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
