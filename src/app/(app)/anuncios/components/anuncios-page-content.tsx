"use client";

import { useEffect, useState } from "react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { MainWrapper } from "@/components/main-wrapper";
import { PropertyList } from "@/app/(app)/imoveis/components/property-list";
import { getProperties } from "@/app/(app)/imoveis/novo/actions";

type PropertyResponse = components["schemas"]["PropertyResponse"];

export function AnunciosPageContent({
  dict,
}: {
  dict: Dictionary["dashboard"];
}) {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getProperties();
      if (result.error === null) {
        setProperties(result.data.filter((p) => p.status === "active"));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <MainWrapper>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold font-heading">{dict.anuncios}</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-3/5 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p className="text-sm text-gray-400">{dict.noAnuncios}</p>
      ) : (
        <PropertyList properties={properties} dict={dict} />
      )}
    </MainWrapper>
  );
}
