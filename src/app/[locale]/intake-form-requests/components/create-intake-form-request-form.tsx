"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { createIntakeFormRequest } from "../actions";

const schema = z.object({
  applicant_name: z.string().min(1, { message: "Required" }),
  applicant_email: z.string().email({ message: "Invalid email" }),
  applicant_phone: z.string().optional(),
  property_id: z.string().min(1, { message: "Required" }),
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
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(values: FormValues) {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return;

    startTransition(async () => {
      const result = await createIntakeFormRequest(parsed.data);
      if (result?.success) {
        reset();
        setOpen(false);
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
        <input {...register("applicant_phone")} type="tel" className={inputClass} />
      </div>

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
        <input {...register("property_address")} className={inputClass} />
      </div>

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
          }}
        >
          {dict.cancel}
        </Button>
      </div>
    </form>
  );
}
