import { ApplicantsSidebar } from "./components/applicants-sidebar";

export default function CandidatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div className="border border-gray-200 bg-white p-4">
            <ApplicantsSidebar />
          </div>
        </div>
        <div className="col-span-6">{children}</div>
        <div className="col-span-3" />
      </div>
    </main>
  );
}
