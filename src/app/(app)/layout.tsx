import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { MainHeader } from "@/components/main-header";
import { SubscriptionProvider } from "@/components/subscription-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

// Authenticated shell for the dashboard and every sibling admin route
// (imoveis, candidatos, contratos, propostas, formularios). Route-group
// `(app)/` has no effect on URLs — routes still resolve as `/dashboard`,
// `/imoveis/*`, etc. — but ensures the sidebar + header mount exactly once
// for the whole group so `SidebarProvider` state persists across navigation.
//
// Chrome-free routes (`/upgrade`, `/upgrade/success`, `/login`, `/register`,
// `/auth/*`) live *outside* this group and inherit only root providers.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <SubscriptionProvider>
      <SidebarProvider>
        <AppSidebar email={user.email ?? ""} />
        <SidebarInset>
          <MainHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SubscriptionProvider>
  );
}
