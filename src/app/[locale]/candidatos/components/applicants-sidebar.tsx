"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";

const icons: Record<string, React.ReactNode> = {
  pending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  approved: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  rejected: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
  all: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
};

const statusFilters = ["pending", "approved", "rejected", "all"] as const;

export function ApplicantsSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  const current = searchParams.get("status") ?? "pending";

  return (
    <>
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
                  "flex items-center gap-2 py-1.5 text-sm font-heading",
                  current === status
                    ? "font-bold bg-gray-50 border-l-2 border-gray-900 pl-2 pr-2"
                    : "text-gray-400 hover:text-gray-600 pl-[calc(0.5rem+2px)] pr-2",
                )}
              >
                {icons[status]}
                {d[status]}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
