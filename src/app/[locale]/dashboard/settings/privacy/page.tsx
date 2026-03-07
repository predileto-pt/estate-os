import { getDictionary, type Locale } from "@/lib/i18n";
import { DeleteAccountButton } from "./components/delete-account-button";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const d = dict.dashboard;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold font-heading">{d.privacy}</h1>
      <DeleteAccountButton
        label={d.deleteAccount}
        confirmMessage={d.deleteAccountConfirm}
        locale={locale}
      />
    </div>
  );
}
