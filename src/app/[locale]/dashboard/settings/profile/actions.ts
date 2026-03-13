"use server";

import { createClient } from "@/lib/supabase/server";
import { getPostHogServer } from "@/lib/posthog-server";

export async function updateProfile(fullName: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) throw new Error(error.message);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const posthog = getPostHogServer();
    posthog.capture({
      distinctId: user.id,
      event: "profile_updated",
    });
    await posthog.flush();
  }
}
