import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProperty } from "../../novo/actions";
import { ImageManager } from "./components/image-manager";

export default async function PropertyImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getProperty(id);
  if (result.error !== null) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <Suspense>
        <ImageManager property={result.data} />
      </Suspense>
    </main>
  );
}
