"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";

const icons: Record<string, React.ReactNode> = {
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  organization: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  ),
  subscriptions: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  privacy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const sections = ["profile", "organization", "subscriptions", "privacy"] as const;

export function SettingsSidebar() {
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  return (
    <>
      <h2 className="text-xs text-gray-400 uppercase mb-3">{d.settings}</h2>
      <ul className="space-y-1">
        {sections.map((section) => {
          const href = `/dashboard/settings/${section}`;
          const active = pathname.startsWith(href);

          return (
            <li key={section}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 py-1.5 text-sm font-heading",
                  active
                    ? "font-bold bg-gray-50 border-l-2 border-gray-900 pl-2 pr-2"
                    : "text-gray-400 hover:text-gray-600 pl-[calc(0.5rem+2px)] pr-2",
                )}
              >
                {icons[section]}
                {d[section]}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
