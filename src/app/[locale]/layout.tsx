import { notFound } from "next/navigation";
import { isValidLocale, getDictionary } from "@/lib/i18n";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { DashboardTopNav } from "@/components/dashboard-top-nav";
import { createClient } from "@/lib/supabase/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DictionaryProvider dictionary={dictionary}>
      {user && <DashboardTopNav locale={locale} email={user.email ?? ""} />}
      {children}
    </DictionaryProvider>
  );
}
