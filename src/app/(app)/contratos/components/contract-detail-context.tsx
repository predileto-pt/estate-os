"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Contract } from "@/lib/db-types";

interface ContractDetailState {
  selectedId: string | null;
  select: (contract: Contract) => void;
  close: () => void;
}

const ContractDetailContext = createContext<ContractDetailState | null>(null);

export function ContractDetailProvider({
  children,
  contracts,
}: {
  children: React.ReactNode;
  contracts: Contract[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("contract_id");

  const select = useCallback(
    (contract: Contract) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("contract_id") === contract.uuid) {
        params.delete("contract_id");
      } else {
        params.set("contract_id", contract.uuid);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("contract_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <ContractDetailContext value={value}>
      {children}
    </ContractDetailContext>
  );
}

export function useContractDetail() {
  const ctx = useContext(ContractDetailContext);
  if (!ctx) throw new Error("useContractDetail must be used within ContractDetailProvider");
  return ctx;
}

export function useSelectedContract(contracts: Contract[]): Contract | null {
  const { selectedId } = useContractDetail();
  return useMemo(
    () => contracts.find((c) => c.uuid === selectedId) ?? null,
    [contracts, selectedId],
  );
}
