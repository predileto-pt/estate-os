"use client";

import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { PropertyCard } from "./property-card";

type PropertyResponse = components["schemas"]["PropertyResponse"];

export function PropertyList({
  properties,
  dict,
}: {
  properties: PropertyResponse[];
  dict: Dictionary["dashboard"];
}) {
  if (properties.length === 0) {
    return <p className="text-sm text-gray-400">{dict.noProperties}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} dict={dict} />
      ))}
    </div>
  );
}
