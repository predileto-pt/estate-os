"use client";

import { Button } from "@/components/ui/button";
import { deleteAccount } from "../actions";

export function DeleteAccountButton({
  label,
  confirmMessage,
}: {
  label: string;
  confirmMessage: string;
}) {
  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    await deleteAccount();
  }

  return (
    <Button type="button" variant="steel" onClick={handleDelete}>
      {label}
    </Button>
  );
}
