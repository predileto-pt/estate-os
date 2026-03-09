"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Applicant } from "@/lib/db-types";

interface ApplicantDetailState {
  selected: Applicant | null;
  select: (applicant: Applicant) => void;
  close: () => void;
}

const ApplicantDetailContext = createContext<ApplicantDetailState | null>(null);

export function ApplicantDetailProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Applicant | null>(null);

  const select = useCallback((applicant: Applicant) => {
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
