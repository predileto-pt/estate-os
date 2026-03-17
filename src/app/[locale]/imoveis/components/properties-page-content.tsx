"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { PropertyDetailProvider } from "./property-detail-context";
import { PropertyList } from "./property-list";
import { PropertyDetailPanel } from "./property-detail-panel";
import { ExtractionJobCard } from "./extraction-job-card";
import { getExtractionJobs, getProperties } from "../novo/actions";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];

const POLL_INTERVAL = 5_000;

export function PropertiesPageContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [jobs, setJobs] = useState<ExtractionJobResponse[]>([]);
  const [, setDismissTick] = useState(0);

  const dismissedJobIds = useRef(new Set<string>());
  const isFirstFetch = useRef(true);
  const dismissTimers = useRef(new Map<string, NodeJS.Timeout>());

  const fetchData = useCallback(async () => {
    const [propertiesResult, jobsResult] = await Promise.all([
      getProperties(),
      getExtractionJobs(),
    ]);
    if (propertiesResult.error === null) {
      setProperties(propertiesResult.properties);
    }
    if (jobsResult.error === null) {
      const newJobs = jobsResult.jobs;

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup all dismiss timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of dismissTimers.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Poll while there are active jobs
  const visibleJobs = jobs.filter((j) => !dismissedJobIds.current.has(j.id));
  const hasActiveJobs = jobs.some(
    (j) => j.status === "pending" || j.status === "processing" || j.status === "retrying",
  );

  useEffect(() => {
    if (!hasActiveJobs) return;

    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [hasActiveJobs, fetchData]);

  return (
    <PropertyDetailProvider properties={properties}>
      <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2" />
          <div className="col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold font-heading">
                {dict.imoveis}
              </h1>
              <Link href={`/${locale}/imoveis/novo`}>
                <Button variant="primary">
                  {dict.addProperty}
                </Button>
              </Link>
            </div>

            {/* Extraction jobs */}
            {visibleJobs.length > 0 && (
              <div className="space-y-3 mb-6">
                {visibleJobs.map((job) => (
                  <ExtractionJobCard
                    key={job.id}
                    job={job}
                    dict={dict}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            <PropertyList properties={properties} dict={dict} locale={locale} />
          </div>
          <div className="col-span-2" />
        </div>
      </main>
      <PropertyDetailPanel properties={properties} />
    </PropertyDetailProvider>
  );
}
