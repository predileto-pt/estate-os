import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProperty } from "../../novo/actions";
import { ImageManager } from "./components/image-manager";
import { MainWrapper } from "@/components/main-wrapper";

export default async function PropertyImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getProperty(id);
  if (result.error !== null) notFound();

  return (
    <MainWrapper>
      <Suspense>
        <ImageManager property={result.data} />
      </Suspense>
    </MainWrapper>
  );
}
