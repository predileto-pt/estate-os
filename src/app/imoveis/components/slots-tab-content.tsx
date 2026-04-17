"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import {
  getSlots,
  createSlot,
  cancelSlot,
  type SlotResponse,
} from "../[id]/actions";

interface SlotsTabContentProps {
  propertyId: string;
  organizationId: string;
  dict: Dictionary["dashboard"];
}

const STATUS_STYLES: Record<SlotResponse["status"], string> = {
  available: "bg-emerald-50 text-emerald-700",
  booked: "bg-blue-50 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<SlotResponse["status"], string> = {
  available: "Available",
  booked: "Booked",
  cancelled: "Cancelled",
};

function formatDateDMY(dateString: string): string {
  const d = new Date(dateString);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(dateString: string): string {
  const d = new Date(dateString);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function SlotsTabContent({
  propertyId,
  organizationId,
}: SlotsTabContentProps) {
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getSlots(propertyId);
    if (result.error !== null) {
      setError(result.error);
    } else {
      setSlots(result.data.slots);
    }
    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getSlots(propertyId);
      if (ignore) return;
      if (result.error !== null) {
        setError(result.error);
      } else {
        setSlots(result.data.slots);
      }
      setLoading(false);
    })();
    return () => { ignore = true; };
  }, [propertyId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!date || !startTime || !endTime) {
      setFormError("All fields are required.");
      return;
    }

    if (startTime >= endTime) {
      setFormError("End time must be after start time.");
      return;
    }

    setCreating(true);
    const result = await createSlot({
      property_id: propertyId,
      organization_id: organizationId,
      start_time: `${date}T${startTime}:00Z`,
      end_time: `${date}T${endTime}:00Z`,
    });

    if (result.error !== null) {
      setFormError(result.error);
    } else {
      setDate("");
      setStartTime("");
      setEndTime("");
      await fetchSlots();
    }
    setCreating(false);
  }

  async function handleCancel(slotId: string) {
    if (!confirm("Are you sure you want to cancel this slot?")) return;

    setCancelling(slotId);
    const result = await cancelSlot(slotId);
    if (result.error !== null) {
      setError(result.error);
    } else {
      await fetchSlots();
    }
    setCancelling(null);
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <form onSubmit={handleCreate} className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Create Slot</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>
        {formError && <p className="text-xs text-red-500">{formError}</p>}
        <Button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create"}
        </Button>
      </form>

      {/* Slot list */}
      {loading && <p className="text-sm text-gray-400">Loading slots...</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <p className="text-sm text-gray-400">No slots created yet.</p>
      )}

      {!loading && slots.length > 0 && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-900">
                  {formatDateDMY(slot.start_time)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[slot.status]}`}
                >
                  {STATUS_LABELS[slot.status]}
                </span>
              </div>
              {slot.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(slot.id)}
                  disabled={cancelling === slot.id}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {cancelling === slot.id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
