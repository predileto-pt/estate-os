import { cookies } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, isValidLocale, type Locale } from "./i18n";

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  return raw && isValidLocale(raw) ? raw : defaultLocale;
}
