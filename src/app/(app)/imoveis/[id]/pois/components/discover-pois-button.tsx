"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

type JobResponse = components["schemas"]["JobResponse"];

export function DiscoverPoisButton({
  job,
  submitting,
  inFlight,
  error,
  onTrigger,
  dict,
}: {
  job: JobResponse | null;
  submitting: boolean;
  inFlight: boolean;
  error: string | null;
  onTrigger: () => void;
  dict: Dictionary["dashboard"];
}) {
  const busy = submitting || inFlight;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="primary" onClick={onTrigger} disabled={busy}>
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {busy ? dict.discoveringPois : dict.discoverPois}
      </Button>
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
