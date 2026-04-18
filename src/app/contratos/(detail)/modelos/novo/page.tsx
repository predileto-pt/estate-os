import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { UploadContractContent } from "../../../components/upload-contract-content";

export default async function UploadContractPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Suspense>
      <UploadContractContent dict={dict.dashboard} />
    </Suspense>
  );
}
