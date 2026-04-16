"use server";

import { corePost, corePut, coreDelete, ApiError } from "@/lib/api";
import type { ActionResult, MutationResult, PropertyResponse } from "@/lib/api";

export async function presignImageUploads(
  propertyId: string,
  files: { filename: string; content_type: string }[],
): Promise<
  ActionResult<{
    files: { image_id: string; s3_key: string; upload_url: string }[];
  }>
> {
  try {
    const data = await corePost<{
      files: { image_id: string; s3_key: string; upload_url: string }[];
    }>("/api/v1/admin/property-images/presign", {
      property_id: propertyId,
      files,
    });
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function recordPropertyImage(params: {
  property_id: string;
  image_id: string;
  s3_key: string;
  filename: string;
  content_type: string;
  size_bytes: number;
}): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePost<PropertyResponse>(
      "/api/v1/admin/property-images/",
      params,
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function deletePropertyImage(
  imageId: string,
  propertyId: string,
): Promise<MutationResult> {
  try {
    await coreDelete(`/api/v1/admin/property-images/${imageId}`, {
      property_id: propertyId,
    });
    return { error: null };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}

export async function reorderPropertyImages(
  propertyId: string,
  imageIds: string[],
): Promise<ActionResult<PropertyResponse>> {
  try {
    const data = await corePut<PropertyResponse>(
      "/api/v1/admin/property-images/reorder",
      { property_id: propertyId, image_ids: imageIds },
    );
    return { error: null, data };
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Network error" };
  }
}
