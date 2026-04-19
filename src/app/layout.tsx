import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { QueryProvider } from "@/components/query-provider";
import { GlobalLoadingProvider } from "@/components/ui/global-loading-overlay";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MainHeader } from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
              {user ? (
                <SidebarProvider>
                  <AppSidebar email={user.email ?? ""} />
                  <SidebarInset>
                    <MainHeader />
                    {children}
                  </SidebarInset>
                </SidebarProvider>
              ) : (
                <main className="min-h-screen">{children}</main>
              )}
            </GlobalLoadingProvider>
          </DictionaryProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
