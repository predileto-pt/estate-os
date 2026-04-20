import { redirect } from "next/navigation";

import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { createClient } from "@/lib/supabase/server";

import { UpgradeClient } from "./upgrade-client";

// Chrome-free plan-picker page. Lives outside `(app)/` so it inherits only
// the root layout's providers — no sidebar, no header. Supabase auth check
// runs here (not in `(app)/layout.tsx`) because this page isn't in that group.
export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  return <UpgradeClient dictionary={dict.dashboard} />;
}
