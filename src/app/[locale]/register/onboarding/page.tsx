"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDictionary } from "@/components/dictionary-provider";
import { getMe, updateOrganization } from "../actions";

export default function OnboardingPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const dict = useDictionary();
  const d = dict.dashboard;
  const [organizationName, setOrganizationName] = useState("");
  const [nif, setNif] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!organizationName.trim() || !nif.trim() || !address.trim()) {
      setError(d.required);
      return;
    }

    setLoading(true);

    const meResult = await getMe();
    if (meResult.error !== null) {
      setError(meResult.error);
      setLoading(false);
      return;
    }

    const organizationId = meResult.data.user.organization_id;
    if (!organizationId) {
      setError("No organization found");
      setLoading(false);
      return;
    }

    const result = await updateOrganization({
      organization_id: organizationId,
      name: organizationName,
      nif,
      address,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-bold font-heading mb-2">{d.onboardingTitle}</h1>
        <p className="text-sm text-gray-500 mb-6">{d.onboardingSubtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.organizationName}</label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.nifLabel}</label>
            <input
              type="text"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">{d.organizationAddress}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 text-sm font-heading hover:bg-gray-800 disabled:opacity-50"
          >
            {d.save}
          </button>
        </form>
      </div>
    </div>
  );
}
