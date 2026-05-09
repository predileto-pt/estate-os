import { notFound } from "next/navigation";
import { MainWrapper } from "@/components/main-wrapper";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { getPropertyPois } from "../actions";
import { PoiList } from "./components/poi-list";

export default async function PropertyPoisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  const result = await getPropertyPois(id);
  if (result.error !== null) notFound();

  return (
    <MainWrapper>
      <PoiList propertyId={id} pois={result.data} dict={dict.dashboard} />
    </MainWrapper>
  );
}
