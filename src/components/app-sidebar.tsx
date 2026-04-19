"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileStack,
  FileText,
  Handshake,
  Home,
  Image as ImageIcon,
  Settings,
  Shield,
  Squircle,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDictionary } from "@/components/dictionary-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

type MenuItem = {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
};

// Main-scope items that should not render yet. Kept in source so flipping
// them back on is a one-line delete; rendered with `hidden` so they stay in
// the DOM for screen readers and keyboard users if needed later.
const HIDDEN_MAIN_ITEMS = new Set<string>([
  "formularios",
  "candidatos",
  "propostas",
  "contratos",
]);

type Dashboard = ReturnType<typeof useDictionary>["dashboard"];

function resolveItems(pathname: string, d: Dashboard): MenuItem[] {
  // Property scope: /imoveis/[id] or /imoveis/[id]/<tab> (not "novo")
  const propertyMatch = pathname.match(/^\/imoveis\/([^/]+)(?:\/|$)/);
  if (propertyMatch && propertyMatch[1] !== "novo") {
    const id = propertyMatch[1];
    return [
      { key: "overview", href: `/imoveis/${id}`, label: d.overview, icon: Home },
      { key: "images", href: `/imoveis/${id}/imagens`, label: d.images, icon: ImageIcon },
      { key: "documents", href: `/imoveis/${id}/documents`, label: d.documents, icon: FileText },
      { key: "analytics", href: `/imoveis/${id}/analytics`, label: d.analytics, icon: BarChart3 },
      { key: "settings", href: `/imoveis/${id}/settings`, label: d.settings, icon: Settings },
    ];
  }

  if (pathname.startsWith("/dashboard/settings")) {
    return [
      { key: "profile", href: "/dashboard/settings/profile", label: d.profile, icon: User },
      { key: "organization", href: "/dashboard/settings/organization", label: d.organization, icon: Building2 },
      { key: "subscriptions", href: "/dashboard/settings/subscriptions", label: d.subscriptions, icon: CreditCard },
      { key: "privacy", href: "/dashboard/settings/privacy", label: d.privacy, icon: Shield },
    ];
  }

  // Contratos scope: only list pages, not detail/novo
  if (
    pathname === "/contratos" ||
    pathname === "/contratos/" ||
    pathname === "/contratos/modelos" ||
    pathname === "/contratos/modelos/"
  ) {
    return [
      { key: "contratos", href: "/contratos", label: d.contratos, icon: FileSignature },
      { key: "modelos", href: "/contratos/modelos", label: d.contractModels, icon: FileStack },
    ];
  }

  // Main scope
  return [
    { key: "dashboard", href: "/dashboard", label: d.dashboard, icon: Squircle },
    { key: "formularios", href: "/formularios", label: d.intakeFormRequests, icon: ClipboardList },
    { key: "candidatos", href: "/candidatos", label: d.candidatos, icon: Users },
    { key: "imoveis", href: "/imoveis", label: d.imoveis, icon: Building2 },
    { key: "propostas", href: "/propostas", label: d.propostas, icon: Handshake },
    { key: "contratos", href: "/contratos", label: d.contratos, icon: FileSignature },
  ];
}

function matchLength(pathname: string, href: string): number {
  if (pathname === href || pathname === `${href}/`) return href.length;
  if (pathname.startsWith(`${href}/`)) return href.length;
  return -1;
}

function resolveActiveKey(pathname: string, items: MenuItem[]): string | null {
  let bestKey: string | null = null;
  let bestLength = -1;
  for (const item of items) {
    const len = matchLength(pathname, item.href);
    if (len > bestLength) {
      bestLength = len;
      bestKey = item.key;
    }
  }
  return bestKey;
}

export function AppSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  const items = resolveItems(pathname, d);
  const activeKey = resolveActiveKey(pathname, items);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <span className="text-sm font-bold font-heading">Predileto</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const isHidden = HIDDEN_MAIN_ITEMS.has(item.key);
                return (
                  <SidebarMenuItem
                    key={item.key}
                    className={isHidden ? "hidden" : undefined}
                  >
                    <SidebarMenuButton
                      isActive={item.key === activeKey}
                      render={<Link href={item.href} />}
                    >
                      <Icon className="size-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1 text-xs text-muted-foreground truncate">
              {email}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-2 py-1">
              <LanguageSwitcher />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
