import { MainWrapper } from "@/components/main-wrapper";

function Card({ height = "h-48" }: { height?: string }) {
  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className={`px-4 py-4 ${height}`}>
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function PropertyDetailLoading() {
  return (
    <MainWrapper>
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-60 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
          <Card />
          <Card height="h-32" />
          <Card height="h-40" />
        </div>

        <div className="col-span-4">
          <div className="sticky top-4 space-y-6">
            <Card height="h-20" />
            <Card height="h-48" />
            <Card height="h-28" />
            <Card height="h-40" />
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}
