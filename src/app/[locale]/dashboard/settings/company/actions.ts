"use server";

import { createClient } from "@/lib/supabase/server";
import { getPostHogServer } from "@/lib/posthog-server";

export async function updateCompany(data: {
  name: string;
  nif: string;
  address: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("companies").upsert(
    {
      user_id: user.id,
      name: data.name,
      nif: data.nif,
      address: data.address,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId: user.id,
    event: "company_updated",
  });
  await posthog.flush();
}
