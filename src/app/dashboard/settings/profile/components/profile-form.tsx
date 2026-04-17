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
  const [currentName, setCurrentName] = useState(fullName);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateProfile(name);
    setCurrentName(name);
    setSaving(false);
    setSaved(true);
    setEditing(false);
  }

  function handleCancel() {
    setName(currentName);
    setEditing(false);
    setSaved(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold font-heading">{d.profile}</h1>
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
        <form onSubmit={handleSubmit} className="border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 space-y-4">
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
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary" disabled={saving}>
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
          <p className="text-sm font-medium">{currentName}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      )}

      {saved && <span className="text-sm text-green-600">{d.saved}</span>}
    </div>
  );
}
