import { ContratosSidebar } from "./components/contratos-sidebar";
import { ContractToolsSidebar } from "./components/contract-tools-sidebar";

export default function ContratosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <ContratosSidebar />
        </div>
        <div className="col-span-8">{children}</div>
        <div className="col-span-2">
          <ContractToolsSidebar />
        </div>
      </div>
    </main>
  );
}
