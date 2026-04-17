export default function CandidatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2" />
        <div className="col-span-8">{children}</div>
        <div className="col-span-2" />
      </div>
    </main>
  );
}
