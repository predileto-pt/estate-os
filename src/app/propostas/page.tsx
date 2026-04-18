import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { ProposalsList } from "./components/proposals-list";

export default async function ProposalsPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  return <ProposalsList dict={dict.dashboard} />;
}
