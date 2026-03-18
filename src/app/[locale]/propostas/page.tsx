import { getDictionary, type Locale } from "@/lib/i18n";
import { ProposalsList } from "./components/proposals-list";

export default async function ProposalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <ProposalsList dict={dict.dashboard} locale={locale as Locale} />
  );
}
