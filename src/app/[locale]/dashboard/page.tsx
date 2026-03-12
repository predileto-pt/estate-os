import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const d = dict.dashboard;

  return (
    <ul className="space-y-2">
      <li>
        <Link
          href={`/${locale}/formularios`}
          className="text-sm text-green-700 hover:underline"
        >
          {d.intakeFormRequests}
        </Link>
      </li>
      <li>
        <Link
          href={`/${locale}/candidatos`}
          className="text-sm text-green-700 hover:underline"
        >
          {d.candidatos}
        </Link>
      </li>
    </ul>
  );
}
