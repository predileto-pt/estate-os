import { redirect } from "next/navigation";

import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { createClient } from "@/lib/supabase/server";

import { SuccessClient } from "./success-client";

// Chrome-free page Stripe Checkout redirects to after a successful payment.
// Lives outside `(app)/` for the same reason as `/upgrade` — no sidebar,
// no header, the user sees a focused confirmation screen. Webhook-driven
// reconciliation happens out-of-band; this page doesn't wait for it.
export default async function UpgradeSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  return <SuccessClient dictionary={dict.dashboard} />;
}
