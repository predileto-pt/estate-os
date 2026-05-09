"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import { cn } from "@/lib/utils";

type PropertyPoiResponse = components["schemas"]["PropertyPoiResponse"];

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function PoiImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
      <img
        src={images[current]}
        alt=""
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrent((c) => (c - 1 + images.length) % images.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous photo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === current ? "bg-white" : "bg-white/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PoiCard({ poi }: { poi: PropertyPoiResponse }) {
  const images = poi.image_urls ?? [];

  return (
    <article className="w-64 shrink-0 snap-start border border-gray-200 bg-white overflow-hidden flex flex-col">
      {images.length > 0 ? (
        <PoiImageCarousel images={images} />
      ) : (
        <div className="bg-gray-50 aspect-[4/3] flex items-center justify-center">
          <MapPin className="size-8 text-gray-300" />
        </div>
      )}
      <div className="flex flex-col gap-1.5 p-3">
        <h3
          className="text-sm font-medium text-gray-900 line-clamp-2"
          title={poi.name}
        >
          {poi.name}
        </h3>
        <span className="text-xs text-gray-500">
          {formatDistance(poi.distance_meters)}
        </span>
        {poi.address && (
          <p
            className="text-xs text-gray-500 line-clamp-2"
            title={poi.address}
          >
            {poi.address}
          </p>
        )}
      </div>
    </article>
  );
}
