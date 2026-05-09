"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { enrichProperty } from "../../actions";

// Worker is async — refresh a few times after queuing so the page picks
// up the new POIs without forcing the user to hit reload.
const REFRESH_DELAYS_MS = [4_000, 12_000, 25_000];

export function DiscoverPoisButton({
  propertyId,
  dict,
}: {
  propertyId: string;
  dict: Dictionary["dashboard"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await enrichProperty(propertyId);
      if (result.error) {
        setError(
          result.error.includes("422")
            ? dict.poisMissingCoords
            : result.error,
        );
        return;
      }
      setQueued(true);
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = REFRESH_DELAYS_MS.map((delay, i) =>
        setTimeout(() => {
          router.refresh();
          if (i === REFRESH_DELAYS_MS.length - 1) setQueued(false);
        }, delay),
      );
    });
  };

  const busy = isPending || queued;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="primary" onClick={handleClick} disabled={busy}>
        <Sparkles className="size-4" />
        {busy ? dict.discoveringPois : dict.discoverPois}
      </Button>
      {queued && (
        <p className="text-xs text-gray-500">{dict.poisQueuedHint}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
