"use server";

import { coreGet, corePost, coreAuthPost, corePatch } from "@/lib/api/core-client";
import { ApiError } from "@/lib/api/errors";
import type {
  ActionResult,
  MutationResult,
  PropertyResponse,
  PropertyPriceResponse,
  ExtractionJobResponse,
} from "@/lib/api/types";

export async function getProperties(): Promise<
  ActionResult<PropertyResponse[]>
> {
  try {
    const data = await coreGet<PropertyResponse[]>("/api/v1/admin/properties/");
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getPropertyPrices(
  propertyId: string,
): Promise<ActionResult<PropertyPriceResponse[]>> {
  try {
    const data = await coreGet<PropertyPriceResponse[]>(
      "/api/v1/admin/property-prices/",
      { property_id: propertyId },
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function createPropertyPrice(params: {
  property_id: string;
  amount: number;
  listing_type: string;
}): Promise<MutationResult> {
  try {
    await corePost("/api/v1/admin/property-prices/", params);
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getProperty(
  propertyId: string,
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await coreGet<PropertyResponse>(
      `/api/v1/admin/properties/${propertyId}`,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function presignExtractionFiles(
  files: { filename: string; content_type: string }[],
): Promise<
  ActionResult<{
    job_id: string;
    files: { s3_key: string; upload_url: string }[];
  }>
> {
  try {
    const data = await coreAuthPost<{
      job_id: string;
      files: { s3_key: string; upload_url: string }[];
    }>("/api/v1/admin/extraction-jobs/presign", { files });
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function getExtractionJobs(): Promise<
  ActionResult<ExtractionJobResponse[]>
> {
  try {
    const data = await coreGet<ExtractionJobResponse[]>(
      "/api/v1/admin/extraction-jobs/",
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function submitExtractionJob(params: {
  job_id: string;
  document_keys: string[];
  listing_type: string;
  typology: string;
}): Promise<MutationResult> {
  try {
    await corePost("/api/v1/admin/extraction-jobs/batch", params);
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function updateOwnerContact(params: {
  owner_id: string;
  property_id: string;
  email?: string | null;
  phone_number?: string | null;
}): Promise<MutationResult> {
  try {
    await corePatch(
      `/api/v1/admin/property-owners/${params.owner_id}/contact`,
      { email: params.email, phone_number: params.phone_number },
      { property_id: params.property_id },
    );
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}
