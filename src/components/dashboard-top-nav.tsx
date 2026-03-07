"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n";

export function DashboardTopNav({
  locale,
  email,
}: {
  locale: Locale;
  email: string;
}) {
  const dict = useDictionary();
  const d = dict.dashboard;
  const pathname = usePathname();
  const router = useRouter();

  const applicantsHref = `/${locale}/dashboard/candidatos`;
  const applicantsActive = pathname.startsWith(applicantsHref);
  const settingsHref = `/${locale}/dashboard/settings`;
  const settingsActive = pathname.startsWith(settingsHref);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href={`/${locale}/dashboard`}
            className="text-sm font-bold font-heading"
          >
            Predileto Dashboard
          </Link>
          <Link
            href={applicantsHref}
            className={cn(
              "text-sm font-heading",
              applicantsActive
                ? "text-gray-900 font-bold"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {d.candidatos}
          </Link>
          <Link
            href={settingsHref}
            className={cn(
              "text-sm font-heading",
              settingsActive
                ? "text-gray-900 font-bold"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {d.settings}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-heading text-gray-400 hover:text-gray-600"
          >
            {d.logout}
          </button>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </nav>
  );
}
