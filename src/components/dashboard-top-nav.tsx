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

  const applicantsHref = `/${locale}/candidatos`;
  const applicantsActive = pathname.startsWith(applicantsHref);
  const intakeFormsHref = `/${locale}/intake-form-requests`;
  const intakeFormsActive = pathname.startsWith(intakeFormsHref);
  const settingsActive = pathname.startsWith(`/${locale}/dashboard/settings`);

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
            href={intakeFormsHref}
            className={cn(
              "text-sm font-heading",
              intakeFormsActive
                ? "text-gray-900 font-bold"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {d.intakeFormRequests}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{email}</span>
          <Link
            href={`/${locale}/dashboard/settings`}
            className={cn(
              settingsActive
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600",
            )}
            title={d.settings}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
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
