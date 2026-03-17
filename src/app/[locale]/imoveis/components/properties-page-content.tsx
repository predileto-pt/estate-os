"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { components } from "@/lib/api-types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { PropertyDetailProvider } from "./property-detail-context";
import { PropertyList } from "./property-list";
import { PropertyDetailPanel } from "./property-detail-panel";
import { ExtractionJobCard } from "./extraction-job-card";
import { FAKE_PROPERTIES } from "./fake-data";
import { getExtractionJobs } from "../novo/actions";

type ExtractionJobResponse = components["schemas"]["ExtractionJobResponse"];

const POLL_INTERVAL = 5_000;

export function PropertiesPageContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const properties = FAKE_PROPERTIES;
  const [jobs, setJobs] = useState<ExtractionJobResponse[]>([]);

  const fetchJobs = useCallback(async () => {
    const result = await getExtractionJobs();
    if (result.error === null) {
      setJobs(result.jobs);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Poll while there are active jobs
  const hasActiveJobs = jobs.some(
    (j) => j.status === "pending" || j.status === "processing",
  );

  useEffect(() => {
    if (!hasActiveJobs) return;

    const id = setInterval(fetchJobs, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [hasActiveJobs, fetchJobs]);

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
            {jobs.length > 0 && (
              <div className="space-y-3 mb-6">
                {jobs.map((job) => (
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
