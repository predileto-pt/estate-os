"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type {
  ListingType,
  Typology,
  PropertyStatus,
  CivilStatus,
  DocumentType,
} from "@/lib/db-types";

interface OwnerFormData {
  full_name: string;
  civil_status: CivilStatus;
  address: string;
  nif: string;
  document_type: DocumentType;
  document_id: string;
  issued_by: string;
  issuing_district: string;
  date_of_birth: string;
}

function emptyOwner(): OwnerFormData {
  return {
    full_name: "",
    civil_status: "single",
    address: "",
    nif: "",
    document_type: "cartao_cidadao",
    document_id: "",
    issued_by: "",
    issuing_district: "",
    date_of_birth: "",
  };
}

const inputClass =
  "w-full border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500";

export function ManualForm({
  dict,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const [address, setAddress] = useState("");
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [typology, setTypology] = useState<Typology>("apartment");
  const [status, setStatus] = useState<PropertyStatus>("draft");
  const [description, setDescription] = useState("");

  // Characteristics
  const [areaM2, setAreaM2] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [builtAt, setBuiltAt] = useState("");
  const [energyRating, setEnergyRating] = useState("");
  const [floor, setFloor] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [hasElevator, setHasElevator] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [hasPool, setHasPool] = useState(false);

  // Owners
  const [owners, setOwners] = useState<OwnerFormData[]>([emptyOwner()]);

  const [submitting, setSubmitting] = useState(false);

  const listingTypeOptions = [
    { value: "sale", label: dict.sale },
    { value: "purchase", label: dict.purchase },
  ];

  const typologyOptions = [
    { value: "apartment", label: dict.apartment },
    { value: "house", label: dict.house },
    { value: "land", label: dict.land },
    { value: "ruin", label: dict.ruin },
  ];

  const statusOptions = [
    { value: "draft", label: dict.propertyStatusDraft },
    { value: "active", label: dict.propertyStatusActive },
    { value: "sold", label: dict.propertyStatusSold },
    { value: "rented", label: dict.propertyStatusRented },
    { value: "withdrawn", label: dict.propertyStatusWithdrawn },
  ];

  const civilStatusOptions = [
    { value: "single", label: dict.civilStatusSingle },
    { value: "married", label: dict.civilStatusMarried },
    { value: "divorced", label: dict.civilStatusDivorced },
    { value: "widowed", label: dict.civilStatusWidowed },
    { value: "civil_union", label: dict.civilStatusCivilUnion },
    { value: "separated", label: dict.civilStatusSeparated },
  ];

  const documentTypeOptions = [
    { value: "cartao_cidadao", label: dict.documentTypeCC },
    { value: "passport", label: dict.documentTypePassport },
    { value: "visto_residencia", label: dict.documentTypeResidenceVisa },
    { value: "titulo_residencia", label: dict.documentTypeResidencePermit },
  ];

  function updateOwner(
    index: number,
    field: keyof OwnerFormData,
    value: string
  ) {
    setOwners((prev) =>
      prev.map((o, i) => (i === index ? { ...o, [field]: value } : o))
    );
  }

  function addOwner() {
    setOwners((prev) => [...prev, emptyOwner()]);
  }

  function removeOwner(index: number) {
    setOwners((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      address,
      listing_type: listingType,
      typology,
      status,
      description: description || null,
      characteristics: {
        area_in_m2: areaM2 ? parseFloat(areaM2) : null,
        num_of_bedrooms: bedrooms ? parseInt(bedrooms) : null,
        num_of_bathrooms: bathrooms ? parseInt(bathrooms) : null,
        built_at: builtAt ? parseInt(builtAt) : null,
        energy_rating: energyRating || null,
        floor: floor ? parseInt(floor) : null,
        parking_spaces: parkingSpaces ? parseInt(parkingSpaces) : null,
        has_elevator: hasElevator,
        has_garden: hasGarden,
        has_pool: hasPool,
      },
      owners: owners.map((o) => ({
        ...o,
        issuing_district: o.issuing_district || null,
      })),
    };

    // TODO: POST to API
    console.log("Manual property payload:", payload);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section>
        <h2 className="text-sm font-bold font-heading text-gray-900 mb-4">
          {dict.details}
        </h2>
        <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.address} *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={dict.propertyAddressHint}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.listingType} *
              </label>
              <Select
                value={listingType}
                onValueChange={(v) => setListingType(v as ListingType)}
                options={listingTypeOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.typology} *
              </label>
              <Select
                value={typology}
                onValueChange={(v) => setTypology(v as Typology)}
                options={typologyOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.status} *
              </label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as PropertyStatus)}
                options={statusOptions}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.description}{" "}
              <span className="text-gray-400">({dict.optional})</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Characteristics */}
      <section>
        <h2 className="text-sm font-bold font-heading text-gray-900 mb-4">
          {dict.characteristics}
        </h2>
        <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.areaM2}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={areaM2}
                onChange={(e) => setAreaM2(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.bedrooms}
              </label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.bathrooms}
              </label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.builtAt}
              </label>
              <input
                type="number"
                min="1000"
                max="2100"
                value={builtAt}
                onChange={(e) => setBuiltAt(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.energyRating}
              </label>
              <input
                type="text"
                value={energyRating}
                onChange={(e) => setEnergyRating(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.floor}
              </label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {dict.parkingSpaces}
              </label>
              <input
                type="number"
                min="0"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
                className="accent-green-600"
              />
              {dict.hasElevator}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGarden}
                onChange={(e) => setHasGarden(e.target.checked)}
                className="accent-green-600"
              />
              {dict.hasGarden}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPool}
                onChange={(e) => setHasPool(e.target.checked)}
                className="accent-green-600"
              />
              {dict.hasPool}
            </label>
          </div>
        </div>
      </section>

      {/* Owners */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-heading text-gray-900">
            {dict.owners}
          </h2>
          <Button type="button" variant="default" onClick={addOwner}>
            + {dict.addOwner}
          </Button>
        </div>

        <div className="space-y-6">
          {owners.map((owner, index) => (
            <div
              key={index}
              className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {dict.ownerNumber} {index + 1}
                </span>
                {owners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOwner(index)}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    {dict.removeOwner}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.ownerFullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={owner.full_name}
                    onChange={(e) =>
                      updateOwner(index, "full_name", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.civilStatus} *
                  </label>
                  <Select
                    value={owner.civil_status}
                    onValueChange={(v) => updateOwner(index, "civil_status", v)}
                    options={civilStatusOptions}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {dict.address} *
                </label>
                <input
                  type="text"
                  required
                  value={owner.address}
                  onChange={(e) =>
                    updateOwner(index, "address", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.nif} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    pattern="\d{9}"
                    value={owner.nif}
                    onChange={(e) =>
                      updateOwner(
                        index,
                        "nif",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.dateOfBirth} *
                  </label>
                  <input
                    type="date"
                    required
                    value={owner.date_of_birth}
                    onChange={(e) =>
                      updateOwner(index, "date_of_birth", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.documentType} *
                  </label>
                  <Select
                    value={owner.document_type}
                    onValueChange={(v) =>
                      updateOwner(index, "document_type", v)
                    }
                    options={documentTypeOptions}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.documentId} *
                  </label>
                  <input
                    type="text"
                    required
                    value={owner.document_id}
                    onChange={(e) =>
                      updateOwner(index, "document_id", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.issuedBy} *
                  </label>
                  <input
                    type="text"
                    required
                    value={owner.issued_by}
                    onChange={(e) =>
                      updateOwner(index, "issued_by", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {dict.issuingDistrict}{" "}
                    <span className="text-gray-400">({dict.optional})</span>
                  </label>
                  <input
                    type="text"
                    value={owner.issuing_district}
                    onChange={(e) =>
                      updateOwner(index, "issuing_district", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end pt-2 pb-8">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? dict.submitting : dict.submit}
        </Button>
      </div>
    </form>
  );
}
