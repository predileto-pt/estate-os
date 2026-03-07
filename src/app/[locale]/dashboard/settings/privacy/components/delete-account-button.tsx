"use client";

import { Button } from "@/components/ui/button";
import { deleteAccount } from "../actions";

export function DeleteAccountButton({
  label,
  confirmMessage,
  locale,
}: {
  label: string;
  confirmMessage: string;
  locale: string;
}) {
  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    await deleteAccount(locale);
  }

  return (
    <Button type="button" variant="steel" onClick={handleDelete}>
      {label}
    </Button>
  );
}
