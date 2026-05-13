"use server";

import { coreGet, corePost, corePostAction, corePatch, coreDelete, ApiError } from "@/lib/api";
import type { ActionResult, MutationResult, PropertyResponse } from "@/lib/api";
import type { components } from "@/lib/types/estate-os-api";

export type PropertyPoiResponse = components["schemas"]["PropertyPoiResponse"];
export type JobResponse = components["schemas"]["JobResponse"];
export type EnrichPropertyResponse =
  components["schemas"]["EnrichPropertyResponse"];

export async function deleteProperty(
  propertyId: string,
): Promise<MutationResult> {
  try {
    await coreDelete(`/api/v1/admin/properties/${propertyId}`);
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function publishProperty(
  propertyId: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePostAction<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/publish`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function unpublishProperty(
  propertyId: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePostAction<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/unpublish`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getPropertyPois(
  propertyId: string,
): Promise<ActionResult<PropertyPoiResponse[]>> {
  try {
    const data = await coreGet<PropertyPoiResponse[]>(
      `/api/v1/admin/properties/${propertyId}/pois`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function enrichProperty(
  propertyId: string,
  force: boolean = false,
): Promise<ActionResult<EnrichPropertyResponse>> {
  try {
    const data = await corePostAction<EnrichPropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/enrich`,
      undefined,
      { force },
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getJob(
  jobId: string,
): Promise<ActionResult<JobResponse>> {
  try {
    const data = await coreGet<JobResponse>(`/api/v1/admin/jobs/${jobId}`);
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getLatestPropertyEnrichmentJob(
  propertyId: string,
): Promise<ActionResult<JobResponse | null>> {
  try {
    const data = await coreGet<JobResponse[]>(
      `/api/v1/admin/properties/${propertyId}/jobs`,
      { kind: "property_enrichment", limit: "1" },
    );
    return { error: null, data: data[0] ?? null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function enhancePropertyDescription(
  propertyId: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePostAction<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/enhance-description`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function updatePropertyAddress(
  propertyId: string,
  address: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePatch<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/address`,
      { address },
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function updatePropertyTitle(
  propertyId: string,
  title: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePatch<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}/title`,
      { title },
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

// Types
export interface SlotResponse {
  id: string;
  property_id: string;
  agent_user_id: string;
  organization_id: string;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface PaginatedSlotsResponse {
  slots: SlotResponse[];
  total: number;
}

export async function getSlots(
  propertyId: string,
): Promise<ActionResult<PaginatedSlotsResponse>> {
  try {
    const data = await coreGet<PaginatedSlotsResponse>("/api/v1/admin/slots", {
      property_id: propertyId,
      limit: "100",
    });
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function createSlot(body: {
  property_id: string;
  organization_id: string;
  start_time: string;
  end_time: string;
}): Promise<ActionResult<SlotResponse>> {
  try {
    const data = await corePost<SlotResponse>("/api/v1/admin/slots", body);
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function cancelSlot(
  slotId: string,
): Promise<ActionResult<void>> {
  try {
    await coreDelete(`/api/v1/admin/slots/${slotId}`);
    return { error: null, data: undefined };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}
