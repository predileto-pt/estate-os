import Link from "next/link";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

export default async function DashboardPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const d = dict.dashboard;

  return (
    <>
      <ul className="space-y-2">
      <li>
        <Link
          href="/formularios"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>{d.intakeFormRequests}</span>
        </Link>
      </li>
      <li>
        <Link
          href="/candidatos"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{d.candidatos}</span>
        </Link>
      </li>
    </ul>
    </>
  );
}
