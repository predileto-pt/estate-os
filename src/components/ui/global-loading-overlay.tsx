"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface GlobalLoadingState {
  show: (message?: string) => void;
  hide: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingState | null>(null);

export function useGlobalLoading(): GlobalLoadingState {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  return ctx;
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ visible: boolean; message?: string }>({
    visible: false,
  });

  const show = useCallback((message?: string) => {
    setState({ visible: true, message });
  }, []);

  const hide = useCallback(() => {
    setState({ visible: false });
  }, []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <GlobalLoadingContext value={value}>
      {children}
      {state.visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg px-10 py-8 shadow-xl flex flex-col items-center gap-4 min-w-[200px]">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-gray-700" />
            {state.message && (
              <p className="text-sm font-medium text-gray-700">{state.message}</p>
            )}
          </div>
        </div>
      )}
    </GlobalLoadingContext>
  );
}
