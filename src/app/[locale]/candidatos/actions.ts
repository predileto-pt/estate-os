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

type ActionResult = { error: string } | { error: null };

export async function approveApplicant(applicantId: string): Promise<ActionResult> {
  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return { error: "Service URL not configured" };

  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/applicants/${applicantId}/approve`,
      { method: "PATCH" },
    );
    if (response.ok) return { error: null };
    return { error: `Failed to approve applicant (${response.status})` };
  } catch {
    return { error: "Failed to connect to service" };
  }
}

export async function denyApplicant(applicantId: string): Promise<ActionResult> {
  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return { error: "Service URL not configured" };

  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/applicants/${applicantId}/deny`,
      { method: "PATCH" },
    );
    if (response.ok) return { error: null };
    return { error: `Failed to deny applicant (${response.status})` };
  } catch {
    return { error: "Failed to connect to service" };
  }
}

export async function requestOwnerApproval(applicantId: string): Promise<ActionResult> {
  const serviceUrl = process.env.APPLICANTS_MANAGEMENT_SERVICE_URL;
  if (!serviceUrl) return { error: "Service URL not configured" };

  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/applicants/${applicantId}/request-owner-approval`,
      { method: "POST" },
    );
    if (response.ok) return { error: null };
    return { error: `Failed to request owner approval (${response.status})` };
  } catch {
    return { error: "Failed to connect to service" };
  }
}
