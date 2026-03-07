"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";

const statusFilters = ["pending", "approved", "rejected", "all"] as const;

export function AgendamentosSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  const current = searchParams.get("status") ?? "pending";

  return (
    <div className="border border-gray-200 bg-white p-4 mb-4">
      <h2 className="text-xs text-gray-400 uppercase mb-3">{d.status}</h2>
      <ul className="space-y-1">
        {statusFilters.map((status) => {
          const params = new URLSearchParams();
          if (status !== "pending") params.set("status", status);
          const href = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;

          return (
            <li key={status}>
              <Link
                href={href}
                className={cn(
                  "block px-2 py-1.5 text-sm font-heading",
                  current === status
                    ? "font-bold bg-gray-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {d[status]}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
