"use client";

import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { PropertyCard } from "./property-card";

type PropertyResponse = components["schemas"]["PropertyResponse"];

export function PropertyList({
  properties,
  dict,
  locale,
}: {
  properties: PropertyResponse[];
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  if (properties.length === 0) {
    return (
      <p className="text-sm text-gray-400">{dict.noProperties}</p>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} dict={dict} locale={locale} />
      ))}
    </div>
  );
}
