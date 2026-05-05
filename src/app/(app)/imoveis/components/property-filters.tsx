"use client";

import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";

type ListingType =
  components["schemas"]["properties__domain__models__property__ListingType"];
type Typology = components["schemas"]["Typology"];
type PropertyStatus = components["schemas"]["PropertyStatus"];

export type PropertyFiltersState = {
  listingTypes: Set<ListingType>;
  typologies: Set<Typology>;
  statuses: Set<PropertyStatus>;
};

export const emptyFilters = (): PropertyFiltersState => ({
  listingTypes: new Set(),
  typologies: new Set(),
  statuses: new Set(),
});

const LISTING_TYPES: ListingType[] = ["sale", "purchase"];
const TYPOLOGIES: Typology[] = ["apartment", "house", "land", "ruin"];
const STATUSES: PropertyStatus[] = [
  "active",
  "draft",
  "sold",
  "rented",
  "withdrawn",
];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Section<T extends string>({
  label,
  values,
  selected,
  getLabel,
  onToggle,
}: {
  label: string;
  values: readonly T[];
  selected: Set<T>;
  getLabel: (v: T) => string;
  onToggle: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs text-gray-400 uppercase tracking-wide">{label}</h3>
      <ul className="space-y-1">
        {values.map((value) => {
          const isChecked = selected.has(value);
          return (
            <li key={value}>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(value)}
                  className="size-3.5 accent-gray-900 cursor-pointer"
                />
                <span>{getLabel(value)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PropertyFilters({
  dict,
  filters,
  onChange,
}: {
  dict: Dictionary["dashboard"];
  filters: PropertyFiltersState;
  onChange: (next: PropertyFiltersState) => void;
}) {
  const hasActive =
    filters.listingTypes.size +
      filters.typologies.size +
      filters.statuses.size >
    0;

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{dict.filters}</h2>
        {hasActive && (
          <button
            type="button"
            onClick={() => onChange(emptyFilters())}
            className="text-xs text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            {dict.clearFilters}
          </button>
        )}
      </div>

      <Section
        label={dict.listingType}
        values={LISTING_TYPES}
        selected={filters.listingTypes}
        getLabel={(v) => dict[v]}
        onToggle={(v) =>
          onChange({
            ...filters,
            listingTypes: toggle(filters.listingTypes, v),
          })
        }
      />

      <Section
        label={dict.typology}
        values={TYPOLOGIES}
        selected={filters.typologies}
        getLabel={(v) => dict[v]}
        onToggle={(v) =>
          onChange({ ...filters, typologies: toggle(filters.typologies, v) })
        }
      />

      <Section
        label={dict.status}
        values={STATUSES}
        selected={filters.statuses}
        getLabel={(v) => dict[v]}
        onToggle={(v) =>
          onChange({ ...filters, statuses: toggle(filters.statuses, v) })
        }
      />
    </aside>
  );
}
