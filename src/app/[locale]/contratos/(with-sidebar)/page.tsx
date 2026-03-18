import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ContractsPageContent } from "../components/contracts-page-content";

export default async function ContratosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Suspense>
      <ContractsPageContent
        dict={dict.dashboard}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
