import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { getProperty } from "../novo/actions";
import { notFound } from "next/navigation";
import { PropertyDetailContent } from "../components/property-detail-content";
import { MainWrapper } from "@/components/main-wrapper";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const result = await getProperty(id);
  if (result.error !== null) notFound();

  return (
    <MainWrapper>
      <Suspense>
        <PropertyDetailContent
          property={result.data}
          dict={dict.dashboard}
        />
      </Suspense>
    </MainWrapper>
  );
}
