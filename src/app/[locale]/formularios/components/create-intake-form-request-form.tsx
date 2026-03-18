"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { createIntakeFormRequest } from "../actions";
import type { PropertySummary } from "../actions";
import { useFormPreview } from "./form-preview-context";

const schema = z.object({
  applicant_name: z.string().min(1, { message: "Required" }),
  applicant_email: z.string().email({ message: "Invalid email" }),
  applicant_phone: z.string().optional(),
  property_id: z.string().min(1, { message: "Required" }),
  property_type: z.enum(["MORADIA", "APARTAMENTO", "TERRENO"]).optional(),
  listing_type: z.enum(["VENDA", "ARRENDAMENTO"]).optional(),
  property_title: z.string().optional(),
  property_price: z.coerce.number().positive().optional().catch(undefined),
  property_address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateIntakeFormRequestForm({
  dict,
}: {
  dict: Dictionary["dashboard"];
}) {
  const { open, setOpen, setValues } = useFormPreview();
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const [phoneMasked, setPhoneMasked] = useState("");
  const [propertyMode, setPropertyMode] = useState<"manual" | "select">("manual");
  const [summaries, setSummaries] = useState<PropertySummary[]>([]);
  const skipWatchRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    fetch("/api/properties/summary")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((properties: PropertySummary[]) => setSummaries(properties))
      .catch(() => {});
  }, []);

  function clearPropertyFields() {
    setValue("property_id", "");
    setValue("property_type", undefined);
    setValue("listing_type", undefined);
    setValue("property_title", "");
    setValue("property_price", undefined);
    setValue("property_address", "");
  }

  function reset() {
    resetForm();
    setPhoneMasked("");
    setPropertyMode("manual");
  }

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length > 6) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    if (digits.length > 3) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return digits;
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhoneMasked(formatPhone(digits));
    setValue("applicant_phone", digits);
  }

  useEffect(() => {
    const sub = watch((values) => {
      if (skipWatchRef.current) return;
      setValues(values);
    });
    return () => sub.unsubscribe();
  }, [watch, setValues]);

  function onSubmit(values: FormValues) {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return;

    startTransition(async () => {
      const result = await createIntakeFormRequest(parsed.data);
      if (result?.success) {
        reset();
        setOpen(false);
        setValues({});
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        {dict.createIntakeFormRequest}
      </Button>
    );
  }

  const inputClass =
    "w-full border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500";

  const activeBtnClass =
    "bg-white text-gray-900 shadow-sm border border-gray-300 px-3 py-1 text-sm font-medium";
  const inactiveBtnClass =
    "text-gray-500 bg-transparent border border-transparent px-3 py-1 text-sm";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-200 bg-white p-4 space-y-3"
    >
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {dict.applicantName} *
        </label>
        <input
          {...register("applicant_name")}
          className={inputClass}
          autoFocus
        />
        {errors.applicant_name && (
          <p className="text-xs text-red-600 mt-0.5">{dict.required}</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {dict.applicantEmail} *
        </label>
        <input {...register("applicant_email")} type="email" className={inputClass} />
        {errors.applicant_email && (
          <p className="text-xs text-red-600 mt-0.5">
            {errors.applicant_email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {dict.applicantPhone}
        </label>
        <input
          type="tel"
          value={phoneMasked}
          onChange={handlePhoneChange}
          className={inputClass}
        />
      </div>

      <div className="bg-gray-100 border border-gray-200 p-3">
        <div className="flex gap-1">
          <button
            type="button"
            className={propertyMode === "manual" ? activeBtnClass : inactiveBtnClass}
            onClick={() => {
              setPropertyMode("manual");
              clearPropertyFields();
            }}
          >
            {dict.propertyManual}
          </button>
          <button
            type="button"
            className={propertyMode === "select" ? activeBtnClass : inactiveBtnClass}
            onClick={() => {
              setPropertyMode("select");
              clearPropertyFields();
            }}
          >
            {dict.propertySelect}
          </button>
        </div>

        {propertyMode === "select" && (
          <div className="mt-3">
            <Select
              value={watch("property_id") ?? ""}
              onValueChange={(val) => {
                const selected = summaries.find((s) => s.id === val) ?? null;
                skipWatchRef.current = true;
                setValue("property_id", val, { shouldValidate: true });
                if (selected) {
                  const listingType =
                    selected.listing_type === "sale" ? "VENDA" as const
                    : selected.listing_type === "purchase" ? "ARRENDAMENTO" as const
                    : undefined;
                  const propertyType =
                    selected.typology === "house" ? "MORADIA" as const
                    : selected.typology === "apartment" ? "APARTAMENTO" as const
                    : selected.typology === "land" ? "TERRENO" as const
                    : undefined;

                  setValue("property_address", selected.address);
                  setValue("property_price", selected.price ?? undefined);
                  setValue("listing_type", listingType);
                  setValue("property_type", propertyType);

                  setValues({
                    ...watch(),
                    property_id: val,
                    property_type: propertyType,
                    listing_type: listingType,
                    property_price: selected.price ?? undefined,
                    property_address: selected.address,
                  });
                } else {
                  setValues({ ...watch(), property_id: val });
                }
                queueMicrotask(() => { skipWatchRef.current = false; });
              }}
              options={[
                { value: "", label: dict.selectProperty },
                ...summaries.map((s) => ({
                  value: s.id,
                  label: s.address,
                })),
              ]}
              placeholder={dict.selectProperty}
              className="w-full border-gray-300 px-3 py-1.5 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            {errors.property_id && (
              <p className="text-xs text-red-600 mt-0.5">{dict.required}</p>
            )}
          </div>
        )}
      </div>

      {propertyMode === "manual" && (
        <>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.propertyId} *
            </label>
            <input {...register("property_id")} className={inputClass} />
            {errors.property_id && (
              <p className="text-xs text-red-600 mt-0.5">{dict.required}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.propertyType}
            </label>
            <Select
              value={watch("property_type") ?? ""}
              onValueChange={(val) =>
                setValue("property_type", val as FormValues["property_type"], {
                  shouldValidate: true,
                })
              }
              options={[
                { value: "", label: dict.required },
                { value: "MORADIA", label: dict.house },
                { value: "APARTAMENTO", label: dict.apartment },
                { value: "TERRENO", label: dict.land },
              ]}
              className="w-full border-gray-300 px-3 py-1.5 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.listingType}
            </label>
            <Select
              value={watch("listing_type") ?? ""}
              onValueChange={(val) =>
                setValue("listing_type", val as FormValues["listing_type"], {
                  shouldValidate: true,
                })
              }
              options={[
                { value: "", label: dict.required },
                { value: "VENDA", label: dict.sale },
                { value: "ARRENDAMENTO", label: dict.rental },
              ]}
              className="w-full border-gray-300 px-3 py-1.5 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.propertyTitle}
            </label>
            <input {...register("property_title")} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.propertyPrice}
            </label>
            <input
              {...register("property_price")}
              type="number"
              step="0.01"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {dict.propertyAddress}
            </label>
            <input
              {...register("property_address")}
              className={inputClass}
              placeholder="RUA DO CARRAO N307 LJ D, FORNELOS, PONTE DE LIMA, 4990-620, PORTUGAL"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {dict.propertyAddressHint}
            </p>
          </div>
        </>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" variant="primary" disabled={pending}>
          {dict.send}
        </Button>
        <Button
          type="button"
          variant="steel"
          onClick={() => {
            reset();
            setOpen(false);
            setValues({});
          }}
        >
          {dict.cancel}
        </Button>
      </div>
    </form>
  );
}
