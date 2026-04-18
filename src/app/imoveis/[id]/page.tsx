import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { getProperty, getPropertyAmenities } from "../novo/actions";
import { notFound } from "next/navigation";
import { PropertyDetailContent } from "../components/property-detail-content";

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

  const [result, amenitiesResult] = await Promise.all([
    getProperty(id),
    getPropertyAmenities(id),
  ]);
  if (result.error !== null) notFound();

  const amenities = amenitiesResult.error === null ? amenitiesResult.data : [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <Suspense>
        <PropertyDetailContent
          property={result.data}
          amenities={amenities}
          dict={dict.dashboard}
        />
      </Suspense>
    </main>
  );
}
