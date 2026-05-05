"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Applicant } from "@/lib/db-types";

interface ApplicantDetailState {
  selectedId: string | null;
  select: (applicant: Applicant) => void;
  close: () => void;
}

const ApplicantDetailContext = createContext<ApplicantDetailState | null>(null);

export function ApplicantDetailProvider({
  children,
  applicants,
}: {
  children: React.ReactNode;
  applicants: Applicant[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("applicant_id");

  const select = useCallback(
    (applicant: Applicant) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("applicant_id") === applicant.id) {
        params.delete("applicant_id");
      } else {
        params.set("applicant_id", applicant.id);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("applicant_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <ApplicantDetailContext value={value}>
      {children}
    </ApplicantDetailContext>
  );
}

export function useApplicantDetail() {
  const ctx = useContext(ApplicantDetailContext);
  if (!ctx) throw new Error("useApplicantDetail must be used within ApplicantDetailProvider");
  return ctx;
}

export function useSelectedApplicant(applicants: Applicant[]): Applicant | null {
  const { selectedId } = useApplicantDetail();
  return useMemo(
    () => applicants.find((a) => a.id === selectedId) ?? null,
    [applicants, selectedId],
  );
}
