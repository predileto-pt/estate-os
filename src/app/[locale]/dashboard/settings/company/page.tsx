import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CompanyForm } from "./components/company-form";
import type { CompanyRow } from "@/lib/db-types";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .single<CompanyRow>();

  return <CompanyForm company={company} />;
}
