import { cache } from "react";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";
export const LOCALE_COOKIE = "locale";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export type Dictionary = Awaited<typeof import("@/dictionaries/pt.json")>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import("@/dictionaries/pt.json"),
  en: () => import("@/dictionaries/en.json"),
};

export const getDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    const mod = await dictionaries[locale]();
    return { ...mod };
  },
);

export const localeNames: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
};

export const localeToDateLocale: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-GB",
};
