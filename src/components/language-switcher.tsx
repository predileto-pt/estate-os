"use client";

import { useRouter } from "next/navigation";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { Select } from "@/components/ui/select";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  function switchLocale(newLocale: string) {
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  const options = locales.map((l: Locale) => ({
    value: l,
    label: localeNames[l],
  }));

  return (
    <Select
      value={locale}
      onValueChange={switchLocale}
      options={options}
      ariaLabel="Language"
    />
  );
}
