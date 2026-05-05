"use client";

import type { Applicant } from "@/lib/db-types";
import { useDictionary } from "@/components/dictionary-provider";
import { ApplicantCard } from "./applicant-card";

export function ApplicantList({
  applicants,
}: {
  applicants: Applicant[];
}) {
  const { dashboard: dict } = useDictionary();

  if (applicants.length === 0) {
    return (
      <p className="text-sm text-gray-400">{dict.noCandidatos}</p>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((a) => (
        <ApplicantCard key={a.id} applicant={a} />
      ))}
    </div>
  );
}
