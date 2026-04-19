"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Settings, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/dictionary-provider";
import { createClient } from "@/lib/supabase/client";

type Crumb = { label: string; href?: string };

type Dashboard = ReturnType<typeof useDictionary>["dashboard"];

function buildCrumbs(pathname: string, d: Dashboard): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // /dashboard[/settings[/<sub>]]
  if (segments[0] === "dashboard") {
    if (segments[1] === "settings") {
      const crumbs: Crumb[] = [{ label: d.settings, href: "/dashboard/settings" }];
      const sub = segments[2];
      const subLabels: Record<string, string> = {
        profile: d.profile,
        organization: d.organization,
        subscriptions: d.subscriptions,
        privacy: d.privacy,
      };
      if (sub && subLabels[sub]) crumbs.push({ label: subLabels[sub] });
      return crumbs;
    }
    return [{ label: d.dashboard }];
  }

  // /imoveis[/<id>[/<tab>]]
  if (segments[0] === "imoveis") {
    const crumbs: Crumb[] = [{ label: d.imoveis, href: "/imoveis" }];
    const id = segments[1];
    if (!id) return crumbs;
    if (id === "novo") {
      crumbs.push({ label: d.addProperty });
      return crumbs;
    }
    crumbs.push({ label: d.property, href: `/imoveis/${id}` });
    const tab = segments[2];
    const tabLabels: Record<string, string> = {
      imagens: d.images,
      documents: d.documents,
      analytics: d.analytics,
      settings: d.settings,
    };
    if (tab && tabLabels[tab]) crumbs.push({ label: tabLabels[tab] });
    return crumbs;
  }

  // /contratos[/modelos[/<id>|/novo]]
  if (segments[0] === "contratos") {
    const crumbs: Crumb[] = [{ label: d.contratos, href: "/contratos" }];
    if (segments[1] === "modelos") {
      const hasDetail = Boolean(segments[2]);
      crumbs.push({
        label: d.contractModels,
        href: hasDetail ? "/contratos/modelos" : undefined,
      });
    }
    return crumbs;
  }

  if (segments[0] === "candidatos") return [{ label: d.candidatos }];
  if (segments[0] === "propostas") return [{ label: d.propostas }];
  if (segments[0] === "formularios") return [{ label: d.intakeFormRequests }];

  return [];
}

export function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dict = useDictionary();
  const d = dict.dashboard;

  const crumbs = buildCrumbs(pathname, d);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center border-b">
      <div className="flex h-full items-center justify-center border-r px-4">
        <SidebarTrigger />
      </div>
      <div className="flex flex-1 items-center gap-2 px-4">
        {crumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                const hideOnMobile = !isLast;
                return (
                  <div
                    key={`${i}-${crumb.label}`}
                    className="flex items-center gap-2"
                  >
                    <BreadcrumbItem
                      className={hideOnMobile ? "hidden md:block" : undefined}
                    >
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard/settings"
            aria-label={d.settings}
            title={d.settings}
            className="inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="size-4" />
          </Link>
          <Button variant="default" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" />
            <span>{d.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
