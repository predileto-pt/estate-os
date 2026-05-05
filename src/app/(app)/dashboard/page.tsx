import { Building2, ClipboardList, FileSignature, Users } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { MainWrapper } from "@/components/main-wrapper";
import { getProperties } from "../imoveis/novo/actions";
import { getRecentIntakeFormRequests } from "./actions";
import { StatCard } from "./components/stat-card";
import { RecentProperties } from "./components/recent-properties";
import { RecentIntakeRequests } from "./components/recent-intake-requests";

export default async function DashboardPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const d = dict.dashboard;

  const [propertiesResult, requests] = await Promise.all([
    getProperties(),
    getRecentIntakeFormRequests(5),
  ]);

  const properties =
    propertiesResult.error === null ? propertiesResult.data : [];

  const activeCount = properties.filter((p) => p.status === "active").length;
  const draftCount = properties.filter((p) => p.status === "draft").length;
  const pendingRequestsCount = requests.filter(
    (r) => r.status === "pending",
  ).length;

  const recentProperties = [...properties]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <MainWrapper>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label={d.activeProperties}
          value={activeCount}
          icon={Building2}
          tone="accent"
          href="/imoveis"
        />
        <StatCard
          label={d.draftProperties}
          value={draftCount}
          icon={ClipboardList}
          tone="muted"
          href="/imoveis"
        />
        <StatCard
          label={d.pendingRequests}
          value={pendingRequestsCount}
          icon={Users}
          href="/formularios"
        />
        <StatCard
          label={d.contratos}
          value={0}
          icon={FileSignature}
          tone="muted"
          href="/contratos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentProperties
          properties={recentProperties}
          dict={d}
          locale={locale}
        />
        <RecentIntakeRequests
          requests={requests}
          dict={d}
          locale={locale}
        />
      </div>
    </MainWrapper>
  );
}
