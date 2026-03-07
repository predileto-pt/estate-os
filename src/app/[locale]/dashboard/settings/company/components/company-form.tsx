"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDictionary } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { updateCompany } from "../actions";
import type { CompanyRow } from "@/lib/db-types";

const companySchema = z.object({
  name: z.string().min(1),
  nif: z.string().min(1),
  address: z.string().min(1),
});

type CompanyFormData = z.infer<typeof companySchema>;

export function CompanyForm({ company }: { company: CompanyRow | null }) {
  const dict = useDictionary();
  const d = dict.dashboard;
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? "",
      nif: company?.nif ?? "",
      address: company?.address ?? "",
    },
  });

  async function onSubmit(data: CompanyFormData) {
    setSaved(false);
    await updateCompany(data);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-lg font-bold font-heading">{d.company}</h1>

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          {d.companyName}
        </label>
        <input
          {...register("name")}
          className="w-full border border-gray-200 px-3 py-2 text-sm"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{d.required}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">{d.nif}</label>
        <input
          {...register("nif")}
          className="w-full border border-gray-200 px-3 py-2 text-sm"
        />
        {errors.nif && (
          <p className="text-sm text-red-500 mt-1">{d.required}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          {d.address}
        </label>
        <input
          {...register("address")}
          className="w-full border border-gray-200 px-3 py-2 text-sm"
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{d.required}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {d.save}
        </Button>
        {saved && <span className="text-sm text-green-600">{d.saved}</span>}
      </div>
    </form>
  );
}
