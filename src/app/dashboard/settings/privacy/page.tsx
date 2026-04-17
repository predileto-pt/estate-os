import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { DeleteAccountButton } from "./components/delete-account-button";

export default async function PrivacyPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const d = dict.dashboard;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold font-heading">{d.privacy}</h1>
      <DeleteAccountButton
        label={d.deleteAccount}
        confirmMessage={d.deleteAccountConfirm}
      />
    </div>
  );
}
