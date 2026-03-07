"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";

const sections = ["profile", "company", "subscriptions", "privacy"] as const;

export function SettingsSidebar() {
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  // Extract locale from pathname (e.g. /pt/dashboard/settings/profile → pt)
  const locale = pathname.split("/")[1];

  return (
    <>
      <h2 className="text-xs text-gray-400 uppercase mb-3">{d.settings}</h2>
      <ul className="space-y-1">
        {sections.map((section) => {
          const href = `/${locale}/dashboard/settings/${section}`;
          const active = pathname.startsWith(href);

          return (
            <li key={section}>
              <Link
                href={href}
                className={cn(
                  "block px-2 py-1.5 text-sm font-heading",
                  active
                    ? "font-bold bg-gray-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {d[section]}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
