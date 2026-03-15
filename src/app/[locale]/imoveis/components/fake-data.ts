import type { Property } from "@/lib/db-types";

export const FAKE_PROPERTIES: Property[] = [
  {
    uuid: "prop-1",
    title: "Apartamento T2 em Cedofeita",
    address: "Rua de Cedofeita 45 3E, 4050-180 Porto",
    listing_type: "arrendamento",
    property_type: "apartamento",
    property_value: 185000,
    monthly_rent: 850,
    tenant_id: "tenant-1",
  },
  {
    uuid: "prop-2",
    title: "Moradia T4 em Cascais",
    address: "Rua Frederico Arouca 12, 2750-342 Cascais",
    listing_type: "venda",
    property_type: "moradia",
    property_value: 650000,
    monthly_rent: null,
    tenant_id: "tenant-1",
  },
  {
    uuid: "prop-3",
    title: "Apartamento T1 no Chiado",
    address: "Rua Garrett 78, 1200-205 Lisboa",
    listing_type: "arrendamento",
    property_type: "apartamento",
    property_value: 320000,
    monthly_rent: 1200,
    tenant_id: "tenant-1",
  },
  {
    uuid: "prop-4",
    title: "Apartamento T3 na Foz do Douro",
    address: "Av. Brasil 156, 4150-153 Porto",
    listing_type: "venda",
    property_type: "apartamento",
    property_value: 475000,
    monthly_rent: null,
    tenant_id: "tenant-1",
  },
];
