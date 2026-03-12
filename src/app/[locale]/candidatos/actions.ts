"use server";

import type { Applicant } from "@/lib/db-types";

export async function fetchApplicants(ownerId: string): Promise<Applicant[]> {
  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return [];

  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/applicants?owner_id=${ownerId}`,
      { cache: "no-store" },
    );
    if (response.ok) {
      return response.json();
    }
  } catch {
    // Fall through
  }
  return [];
}
