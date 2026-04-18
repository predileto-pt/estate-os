import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { QueryProvider } from "@/components/query-provider";
import { GlobalLoadingProvider } from "@/components/ui/global-loading-overlay";
import { DashboardTopNav } from "@/components/dashboard-top-nav";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Predileto Dashboard",
  description: "Manage property visit requests",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookie();
  const dictionary = await getDictionary(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen">
        <QueryProvider>
          <DictionaryProvider dictionary={dictionary} locale={locale}>
            <GlobalLoadingProvider>
              {user && <DashboardTopNav email={user.email ?? ""} />}
              {children}
            </GlobalLoadingProvider>
          </DictionaryProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
