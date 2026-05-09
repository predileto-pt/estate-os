"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  enrichProperty,
  getJob,
  getLatestPropertyEnrichmentJob,
} from "../../actions";

type JobResponse = components["schemas"]["JobResponse"];
type JobStatus = components["schemas"]["JobStatus"];

const POLL_INTERVAL_MS = 3_000;
// Reaper marks orphaned jobs FAILED after 30 min (ADR-012); cap polling well
// short of that so a misconfigured worker doesn't keep tabs open forever.
const MAX_POLL_DURATION_MS = 5 * 60_000;

const isInFlight = (status: JobStatus) =>
  status === "pending" || status === "processing";

export function DiscoverPoisButton({
  propertyId,
  dict,
}: {
  propertyId: string;
  dict: Dictionary["dashboard"];
}) {
  const router = useRouter();
  const [job, setJob] = useState<JobResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Tick once immediately so the UI reflects current state without waiting
      // a full interval.
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

  const handleClick = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await enrichProperty(propertyId);
      if (result.error !== null) {
        setError(
          result.error.includes("422") ? dict.poisMissingCoords : result.error,
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
  const busy = submitting || inFlight;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="primary" onClick={handleClick} disabled={busy}>
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {busy ? dict.discoveringPois : dict.discoverPois}
      </Button>
      {inFlight && (
        <p className="text-xs text-gray-500">{dict.poisQueuedHint}</p>
      )}
      {!inFlight && job?.status === "failed" && (
        <p className="text-xs text-red-600">
          {job.error_message ?? dict.poisDiscoveryFailed}
        </p>
      )}
      {!inFlight && job?.status === "completed" && job.completed_at && (
        <p className="text-xs text-gray-500">
          {dict.poisLastUpdate.replace(
            "{when}",
            formatRelativeTime(job.completed_at),
          )}
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(elapsed) || elapsed < 0) return "—";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
