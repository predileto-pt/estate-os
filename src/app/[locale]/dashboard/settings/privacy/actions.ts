"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPostHogServer } from "@/lib/posthog-server";

export async function deleteAccount(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Delete user via admin API — requires service role key
  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) throw new Error(error.message);

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId: user.id,
    event: "account_deleted",
  });
  await posthog.flush();

  redirect(`/${locale}/login`);
}
