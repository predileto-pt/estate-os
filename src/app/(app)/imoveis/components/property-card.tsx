"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { useLocale } from "@/components/dictionary-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type PropertyStatus = components["schemas"]["PropertyStatus"];
type PropertyImageResponse =
  components["schemas"]["properties__adapters__api__schemas__PropertyImageResponse"];
type PropertyPriceResponse =
  components["schemas"]["properties__adapters__api__schemas__PropertyPriceResponse"];

const STATUS_BORDER: Record<PropertyStatus, string> = {
  draft: "border-b-gray-400",
  active: "border-b-emerald-500",
  sold: "border-b-blue-500",
  rented: "border-b-violet-500",
  withdrawn: "border-b-red-400",
};

const STATUS_LABEL_KEY: Record<PropertyStatus, keyof Dictionary["dashboard"]> =
  {
    draft: "propertyStatusDraft",
    active: "propertyStatusActive",
    sold: "propertyStatusSold",
    rented: "propertyStatusRented",
    withdrawn: "propertyStatusWithdrawn",
  };

function primaryImage(
  images: PropertyImageResponse[]
): PropertyImageResponse | null {
  if (images.length === 0) return null;
  return [...images].sort((a, b) => a.display_order - b.display_order)[0];
}

function matchingPrice(
  prices: PropertyPriceResponse[],
  listingType: PropertyResponse["listing_type"]
): PropertyPriceResponse | null {
  const matches = prices.filter((p) => p.listing_type === listingType);
  if (matches.length === 0) return null;
  return matches.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
}

export function PropertyCard({
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
  // Backend enum quirk: `purchase` is the rental value. Spec §3.
  const isRental = property.listing_type === "purchase";

  const firstOwner = property.owners[0];
  const extraOwners = property.owners.length - 1;

  const [imageBroken, setImageBroken] = useState(false);
  const showImage = image && !imageBroken;

  return (
    <Link
      href={`/imoveis/${property.id}`}
      title={dict[STATUS_LABEL_KEY[property.status]]}
      className={cn(
        "group flex w-full min-w-0 flex-row border border-gray-200 bg-white transition-colors ring-offset-1 ring-offset-transparent hover:ring-offset-gray-400 rounded",
        "shadow border-b-4",
        STATUS_BORDER[property.status]
      )}
    >
      <div className="relative h-32 w-32 shrink-0 bg-gray-100 overflow-hidden rounded-tl rounded-bl">
        {showImage ? (
          <Image
            src={image.download_url}
            alt={property.address}
            fill
            sizes="128px"
            className="object-cover"
            unoptimized
            onError={() => setImageBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="size-10 text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex flex-1 min-w-0 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
            {listingTypeLabel[property.listing_type] ?? property.listing_type}
          </span>
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
            {typologyLabel[property.typology] ?? property.typology}
          </span>
        </div>

        {price && (
          <p className="text-base font-bold font-heading text-gray-900">
            {formatPrice(Number(price.amount), locale)}
            {isRental && (
              <span className="text-sm font-medium text-gray-500">
                {dict.perMonth}
              </span>
            )}
          </p>
        )}

        <p className="text-sm text-gray-700 truncate" title={property.address}>
          {property.address}
        </p>

        {firstOwner && (
          <p className="text-xs text-gray-500 truncate">
            {firstOwner.full_name}
            {extraOwners > 0 && ` +${extraOwners}`}
          </p>
        )}

        <div className="mt-auto pt-2">
          <span
            className={cn(buttonVariants({ variant: "steel", size: "sm" }))}
          >
            {dict.details}
          </span>
        </div>
      </div>
    </Link>
  );
}
