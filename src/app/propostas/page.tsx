import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { ProposalsList } from "./components/proposals-list";

export default async function ProposalsPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  return <ProposalsList dict={dict.dashboard} />;
}
