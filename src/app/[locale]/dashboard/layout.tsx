import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <DashboardSidebar />
        </div>
        <div className="col-span-6">{children}</div>
        <div className="col-span-3">{/* Reserved for future use */}</div>
      </div>
    </main>
  );
}
