import type { components } from "@/lib/api-types";

export type ActionResult<T> = { error: string } | { error: null; data: T };

export type MutationResult = { error: string } | { error: null };

export type PropertyResponse = components["schemas"]["PropertyResponse"];
export type PropertyPriceResponse = components["schemas"]["PropertyPriceResponse"];
export type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];
export type UserResponse = components["schemas"]["UserResponse"];
export type OrganizationResponse = components["schemas"]["OrganizationResponse"];
export type UserWithOrganizationResponse =
  components["schemas"]["UserWithOrganizationResponse"];

export type PropertySummary = {
  id: string;
  address: string;
  listing_type: string;
  typology: string;
  price: number | null;
  owners: { full_name: string }[];
};
