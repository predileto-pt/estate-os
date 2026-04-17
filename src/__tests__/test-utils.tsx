import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { FormPreviewProvider } from "@/app/formularios/components/form-preview-context";
import en from "@/dictionaries/en.json";

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <DictionaryProvider dictionary={en} locale="en">
        <FormPreviewProvider>{children}</FormPreviewProvider>
      </DictionaryProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { default as userEvent } from "@testing-library/user-event";
export { screen, waitFor, within, act } from "@testing-library/react";
