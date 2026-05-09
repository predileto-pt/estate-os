import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary } from "@/lib/i18n";
import { Title } from "@/components/ui/title";
import { Small } from "@/components/ui/small";

type PropertyPoiResponse = components["schemas"]["PropertyPoiResponse"];
type PoiCategory = components["schemas"]["PoiCategory"];

const CATEGORY_LABEL_KEY: Record<PoiCategory, keyof Dictionary["dashboard"]> = {
  hospital: "poiCategoryHospital",
  bank: "poiCategoryBank",
  grocery: "poiCategoryGrocery",
  school: "poiCategorySchool",
  pharmacy: "poiCategoryPharmacy",
  gym: "poiCategoryGym",
  restaurant: "poiCategoryRestaurant",
  coffee_shop: "poiCategoryCoffeeShop",
  laundry: "poiCategoryLaundry",
  gas_station: "poiCategoryGasStation",
  public_transit: "poiCategoryPublicTransit",
  kindergarten: "poiCategoryKindergarten",
  park: "poiCategoryPark",
  post_office: "poiCategoryPostOffice",
  library: "poiCategoryLibrary",
  shopping_mall: "poiCategoryShoppingMall",
  bakery: "poiCategoryBakery",
  police_station: "poiCategoryPoliceStation",
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function groupByCategory(
  pois: PropertyPoiResponse[],
): Map<PoiCategory, PropertyPoiResponse[]> {
  const grouped = new Map<PoiCategory, PropertyPoiResponse[]>();
  for (const poi of pois) {
    const list = grouped.get(poi.category) ?? [];
    list.push(poi);
    grouped.set(poi.category, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.distance_meters - b.distance_meters);
  }
  return grouped;
}

export function PoiList({
  pois,
  dict,
}: {
  pois: PropertyPoiResponse[];
  dict: Dictionary["dashboard"];
}) {
  if (pois.length === 0) {
    return (
      <div>
        <header className="mb-4">
          <Title level={1} size="2xl" className="font-heading">
            {dict.pois}
          </Title>
          <Small variant="muted" as="p" className="mt-1">
            {dict.poisSubtitle}
          </Small>
        </header>
        <p className="text-sm text-gray-500">{dict.noPois}</p>
      </div>
    );
  }

  const grouped = groupByCategory(pois);
  const categories = Array.from(grouped.keys()).sort((a, b) =>
    dict[CATEGORY_LABEL_KEY[a]].localeCompare(dict[CATEGORY_LABEL_KEY[b]]),
  );

  return (
    <div>
      <header className="mb-6">
        <Title level={1} size="2xl" className="font-heading">
          {dict.pois}
        </Title>
        <Small variant="muted" as="p" className="mt-1">
          {dict.poisSubtitle}
        </Small>
      </header>

      <div className="space-y-6">
        {categories.map((category) => {
          const items = grouped.get(category) ?? [];
          return (
            <section key={category}>
              <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-baseline gap-2">
                {dict[CATEGORY_LABEL_KEY[category]]}
                <Small variant="muted">({items.length})</Small>
              </h2>
              <ul className="border border-gray-200 bg-white divide-y divide-gray-100">
                {items.map((poi) => (
                  <li
                    key={poi.id}
                    className="flex items-baseline justify-between gap-4 px-3 py-2"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {poi.name}
                    </span>
                    <Small variant="muted" className="shrink-0">
                      {formatDistance(poi.distance_meters)}
                    </Small>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
