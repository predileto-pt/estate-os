import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { QueryProvider } from "@/components/query-provider";
import { GlobalLoadingProvider } from "@/components/ui/global-loading-overlay";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Predileto Dashboard",
  description: "Manage property visit requests",
};

// Providers only. Authenticated chrome (sidebar + header + Supabase guard)
// lives in `(app)/layout.tsx`; bare routes like `/login`, `/register`, `/auth`,
// `/upgrade`, and `/upgrade/success` inherit only this root layout.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookie();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen">
        <QueryProvider>
          <DictionaryProvider dictionary={dictionary} locale={locale}>
            <GlobalLoadingProvider>{children}</GlobalLoadingProvider>
          </DictionaryProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
