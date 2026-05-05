"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { cn, formatPrice, formatArea } from "@/lib/utils";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type PropertyImageResponse =
  components["schemas"]["properties__adapters__api__schemas__PropertyImageResponse"];
type PropertyPriceResponse =
  components["schemas"]["properties__adapters__api__schemas__PropertyPriceResponse"];

function primaryImage(
  images: PropertyImageResponse[],
): PropertyImageResponse | null {
  if (images.length === 0) return null;
  return [...images].sort((a, b) => a.display_order - b.display_order)[0];
}

function matchingPrice(
  prices: PropertyPriceResponse[],
  listingType: PropertyResponse["listing_type"],
): PropertyPriceResponse | null {
  const matches = prices.filter((p) => p.listing_type === listingType);
  if (matches.length === 0) return null;
  return matches.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];
}

export function AnnouncementSummary({
  property,
  dict,
}: {
  property: PropertyResponse;
  dict: Dictionary["dashboard"];
}) {
  const locale = useLocale();

  const listingTypeLabel: Record<string, string> = {
    sale: dict.sale,
    purchase: dict.purchase,
  };
  const typologyLabel: Record<string, string> = {
    house: dict.house,
    apartment: dict.apartment,
    land: dict.land,
    ruin: dict.ruin,
  };

  const image = primaryImage(property.images);
  const price = matchingPrice(property.prices, property.listing_type);
  const isRental = property.listing_type === "purchase";

  const [imageBroken, setImageBroken] = useState(false);
  const showImage = image && !imageBroken;

  const chars = property.characteristics;

  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {dict.announcementSummary}
        </span>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-64 shrink-0 bg-gray-100 overflow-hidden md:aspect-square">
          {showImage ? (
            <Image
              src={image.download_url}
              alt={property.address}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              unoptimized
              onError={() => setImageBroken(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="size-12 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 min-w-0 flex-col gap-3 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
              {listingTypeLabel[property.listing_type] ?? property.listing_type}
            </span>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
              {typologyLabel[property.typology] ?? property.typology}
            </span>
          </div>

          {price && (
            <p className="text-2xl font-bold font-heading text-gray-900">
              {formatPrice(Number(price.amount), locale)}
              {isRental && (
                <span className="text-base font-medium text-gray-500">
                  {dict.perMonth}
                </span>
              )}
            </p>
          )}

          <p
            className="text-sm font-medium text-gray-900 line-clamp-2"
            title={property.address}
          >
            {property.address}
          </p>

          {property.description && (
            <p className={cn("text-sm text-gray-600 leading-relaxed line-clamp-3")}>
              {property.description}
            </p>
          )}

          {chars && (
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
              {chars.area_in_m2 != null && <span>{formatArea(chars.area_in_m2)}</span>}
              {chars.num_of_bedrooms != null && (
                <span>
                  {chars.num_of_bedrooms} {dict.bedrooms}
                </span>
              )}
              {chars.num_of_bathrooms != null && (
                <span>
                  {chars.num_of_bathrooms} {dict.bathrooms}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
