import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "../client-fetcher";
import type { PropertySummary } from "../types";

export function usePropertySummaries() {
  return useQuery({
    queryKey: ["properties", "summary"],
    queryFn: () => clientFetch<PropertySummary[]>("/api/properties/summary"),
  });
}
