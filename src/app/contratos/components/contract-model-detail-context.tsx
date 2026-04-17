"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ContractModel } from "@/lib/db-types";

interface ContractModelDetailState {
  selectedId: string | null;
  select: (model: ContractModel) => void;
  close: () => void;
}

const ContractModelDetailContext =
  createContext<ContractModelDetailState | null>(null);

export function ContractModelDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("model_id");

  const select = useCallback(
    (model: ContractModel) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("model_id") === model.uuid) {
        params.delete("model_id");
      } else {
        params.set("model_id", model.uuid);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("model_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <ContractModelDetailContext value={value}>
      {children}
    </ContractModelDetailContext>
  );
}

export function useContractModelDetail() {
  const ctx = useContext(ContractModelDetailContext);
  if (!ctx)
    throw new Error(
      "useContractModelDetail must be used within ContractModelDetailProvider",
    );
  return ctx;
}

export function useSelectedContractModel(
  models: ContractModel[],
): ContractModel | null {
  const { selectedId } = useContractModelDetail();
  return useMemo(
    () => models.find((m) => m.uuid === selectedId) ?? null,
    [models, selectedId],
  );
}
