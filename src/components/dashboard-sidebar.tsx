"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import type { Locale } from "@/lib/i18n";

const sidebarItems = [
  { key: "agendamentos" as const, href: "agendamentos" },
];

export function DashboardSidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  return (
    <div className="border border-gray-200 bg-white p-4">
      <h2 className="text-xs text-gray-400 uppercase mb-3">Menu</h2>
      <ul className="space-y-1">
        {sidebarItems.map((item) => {
          const href = `/${locale}/dashboard/${item.href}`;
          const active = pathname.startsWith(href);
          return (
            <li key={item.key}>
              <Link
                href={href}
                className={cn(
                  "block px-2 py-1.5 text-sm font-heading",
                  active
                    ? "font-bold bg-gray-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {d[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
