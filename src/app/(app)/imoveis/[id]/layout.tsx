import { PropertySubheader } from "@/components/layout/property-subheader";

export default async function PropertyDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col">
      <PropertySubheader id={id} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
