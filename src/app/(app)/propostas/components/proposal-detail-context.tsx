"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Proposal } from "./proposal-types";

interface ProposalDetailState {
  selectedId: string | null;
  select: (proposal: Proposal) => void;
  close: () => void;
}

const ProposalDetailContext = createContext<ProposalDetailState | null>(null);

export function ProposalDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("proposal_id");

  const select = useCallback(
    (proposal: Proposal) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("proposal_id") === proposal.id) {
        params.delete("proposal_id");
      } else {
        params.set("proposal_id", proposal.id);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("proposal_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <ProposalDetailContext value={value}>
      {children}
    </ProposalDetailContext>
  );
}

export function useProposalDetail() {
  const ctx = useContext(ProposalDetailContext);
  if (!ctx) throw new Error("useProposalDetail must be used within ProposalDetailProvider");
  return ctx;
}

export function useSelectedProposal(proposals: Proposal[]): Proposal | null {
  const { selectedId } = useProposalDetail();
  return useMemo(
    () => proposals.find((p) => p.id === selectedId) ?? null,
    [proposals, selectedId],
  );
}
