"use client";

import { useState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { updateProfile } from "../actions";

export function ProfileForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const dict = useDictionary();
  const d = dict.dashboard;
  const [name, setName] = useState(fullName);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateProfile(name);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-lg font-bold font-heading">{d.profile}</h1>

      <div>
        <label className="block text-sm text-gray-500 mb-1">{d.email}</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">{d.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          className="w-full border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={saving}>
          {d.save}
        </Button>
        {saved && <span className="text-sm text-green-600">{d.saved}</span>}
      </div>
    </form>
  );
}
