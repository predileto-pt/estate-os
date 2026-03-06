import { DashboardSidebar } from "@/components/dashboard-sidebar";
import type { Locale } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <DashboardSidebar locale={locale as Locale} />
        </div>
        <div className="col-span-6">{children}</div>
        <div className="col-span-3">{/* Reserved for future use */}</div>
      </div>
    </main>
  );
}
