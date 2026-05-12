"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Title } from "@/components/ui/title";
import { Small } from "@/components/ui/small";
import {
  enrichProperty,
  getJob,
  getLatestPropertyEnrichmentJob,
} from "../../actions";
import { DiscoverPoisButton } from "./discover-pois-button";
import { PoiCard } from "./poi-card";

type PropertyPoiResponse = components["schemas"]["PropertyPoiResponse"];
type PoiCategory = components["schemas"]["PoiCategory"];
type JobResponse = components["schemas"]["JobResponse"];
type JobStatus = components["schemas"]["JobStatus"];

const POLL_INTERVAL_MS = 5_000;
// Reaper marks orphaned jobs FAILED after 30 min (ADR-012); cap polling well
// short of that so a misconfigured worker doesn't keep tabs open forever.
const MAX_POLL_DURATION_MS = 5 * 60_000;

const isInFlight = (status: JobStatus) =>
  status === "pending" || status === "processing";

const CATEGORY_LABEL_KEY: Record<PoiCategory, keyof Dictionary["dashboard"]> = {
  hospital: "poiCategoryHospital",
  bank: "poiCategoryBank",
  grocery: "poiCategoryGrocery",
  school: "poiCategorySchool",
  pharmacy: "poiCategoryPharmacy",
  gym: "poiCategoryGym",
  restaurant: "poiCategoryRestaurant",
  coffee_shop: "poiCategoryCoffeeShop",
  laundry: "poiCategoryLaundry",
  gas_station: "poiCategoryGasStation",
  public_transit: "poiCategoryPublicTransit",
  kindergarten: "poiCategoryKindergarten",
  park: "poiCategoryPark",
  post_office: "poiCategoryPostOffice",
  library: "poiCategoryLibrary",
  shopping_mall: "poiCategoryShoppingMall",
  bakery: "poiCategoryBakery",
  police_station: "poiCategoryPoliceStation",
};

function groupByCategory(
  pois: PropertyPoiResponse[],
): Map<PoiCategory, PropertyPoiResponse[]> {
  const grouped = new Map<PoiCategory, PropertyPoiResponse[]>();
  for (const poi of pois) {
    const list = grouped.get(poi.category) ?? [];
    list.push(poi);
    grouped.set(poi.category, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.distance_meters - b.distance_meters);
  }
  return grouped;
}

export function PoiList({
  propertyId,
  pois,
  dict,
}: {
  propertyId: string;
  pois: PropertyPoiResponse[];
  dict: Dictionary["dashboard"];
}) {
  const router = useRouter();
  const [job, setJob] = useState<JobResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartRef = useRef<number>(0);
  const wasInFlightRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling();
      pollStartRef.current = Date.now();
      const tick = async () => {
        if (Date.now() - pollStartRef.current > MAX_POLL_DURATION_MS) {
          stopPolling();
          return;
        }
        const result = await getJob(jobId);
        if (result.error !== null) return; // transient — keep polling
        const fresh = result.data;
        setJob(fresh);
        if (!isInFlight(fresh.status)) {
          stopPolling();
          if (wasInFlightRef.current && fresh.status === "completed") {
            router.refresh();
          }
          wasInFlightRef.current = false;
        } else {
          wasInFlightRef.current = true;
        }
      };
      pollTimerRef.current = setInterval(tick, POLL_INTERVAL_MS);
      // Tick once immediately so the UI reflects current state without
      // waiting a full interval.
      void tick();
    },
    [router, stopPolling],
  );

  // Recover state on mount: if the latest enrichment job is still in flight,
  // resume polling so navigating away and back doesn't lose the indicator.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getLatestPropertyEnrichmentJob(propertyId);
      if (cancelled || result.error !== null) return;
      const latest = result.data;
      if (!latest) return;
      setJob(latest);
      if (isInFlight(latest.status)) {
        wasInFlightRef.current = true;
        startPolling(latest.id);
      }
    })();
    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [propertyId, startPolling, stopPolling]);

  const handleTrigger = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await enrichProperty(propertyId);
      if (result.error !== null) {
        setSubmitError(
          result.error.includes("422")
            ? dict.poisMissingCoords
            : result.error,
        );
        return;
      }
      wasInFlightRef.current = true;
      startPolling(result.data.job_id);
    } finally {
      setSubmitting(false);
    }
  };

  const inFlight = job !== null && isInFlight(job.status);

  const header = (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <Title level={1} size="2xl" className="font-heading">
          {dict.pois}
        </Title>
        <Small variant="muted" as="p" className="mt-1">
          {dict.poisSubtitle}
        </Small>
      </div>
      <DiscoverPoisButton
        job={job}
        submitting={submitting}
        inFlight={inFlight}
        error={submitError}
        onTrigger={handleTrigger}
        dict={dict}
      />
    </header>
  );

  if (inFlight) {
    return (
      <div>
        {header}
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Loader2 className="size-6 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500">{dict.poisQueuedHint}</p>
        </div>
      </div>
    );
  }

  if (pois.length === 0) {
    return (
      <div>
        {header}
        <p className="text-sm text-gray-500">{dict.noPois}</p>
      </div>
    );
  }

  const grouped = groupByCategory(pois);
  const categoryLabel = (category: PoiCategory): string => {
    const key = CATEGORY_LABEL_KEY[category];
    return (key && dict[key]) || category;
  };
  const categories = Array.from(grouped.keys()).sort((a, b) =>
    categoryLabel(a).localeCompare(categoryLabel(b)),
  );

  return (
    <div>
      {header}

      <div className="space-y-8">
        {categories.map((category) => {
          const items = grouped.get(category) ?? [];
          return (
            <section key={category}>
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-baseline gap-2">
                {categoryLabel(category)}
                <Small variant="muted">({items.length})</Small>
              </h2>
              <div className="-mx-4 px-4 overflow-x-auto scrollbar-thin">
                <div className="flex gap-3 snap-x snap-mandatory pb-3">
                  {items.map((poi) => (
                    <PoiCard key={poi.id} poi={poi} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
