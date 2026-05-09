"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileStack,
  Handshake,
  Megaphone,
  Shield,
  Sparkles,
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
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

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
  // Property detail scope (/imoveis/[id]/*) is handled by PropertySubheader
  // in src/app/imoveis/[id]/layout.tsx. The root sidebar falls through to
  // Main scope on those routes.

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
    { key: "anuncios", href: "/anuncios", label: d.anuncios, icon: Megaphone },
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
            <UpgradeEntry dictionary={d} />
          </SidebarMenuItem>
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

type PlanKey = "freemium" | "pro" | "enterprise";

function planLabel(plan: PlanKey, d: Dashboard): string {
  if (plan === "pro") return d.planPro;
  if (plan === "enterprise") return d.planEnterprise;
  return d.planFreemium;
}

/**
 * Upgrade-plan CTA + current-plan badge rendered above the email in the
 * sidebar footer. Reads `useSubscription()` — backend returns a synthetic
 * freemium row when none exists, so there's no first-run empty state to
 * handle. Hidden while the first fetch is in flight so the layout doesn't
 * shift when it resolves.
 */
function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const endMs = new Date(iso).getTime();
  if (Number.isNaN(endMs)) return null;
  return Math.max(0, Math.ceil((endMs - Date.now()) / 86_400_000));
}

function UpgradeEntry({ dictionary: d }: { dictionary: Dashboard }) {
  const { data, isLoading } = useSubscription();
  if (isLoading) {
    return <div className="h-11 px-2" aria-hidden />;
  }
  const plan: PlanKey = data?.plan ?? "freemium";
  const isFreemium = plan === "freemium";
  const isTrialing = data?.status === "trialing";
  const trialDays = isTrialing ? daysUntil(data?.current_period_end) : null;
  const trialLabel =
    trialDays !== null
      ? `${d.trial} · ${d.daysLeft.replace("{count}", String(trialDays))}`
      : d.trial;

  return (
    <div className="flex flex-col gap-1 px-2 py-1">
      <Link
        href="/upgrade"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5",
          "text-xs font-medium text-gray-600 hover:text-gray-900",
          "hover:bg-gray-100 transition-colors",
        )}
      >
        <Sparkles className="size-3.5" />
        <span>{d.upgradePlan}</span>
      </Link>
      <div className="px-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
            isTrialing
              ? "bg-amber-100 text-amber-800"
              : isFreemium
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-900 text-white",
          )}
        >
          {isTrialing ? trialLabel : planLabel(plan, d)}
        </span>
      </div>
    </div>
  );
}
