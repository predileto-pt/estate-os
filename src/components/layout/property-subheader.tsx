"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Home,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { cn } from "@/lib/utils";

type Item = {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
};

function matchLength(pathname: string, href: string): number {
  if (pathname === href || pathname === `${href}/`) return href.length;
  if (pathname.startsWith(`${href}/`)) return href.length;
  return -1;
}

function resolveActiveKey(pathname: string, items: Item[]): string | null {
  let bestKey: string | null = null;
  let bestLength = -1;
  for (const item of items) {
    const len = matchLength(pathname, item.href);
    if (len > bestLength) {
      bestLength = len;
      bestKey = item.key;
    }
  }
  return bestKey;
}

export function PropertySubheader({ id }: { id: string }) {
  const pathname = usePathname();
  const dict = useDictionary();
  const d = dict.dashboard;

  const items: Item[] = [
    { key: "overview", href: `/imoveis/${id}`, label: d.overview, icon: Home },
    {
      key: "images",
      href: `/imoveis/${id}/imagens`,
      label: d.images,
      icon: ImageIcon,
    },
    {
      key: "documents",
      href: `/imoveis/${id}/documents`,
      label: d.documents,
      icon: FileText,
    },
    {
      key: "analytics",
      href: `/imoveis/${id}/analytics`,
      label: d.analytics,
      icon: BarChart3,
    },
    {
      key: "settings",
      href: `/imoveis/${id}/settings`,
      label: d.settings,
      icon: Settings,
    },
  ];

  const activeKey = resolveActiveKey(pathname, items);

  return (
    <nav aria-label={d.property} className="border-b border-gray-200 bg-white">
      <ul className="flex items-center gap-1 overflow-x-auto px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-2 -mb-px border-b-2 px-3 text-xs p-2",
                  isActive
                    ? "border-gray-900 text-gray-900 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
