"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";

const icons: Record<string, React.ReactNode> = {
  contratos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  modelos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="M9 15h6" />
    </svg>
  ),
};

export function ContratosSidebar() {
  const pathname = usePathname();
  const d = useDictionary().dashboard;

  const sections = [
    { key: "contratos", href: "/contratos", label: d.contratos },
    { key: "modelos", href: "/contratos/modelos", label: d.contractModels },
  ];

  return (
    <>
      <h2 className="text-xs text-gray-400 uppercase mb-3">{d.contratos}</h2>
      <ul className="space-y-1">
        {sections.map((section) => {
          const active =
            section.key === "contratos"
              ? pathname === section.href || pathname === `${section.href}/`
              : pathname.startsWith(section.href);

          return (
            <li key={section.key}>
              <Link
                href={section.href}
                className={cn(
                  "flex items-center gap-2 py-1.5 text-sm font-heading",
                  active
                    ? "font-bold bg-gray-50 border-l-2 border-gray-900 pl-2 pr-2"
                    : "text-gray-400 hover:text-gray-600 pl-[calc(0.5rem+2px)] pr-2",
                )}
              >
                {icons[section.key]}
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
