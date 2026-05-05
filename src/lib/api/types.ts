import type { components } from "@/lib/types/estate-os-api";

export type ActionResult<T> = { error: string } | { error: null; data: T };

export type MutationResult = { error: string } | { error: null };

export type PropertyResponse = components["schemas"]["PropertyResponse"];
export type PropertyPriceResponse =
  components["schemas"]["properties__adapters__api__schemas__PropertyPriceResponse"];
export type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];
export type UserResponse = components["schemas"]["UserResponse"];
export type OrganizationResponse = components["schemas"]["OrganizationResponse"];
export type MeResponse = components["schemas"]["MeResponse"];
export type MembershipSummary =
  components["schemas"]["identity__adapters__api__schemas__MembershipSummary"];

export type PropertyAmenityResponse =
  components["schemas"]["PropertyAmenityResponse"];
export type AmenityCategory = components["schemas"]["AmenityCategory"];

export type PropertySummary = {
  id: string;
  address: string;
  listing_type: string;
  typology: string;
  price: number | null;
  owners: { full_name: string }[];
};
