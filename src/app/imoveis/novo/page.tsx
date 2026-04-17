import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { CreatePropertyContent } from "./components/create-property-content";

export default async function NovoImovelPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Suspense>
      <CreatePropertyContent dict={dict.dashboard} />
    </Suspense>
  );
}
