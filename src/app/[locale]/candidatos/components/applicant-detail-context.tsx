"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { ApplicantRow } from "@/lib/db-types";

interface ApplicantDetailState {
  selected: ApplicantRow | null;
  select: (applicant: ApplicantRow) => void;
  close: () => void;
}

const ApplicantDetailContext = createContext<ApplicantDetailState | null>(null);

export function ApplicantDetailProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<ApplicantRow | null>(null);
  const searchParams = useSearchParams();

  // Reset selection when URL changes (e.g. status filter)
  useEffect(() => {
    setSelected(null);
  }, [searchParams]);

  const select = useCallback((applicant: ApplicantRow) => {
    setSelected((prev) => (prev?.id === applicant.id ? null : applicant));
  }, []);

  const close = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <ApplicantDetailContext value={{ selected, select, close }}>
      {children}
    </ApplicantDetailContext>
  );
}

export function useApplicantDetail() {
  const ctx = useContext(ApplicantDetailContext);
  if (!ctx) throw new Error("useApplicantDetail must be used within ApplicantDetailProvider");
  return ctx;
}
