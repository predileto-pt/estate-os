"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { MainWrapper } from "@/components/main-wrapper";
import { PropertyList } from "./property-list";
import { ExtractionJobCard } from "./extraction-job-card";
import {
  PropertyFilters,
  emptyFilters,
  type PropertyFiltersState,
} from "./property-filters";
import { getExtractionJobs, getProperties } from "../novo/actions";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];

const POLL_INTERVAL = 5_000;

export function PropertiesPageContent({
  dict,
}: {
  dict: Dictionary["dashboard"];
}) {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [jobs, setJobs] = useState<ExtractionJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setDismissTick] = useState(0);
  const [filters, setFilters] = useState<PropertyFiltersState>(() =>
    emptyFilters()
  );

  const dismissedJobIds = useRef(new Set<string>());
  const isFirstFetch = useRef(true);
  const dismissTimers = useRef(new Map<string, NodeJS.Timeout>());

  const fetchData = useCallback(async () => {
    const [propertiesResult, jobsResult] = await Promise.all([
      getProperties(),
      getExtractionJobs(),
    ]);
    if (propertiesResult.error === null) {
      setProperties(propertiesResult.data);
    }
    if (jobsResult.error === null) {
      const newJobs = jobsResult.data;

      if (isFirstFetch.current) {
        // On first fetch, immediately dismiss already-completed jobs
        for (const job of newJobs) {
          if (job.status === "completed") {
            dismissedJobIds.current.add(job.id);
          }
        }
        isFirstFetch.current = false;
      } else {
        // On subsequent fetches, auto-dismiss newly completed jobs after 3s
        for (const job of newJobs) {
          if (
            job.status === "completed" &&
            !dismissedJobIds.current.has(job.id) &&
            !dismissTimers.current.has(job.id)
          ) {
            const timer = setTimeout(() => {
              dismissedJobIds.current.add(job.id);
              dismissTimers.current.delete(job.id);
              setDismissTick((t) => t + 1);
            }, 3_000);
            dismissTimers.current.set(job.id, timer);
          }
        }
      }

      setJobs(newJobs);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup all dismiss timers on unmount
  useEffect(() => {
    const timers = dismissTimers.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Poll while there are active jobs
  const visibleJobs = jobs.filter((j) => !dismissedJobIds.current.has(j.id));
  const hasActiveJobs = jobs.some(
    (j) =>
      j.status === "pending" ||
      j.status === "processing" ||
      j.status === "retrying"
  );

  useEffect(() => {
    if (!hasActiveJobs) return;

    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [hasActiveJobs, fetchData]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (
        filters.listingTypes.size > 0 &&
        !filters.listingTypes.has(p.listing_type)
      ) {
        return false;
      }
      if (filters.typologies.size > 0 && !filters.typologies.has(p.typology)) {
        return false;
      }
      if (filters.statuses.size > 0 && !filters.statuses.has(p.status)) {
        return false;
      }
      return true;
    });
  }, [properties, filters]);

  return (
    <MainWrapper>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold font-heading">{dict.imoveis}</h1>
        <Link href="/imoveis/novo">
          <Button variant="primary">{dict.addProperty}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 lg:col-span-2 p-4">
          <PropertyFilters
            dict={dict}
            filters={filters}
            onChange={setFilters}
          />
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-span-8 min-w-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-3 w-3/5 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {visibleJobs.length > 0 && (
                <div className="space-y-3 mb-6">
                  {visibleJobs.map((job) => (
                    <ExtractionJobCard key={job.id} job={job} dict={dict} />
                  ))}
                </div>
              )}

              <PropertyList properties={filtered} dict={dict} />
            </>
          )}
        </div>
      </div>
    </MainWrapper>
  );
}
