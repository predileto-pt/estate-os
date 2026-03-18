"use server";

import type { Applicant } from "@/lib/db-types";
import {
  applicantsGet,
  applicantsPatch,
  applicantsPost,
} from "@/lib/api/applicants-client";
import type { ActionResult, MutationResult } from "@/lib/api/types";

export async function fetchApplicants(
  organizationId: string,
): Promise<ActionResult<Applicant[]>> {
  try {
    const data = await applicantsGet<Applicant[]>("/api/v1/applicants", {
      organization_id: organizationId,
    });
    return { error: null, data };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to fetch applicants",
    };
  }
}

export async function approveApplicant(
  applicantId: string,
): Promise<MutationResult> {
  try {
    await applicantsPatch(`/api/v1/applicants/${applicantId}/approve`);
    return { error: null };
  } catch {
    return { error: "Failed to approve applicant" };
  }
}

export async function denyApplicant(
  applicantId: string,
): Promise<MutationResult> {
  try {
    await applicantsPatch(`/api/v1/applicants/${applicantId}/deny`);
    return { error: null };
  } catch {
    return { error: "Failed to deny applicant" };
  }
}

export async function requestOwnerApproval(
  applicantId: string,
): Promise<MutationResult> {
  try {
    await applicantsPost(
      `/api/v1/applicants/${applicantId}/request-owner-approval`,
    );
    return { error: null };
  } catch {
    return { error: "Failed to request owner approval" };
  }
}
