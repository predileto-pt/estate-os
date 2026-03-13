"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface FormPreviewValues {
  applicant_name?: string;
  applicant_email?: string;
  applicant_phone?: string;
  property_id?: string;
  property_type?: string;
  listing_type?: string;
  property_title?: string;
  property_price?: number;
  property_address?: string;
}

interface FormPreviewState {
  open: boolean;
  values: FormPreviewValues;
  setOpen: (open: boolean) => void;
  setValues: (values: FormPreviewValues) => void;
}

const FormPreviewContext = createContext<FormPreviewState | null>(null);

export function FormPreviewProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormPreviewValues>({});

  const value = useMemo(
    () => ({ open, values, setOpen, setValues }),
    [open, values],
  );

  return (
    <FormPreviewContext.Provider value={value}>
      {children}
    </FormPreviewContext.Provider>
  );
}

export function useFormPreview() {
  const ctx = useContext(FormPreviewContext);
  if (!ctx) throw new Error("useFormPreview must be used within FormPreviewProvider");
  return ctx;
}
