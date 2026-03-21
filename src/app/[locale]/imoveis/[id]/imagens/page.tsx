import { Suspense } from "react";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getProperty } from "../../novo/actions";
import { ImageManager } from "./components/image-manager";

export default async function PropertyImagesPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const result = await getProperty(id);
  if (result.error !== null) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <Suspense>
        <ImageManager
          property={result.data}
          locale={locale as Locale}
        />
      </Suspense>
    </main>
  );
}
