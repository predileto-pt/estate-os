"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/small";
import { Title } from "@/components/ui/title";
import { MainWrapper } from "@/components/main-wrapper";
import { PropertyList } from "@/app/(app)/imoveis/components/property-list";
import { getProperties } from "@/app/(app)/imoveis/novo/actions";
import { cn, formatPrice } from "@/lib/utils";
import { useLocale } from "@/components/dictionary-provider";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type ListingType =
  components["schemas"]["properties__domain__models__property__ListingType"];

type Filter = "all" | ListingType;

// Backend quirk: `purchase` in admin properties is the rental flow.
function matchingPriceCents(property: PropertyResponse): number | null {
  const matches = property.prices.filter(
    (p) => p.listing_type === property.listing_type
  );
  if (matches.length === 0) return null;
  const latest = matches.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  // Backend returns price as a decimal string in major units (e.g. "120000.00").
  const value = Number(latest.amount);
  return Number.isFinite(value) ? value : null;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((acc, n) => acc + n, 0) / values.length;
}

export function AnunciosPageContent({
  dict,
}: {
  dict: Dictionary["dashboard"];
}) {
  const locale = useLocale();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    (async () => {
      const result = await getProperties();
      if (result.error === null) {
        setProperties(result.data.filter((p) => p.status === "active"));
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const sale = properties.filter((p) => p.listing_type === "sale");
    const rental = properties.filter((p) => p.listing_type === "purchase");
    const avgSale = average(
      sale.map(matchingPriceCents).filter((v): v is number => v !== null)
    );
    const avgRental = average(
      rental
        .map(matchingPriceCents)
        .filter((v): v is number => v !== null)
    );
    return {
      total: properties.length,
      saleCount: sale.length,
      rentalCount: rental.length,
      avgSale,
      avgRental,
    };
  }, [properties]);

  const filtered = useMemo(() => {
    if (filter === "all") return properties;
    return properties.filter((p) => p.listing_type === filter);
  }, [properties, filter]);

  return (
    <MainWrapper>
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Title level={1} size="2xl" className="font-heading">
            {dict.anuncios}
          </Title>
          <Small variant="muted" as="p" className="mt-1">
            {dict.anunciosSubtitle}
          </Small>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Small variant="muted">
            {loading ? "..." : `${stats.total} ${dict.activeListings}`}
          </Small>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label={dict.totalActive}
          value={loading ? "—" : String(stats.total)}
          accent="emerald"
        />
        <StatCard
          label={dict.forSale}
          value={loading ? "—" : String(stats.saleCount)}
          hint={
            stats.avgSale !== null
              ? `${dict.avgPrice}: ${formatPrice(stats.avgSale, locale)}`
              : undefined
          }
        />
        <StatCard
          label={dict.forRent}
          value={loading ? "—" : String(stats.rentalCount)}
          hint={
            stats.avgRental !== null
              ? `${dict.avgPrice}: ${formatPrice(stats.avgRental, locale)}`
              : undefined
          }
        />
        <StatCard
          label={dict.organization}
          value={dict.publicPortal}
          hint={dict.anunciosPortalHint}
        />
      </div>

      {/* Filter pills */}
      {!loading && properties.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <FilterPill
            label={dict.allListings}
            count={stats.total}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterPill
            label={dict.sale}
            count={stats.saleCount}
            active={filter === "sale"}
            onClick={() => setFilter("sale")}
          />
          <FilterPill
            label={dict.purchase}
            count={stats.rentalCount}
            active={filter === "purchase"}
            onClick={() => setFilter("purchase")}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 bg-white p-4 flex gap-4"
            >
              <div className="h-32 w-32 bg-gray-200 rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-3">
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
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState dict={dict} />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">
          {dict.noAnunciosForFilter}
        </p>
      ) : (
        <PropertyList properties={filtered} dict={dict} />
      )}
    </MainWrapper>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "emerald";
}) {
  return (
    <div
      className={cn(
        "border bg-white px-4 py-3 rounded",
        accent === "emerald"
          ? "border-emerald-200 border-l-4 border-l-emerald-500"
          : "border-gray-200"
      )}
    >
      <Small variant="label" as="p">
        {label}
      </Small>
      <div className="mt-1 text-xl font-bold font-heading text-gray-900 leading-tight">
        {value}
      </div>
      {hint && (
        <Small variant="muted" as="p" className="mt-1">
          {hint}
        </Small>
      )}
    </div>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer",
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-5 px-1.5 py-0 text-[10px] rounded-full",
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ dict }: { dict: Dictionary["dashboard"] }) {
  return (
    <div className="border border-dashed border-gray-200 bg-white px-6 py-12 flex flex-col items-center text-center gap-3">
      <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center">
        <Megaphone className="size-6 text-gray-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900">{dict.noAnuncios}</p>
        <p className="text-xs text-gray-500 max-w-sm">
          {dict.noAnunciosHint}
        </p>
      </div>
      <Link href="/imoveis" className="mt-2">
        <Button variant="primary">{dict.viewProperties}</Button>
      </Link>
    </div>
  );
}
