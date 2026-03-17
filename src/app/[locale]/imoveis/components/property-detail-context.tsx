"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { components } from "@/lib/api-types";

type PropertyResponse = components["schemas"]["PropertyResponse"];

interface PropertyDetailState {
  selectedId: string | null;
  select: (property: PropertyResponse) => void;
  close: () => void;
}

const PropertyDetailContext = createContext<PropertyDetailState | null>(null);

export function PropertyDetailProvider({
  children,
  properties,
}: {
  children: React.ReactNode;
  properties: PropertyResponse[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("property_id");

  const select = useCallback(
    (property: PropertyResponse) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("property_id") === property.id) {
        params.delete("property_id");
      } else {
        params.set("property_id", property.id);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("property_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <PropertyDetailContext value={value}>
      {children}
    </PropertyDetailContext>
  );
}

export function usePropertyDetail() {
  const ctx = useContext(PropertyDetailContext);
  if (!ctx) throw new Error("usePropertyDetail must be used within PropertyDetailProvider");
  return ctx;
}

export function useSelectedProperty(properties: PropertyResponse[]): PropertyResponse | null {
  const { selectedId } = usePropertyDetail();
  return useMemo(
    () => properties.find((p) => p.id === selectedId) ?? null,
    [properties, selectedId],
  );
}
