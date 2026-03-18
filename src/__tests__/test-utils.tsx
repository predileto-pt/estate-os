import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { FormPreviewProvider } from "@/app/[locale]/formularios/components/form-preview-context";
import en from "@/dictionaries/en.json";

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <DictionaryProvider dictionary={en}>
      <FormPreviewProvider>{children}</FormPreviewProvider>
    </DictionaryProvider>
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
