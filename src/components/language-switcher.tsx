"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { Select } from "@/components/ui/select";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  // Radix Select's auto-generated IDs (useId) can desync between SSR and
  // the first CSR render under React 19 + Next 16, producing a hydration
  // warning on the trigger's aria-controls. Gating the mount until after
  // hydration sidesteps the entire diff at the cost of one render where
  // the slot is empty.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function switchLocale(newLocale: string) {
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  const options = locales.map((l: Locale) => ({
    value: l,
    label: localeNames[l],
  }));

  if (!mounted) {
    return <div className="h-7" aria-hidden />;
  }

  return (
    <Select
      value={locale}
      onValueChange={switchLocale}
      options={options}
      ariaLabel="Language"
    />
  );
}
