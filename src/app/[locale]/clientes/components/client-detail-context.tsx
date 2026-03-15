"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Client } from "@/lib/db-types";

interface ClientDetailState {
  selectedId: string | null;
  select: (client: Client) => void;
  close: () => void;
}

const ClientDetailContext = createContext<ClientDetailState | null>(null);

export function ClientDetailProvider({
  children,
  clients,
}: {
  children: React.ReactNode;
  clients: Client[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("client_id");

  const select = useCallback(
    (client: Client) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("client_id") === client.uuid) {
        params.delete("client_id");
      } else {
        params.set("client_id", client.uuid);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("client_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const value = useMemo(
    () => ({ selectedId, select, close }),
    [selectedId, select, close],
  );

  return (
    <ClientDetailContext value={value}>
      {children}
    </ClientDetailContext>
  );
}

export function useClientDetail() {
  const ctx = useContext(ClientDetailContext);
  if (!ctx) throw new Error("useClientDetail must be used within ClientDetailProvider");
  return ctx;
}

export function useSelectedClient(clients: Client[]): Client | null {
  const { selectedId } = useClientDetail();
  return useMemo(
    () => clients.find((c) => c.uuid === selectedId) ?? null,
    [clients, selectedId],
  );
}
