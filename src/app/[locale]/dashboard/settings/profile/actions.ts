"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(fullName: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) throw new Error(error.message);
}
