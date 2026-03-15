"use client";

import type { Client } from "@/lib/db-types";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClientDetail } from "./client-detail-context";

export function ClientCard({
  client,
  dict,
}: {
  client: Client;
  dict: Dictionary["dashboard"];
}) {
  const { selectedId, select } = useClientDetail();
  const p = client.person;
  const isSelected = selectedId === client.uuid;

  return (
    <div
      className={cn(
        "border border-gray-200 border-l-4 border-l-gray-300 bg-white transition-shadow",
        isSelected && "ring-2 ring-blue-400 ring-offset-1",
      )}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-gray-900">
            {p.full_name}
          </h3>
          {client.properties.length > 0 && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {client.properties.length} {dict.clientProperties}
            </span>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {p.email}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {p.phone_number}
        </div>
      </div>

      {/* NIF & Address */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1">
        <div className="text-xs text-gray-500">
          <span className="text-gray-400">{dict.clientNif}: </span>
          <span className="font-medium text-gray-700">{p.nif}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{p.address}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
        <Button variant="steel" onClick={() => select(client)}>
          {dict.details}
        </Button>
      </div>
    </div>
  );
}
