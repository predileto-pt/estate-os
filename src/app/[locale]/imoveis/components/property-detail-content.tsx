"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { components } from "@/lib/types/estate-os-api";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Small } from "@/components/ui/small";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { createPropertyPrice } from "../novo/actions";

type PropertyResponse = components["schemas"]["PropertyResponse"];
type PropertyPriceResponse = components["schemas"]["PropertyPriceResponse"];
type PropertyStatus = components["schemas"]["PropertyStatus"];
type ListingType = components["schemas"]["ListingType"];

function formatNif(nif: string) {
  const digits = nif.replace(/\D/g, "");
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

function formatDateDMY(dateString: string): string {
  const d = new Date(dateString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

const STATUS_STYLES: Record<PropertyStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-emerald-50 text-emerald-700",
  sold: "bg-blue-50 text-blue-700",
  rented: "bg-violet-50 text-violet-700",
  withdrawn: "bg-red-50 text-red-600",
};

const FAKE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=500&fit=crop",
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  return (
    <div>
      {/* Main image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[16/10]">
        <img
          src={FAKE_IMAGES[current]}
          alt={`Property photo ${current + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrent((c) => (c - 1 + FAKE_IMAGES.length) % FAKE_IMAGES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % FAKE_IMAGES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Counter */}
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
          {current + 1} / {FAKE_IMAGES.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1.5 mt-3">
        {FAKE_IMAGES.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "flex-1 aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer transition-opacity",
              i === current ? "scale-95 border-2 border-gray-400" : "opacity-60 hover:opacity-100",
            )}
          >
            <img
              src={src}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Characteristic icons ── */

function AreaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function BedroomIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
    </svg>
  );
}

function BathroomIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" /><line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" /><line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}

function FloorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M12 6v4" /><path d="M12 14v4" />
    </svg>
  );
}

function BuiltAtIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
    </svg>
  );
}

function EnergyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

function ElevatorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 9 3-3 3 3" /><path d="m15 15-3 3-3-3" />
    </svg>
  );
}

function GardenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M12 22V12" /><path d="M7 12c-1.5 0-4.5 1.5-4.5 6" /><path d="M17 12c1.5 0 4.5 1.5 4.5 6" />
      <path d="M12 12C12 7 9 4 6 4c0 3 2 6 6 8z" /><path d="M12 12c0-5 3-8 6-8 0 3-2 6-6 8z" />
    </svg>
  );
}

function PoolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M2 16c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}

function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

function PropertyPriceCard({
  property,
  prices,
  dict,
}: {
  property: PropertyResponse;
  prices: PropertyPriceResponse[];
  dict: Dictionary["dashboard"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState("");
  const [listingType, setListingType] = useState<ListingType>(property.listing_type);
  const [error, setError] = useState<string | null>(null);

  const currentPrice = prices.length > 0 ? prices[0] : null;

  const listingTypeOptions = [
    { value: "sale", label: dict.sale },
    { value: "purchase", label: dict.purchase },
  ];

  const listingTypeLabel: Record<string, string> = {
    sale: dict.sale,
    purchase: dict.purchase,
  };

  function handleEdit() {
    setAmount(currentPrice?.amount ?? "");
    setListingType(currentPrice?.listing_type ?? property.listing_type);
    setError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
  }

  function handleSave() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Valor inválido");
      return;
    }

    startTransition(async () => {
      const result = await createPropertyPrice({
        property_id: property.id,
        amount: parsed,
        listing_type: listingType,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <Small variant="label">{dict.propertyPrice}</Small>
        {currentPrice && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-4 py-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">{dict.listingType}</label>
              <Select
                value={listingType}
                onValueChange={(v) => setListingType(v as ListingType)}
                options={listingTypeOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Valor (EUR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={handleSave} disabled={isPending}>
                {isPending ? "..." : "Guardar"}
              </Button>
              <Button variant="steel" onClick={handleCancel} disabled={isPending}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : currentPrice ? (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentPrice.amount)}
            </div>
            <div className="text-sm text-gray-500">
              {listingTypeLabel[currentPrice.listing_type] ?? currentPrice.listing_type}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Nenhum preço configurado.</p>
            <Button variant="primary" onClick={() => { setError(null); setIsEditing(true); }}>
              Configurar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PropertyDetailContent({
  property,
  dict,
  locale,
}: {
  property: PropertyResponse;
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
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

  const statusLabel: Record<PropertyStatus, string> = {
    draft: dict.propertyStatusDraft,
    active: dict.propertyStatusActive,
    sold: dict.propertyStatusSold,
    rented: dict.propertyStatusRented,
    withdrawn: dict.propertyStatusWithdrawn,
  };

  const civilStatusLabel: Record<string, string> = {
    single: dict.civilStatusSingle,
    married: dict.civilStatusMarried,
    divorced: dict.civilStatusDivorced,
    widowed: dict.civilStatusWidowed,
    civil_union: dict.civilStatusCivilUnion,
    separated: dict.civilStatusSeparated,
  };

  const documentTypeLabel: Record<string, string> = {
    cartao_cidadao: dict.documentTypeCC,
    passport: dict.documentTypePassport,
    visto_residencia: dict.documentTypeResidenceVisa,
    titulo_residencia: dict.documentTypeResidencePermit,
  };

  const chars = property.characteristics;
  const lat = property.latitude;
  const lng = property.longitude;
  const hasCoords = lat != null && lng != null;

  const characteristicsGrid = [
    { icon: <AreaIcon />, label: dict.areaM2, value: chars?.area_in_m2 != null ? `${chars.area_in_m2} m²` : "—" },
    { icon: <BedroomIcon />, label: dict.bedrooms, value: chars?.num_of_bedrooms != null ? String(chars.num_of_bedrooms) : "—" },
    { icon: <BathroomIcon />, label: dict.bathrooms, value: chars?.num_of_bathrooms != null ? String(chars.num_of_bathrooms) : "—" },
    { icon: <FloorIcon />, label: dict.floor, value: chars?.floor != null ? String(chars.floor) : "—" },
    { icon: <BuiltAtIcon />, label: dict.builtAt, value: chars?.built_at != null ? String(chars.built_at) : "—" },
    { icon: <EnergyIcon />, label: dict.energyRating, value: chars?.energy_rating ?? "—" },
    { icon: <ParkingIcon />, label: dict.parkingSpaces, value: chars?.parking_spaces != null ? String(chars.parking_spaces) : "—" },
    { icon: <ElevatorIcon />, label: dict.hasElevator, value: chars?.has_elevator ? "Sim" : "—" },
    { icon: <GardenIcon />, label: dict.hasGarden, value: chars?.has_garden ? "Sim" : "—" },
    { icon: <PoolIcon />, label: dict.hasPool, value: chars?.has_pool ? "Sim" : "—" },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/${locale}/imoveis`}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {dict.imoveis}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold font-heading text-gray-900">
            {property.address}
          </h1>
          <span className={cn("inline-block px-2 py-0.5 text-xs font-medium rounded", STATUS_STYLES[property.status])}>
            {statusLabel[property.status]}
          </span>
        </div>
      </div>

      {/* 8 + 4 grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-8 space-y-6">
          {/* Image carousel */}
          <ImageCarousel />

          {/* Map card */}
          <div className="border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">Localização</Small>
            </div>
            {hasCoords ? (
              <iframe
                title="Property location"
                width="100%"
                height="300"
                className="border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.005}%2C${lng + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                Coordenadas não disponíveis
              </div>
            )}
          </div>

          {/* Description card */}
          <div className="border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.description}</Small>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description || "Sem descrição disponível."}
              </p>
            </div>
          </div>

          {/* Characteristics card */}
          <div className="border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Small variant="label">{dict.characteristics}</Small>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {listingTypeLabel[property.listing_type] ?? property.listing_type}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-600">
                {typologyLabel[property.typology] ?? property.typology}
              </span>
            </div>
            <div className="grid grid-cols-5 divide-x divide-gray-100">
              {characteristicsGrid.map((item) => (
                <div key={item.label} className="px-4 py-4 flex flex-col items-center text-center gap-1.5">
                  {item.icon}
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="col-span-4">
          <div className="sticky top-4 space-y-6">
            {/* Owners card */}
            <div className="border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <Small variant="label">{dict.owners}</Small>
              </div>
              {property.owners.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {property.owners.map((owner) => (
                    <div key={owner.id} className="px-4 py-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          {owner.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{owner.full_name}</div>
                          <div className="text-xs text-gray-400">{formatNif(owner.nif)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {owner.civil_status && (
                          <div>
                            <div className="text-xs text-gray-400">{dict.civilStatus}</div>
                            <div className="text-sm text-gray-700">
                              {civilStatusLabel[owner.civil_status] ?? owner.civil_status}
                            </div>
                          </div>
                        )}
                        {owner.date_of_birth && (
                          <div>
                            <div className="text-xs text-gray-400">{dict.dateOfBirth}</div>
                            <div className="text-sm text-gray-700">{formatDateDMY(owner.date_of_birth)}</div>
                          </div>
                        )}
                      </div>

                      {/* Document info — conditional per type */}
                      {owner.document_type && (
                        <div className="border-t border-gray-100 pt-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-gray-400">{dict.documentType}</div>
                              <div className="text-sm text-gray-700">
                                {documentTypeLabel[owner.document_type] ?? owner.document_type}
                              </div>
                            </div>
                            {owner.document_id && (
                              <div>
                                <div className="text-xs text-gray-400">{dict.documentId}</div>
                                <div className="text-sm text-gray-700">{owner.document_id}</div>
                              </div>
                            )}
                          </div>

                          {(owner.document_type === "cartao_cidadao" || owner.document_type === "passport") && (
                            <div className="grid grid-cols-2 gap-3">
                              {owner.issued_by && (
                                <div>
                                  <div className="text-xs text-gray-400">{dict.issuedBy}</div>
                                  <div className="text-sm text-gray-700">{owner.issued_by}</div>
                                </div>
                              )}
                              {owner.document_type === "cartao_cidadao" && owner.issuing_district && (
                                <div>
                                  <div className="text-xs text-gray-400">{dict.issuingDistrict}</div>
                                  <div className="text-sm text-gray-700">{owner.issuing_district}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {(owner.document_type === "visto_residencia" || owner.document_type === "titulo_residencia") && (
                            <div className="grid grid-cols-2 gap-3">
                              {owner.issued_by && (
                                <div>
                                  <div className="text-xs text-gray-400">{dict.issuedBy}</div>
                                  <div className="text-sm text-gray-700">{owner.issued_by}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-gray-400">{dict.ownerAddress}</div>
                        <div className="text-sm text-gray-700">{owner.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-400">
                  Sem proprietários registados.
                </div>
              )}
            </div>

            {/* Price card */}
            <PropertyPriceCard property={property} prices={property.prices} dict={dict} />

            {/* Dates + ID card */}
            <div className="border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-4 space-y-2">
                <div>
                  <div className="text-xs text-gray-400">{dict.createdAt}</div>
                  <div className="text-sm text-gray-700">{formatDate(property.created_at, locale)}</div>
                </div>
                <div className="text-xs font-mono text-gray-400 truncate">
                  ID: {property.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
