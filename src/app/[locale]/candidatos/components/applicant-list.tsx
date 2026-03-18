"use client";

import type { Applicant } from "@/lib/db-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ApplicantCard } from "./applicant-card";

export function ApplicantList({
  applicants,
  dict,
  locale,
}: {
  applicants: Applicant[];
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  if (applicants.length === 0) {
    return (
      <p className="text-sm text-gray-400">{dict.noCandidatos}</p>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((a) => (
        <ApplicantCard key={a.id} applicant={a} dict={dict} locale={locale} />
      ))}
    </div>
  );
}
