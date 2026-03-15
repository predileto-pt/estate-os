"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Property } from "@/lib/db-types";

interface PropertyDetailState {
  selectedId: string | null;
  select: (property: Property) => void;
  close: () => void;
}

const PropertyDetailContext = createContext<PropertyDetailState | null>(null);

export function PropertyDetailProvider({
  children,
  properties,
}: {
  children: React.ReactNode;
  properties: Property[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("property_id");

  const select = useCallback(
    (property: Property) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("property_id") === property.uuid) {
        params.delete("property_id");
      } else {
        params.set("property_id", property.uuid);
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

export function useSelectedProperty(properties: Property[]): Property | null {
  const { selectedId } = usePropertyDetail();
  return useMemo(
    () => properties.find((p) => p.uuid === selectedId) ?? null,
    [properties, selectedId],
  );
}
