import Link from "next/link";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { formatDate, truncate } from "@/lib/utils";

type PropertyResponse = components["schemas"]["PropertyResponse"];

function statusBadge(status: PropertyResponse["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "sold":
    case "rented":
      return "bg-blue-50 text-blue-700";
    case "withdrawn":
      return "bg-gray-100 text-gray-400";
  }
}

export function RecentProperties({
  properties,
  dict,
  locale,
}: {
  properties: PropertyResponse[];
  dict: Dictionary["dashboard"];
  locale: string;
}) {
  return (
    <section className="border border-gray-200 bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold">{dict.recentProperties}</h2>
        <Link
          href="/imoveis"
          className="text-xs text-gray-400 hover:text-gray-900"
        >
          {dict.viewAll}
        </Link>
      </header>

      {properties.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400">{dict.noRecentActivity}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {properties.map((p) => (
            <li key={p.id}>
              <Link
                href={`/imoveis/${p.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {truncate(p.address, 60)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {dict[p.typology]} · {dict[p.listing_type]} · {formatDate(p.created_at, locale)}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded ${statusBadge(p.status)}`}
                >
                  {dict[p.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
