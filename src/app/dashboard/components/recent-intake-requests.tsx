import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { IntakeFormRequestRow } from "@/lib/db-types";
import { formatDate, truncate } from "@/lib/utils";

function statusBadge(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700";
    case "pending":
      return "bg-yellow-50 text-yellow-700";
    case "expired":
      return "bg-gray-100 text-gray-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function statusLabel(status: string, dict: Dictionary["dashboard"]): string {
  switch (status) {
    case "completed":
      return dict.approved;
    case "pending":
      return dict.pending;
    case "expired":
      return dict.rejected;
    default:
      return status;
  }
}

export function RecentIntakeRequests({
  requests,
  dict,
  locale,
}: {
  requests: IntakeFormRequestRow[];
  dict: Dictionary["dashboard"];
  locale: string;
}) {
  return (
    <section className="border border-gray-200 bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold">{dict.recentRequests}</h2>
        <Link
          href="/formularios"
          className="text-xs text-gray-400 hover:text-gray-900"
        >
          {dict.viewAll}
        </Link>
      </header>

      {requests.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-400">{dict.noRecentActivity}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {requests.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {r.applicant_name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {truncate(r.property_title ?? r.applicant_email, 50)} · {formatDate(r.created_at, locale)}
                </p>
              </div>
              <span
                className={`shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded ${statusBadge(r.status)}`}
              >
                {statusLabel(r.status, dict)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
