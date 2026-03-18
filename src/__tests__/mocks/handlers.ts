import { http, HttpResponse } from "msw";

export const mockProperties = [
  {
    id: "prop-1",
    address: "Rua do Carrao 307, Ponte de Lima",
    listing_type: "sale",
    typology: "house",
    price: 250000,
    owners: [{ full_name: "João Silva" }],
  },
  {
    id: "prop-2",
    address: "Av. da Liberdade 100, Lisboa",
    listing_type: "purchase",
    typology: "apartment",
    price: 180000,
    owners: [{ full_name: "Maria Santos" }],
  },
];

export const handlers = [
  http.get("/api/properties/summary", () => {
    return HttpResponse.json(mockProperties);
  }),
];
