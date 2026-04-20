"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDictionary } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { getMe, updateOrganization } from "@/app/register/actions";
import type { components } from "@/lib/types/estate-os-api";

const organizationSchema = z.object({
  name: z.string().min(1),
  nif: z.string().min(1),
  address: z.string().min(1),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export default function OrganizationPage() {
  const dict = useDictionary();
  const d = dict.dashboard;
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<
    components["schemas"]["OrganizationResponse"] | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "", nif: "", address: "" },
  });

  useEffect(() => {
    getMe().then((result) => {
      if (result.error === null && result.data.organization) {
        setOrganization(result.data.organization);
        reset({
          name: result.data.organization.name ?? "",
          nif: result.data.organization.nif ?? "",
          address: result.data.organization.address ?? "",
        });
      }
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(data: OrganizationFormData) {
    if (!organization) return;
    setSaved(false);
    const result = await updateOrganization({
      organization_id: organization.id,
      ...data,
    });
    if (result.error === null) {
      setOrganization({ ...organization, ...data });
      setSaved(true);
      setEditing(false);
    }
  }

  function handleCancel() {
    reset({
      name: organization?.name ?? "",
      nif: organization?.nif ?? "",
      address: organization?.address ?? "",
    });
    setEditing(false);
    setSaved(false);
  }

  if (loading) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold font-heading">{d.organization}</h1>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {d.edit}
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {d.organizationSettingsName}
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
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              {d.cancel}
            </button>
          </div>
        </form>
      ) : (
        <div className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-1">
          <p className="text-sm font-medium">{organization?.name}</p>
          <p className="text-sm text-gray-500">{organization?.nif}</p>
          <p className="text-sm text-gray-500">{organization?.address}</p>
        </div>
      )}

      {saved && <span className="text-sm text-green-600">{d.saved}</span>}
    </div>
  );
}
