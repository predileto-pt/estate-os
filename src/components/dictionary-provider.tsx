"use client";

import { createContext, useContext } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

type DictionaryContextValue = {
  dictionary: Dictionary;
  locale: Locale;
};

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const ctx = useContext(DictionaryContext);
  if (!ctx)
    throw new Error("useDictionary must be used within DictionaryProvider");
  return ctx.dictionary;
}

export function useLocale(): Locale {
  const ctx = useContext(DictionaryContext);
  if (!ctx)
    throw new Error("useLocale must be used within DictionaryProvider");
  return ctx.locale;
}
