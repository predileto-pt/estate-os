import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { PropertiesPageContent } from "./components/properties-page-content";

export default async function ImoveisPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Suspense>
      <PropertiesPageContent dict={dict.dashboard} />
    </Suspense>
  );
}
