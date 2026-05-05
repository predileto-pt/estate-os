import { getCurrentSubscription, type CurrentSubscription } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/errors";
import { getDictionary } from "@/lib/i18n";
import { getLocaleFromCookie } from "@/lib/i18n-server";

import { SubscriptionsClient } from "./subscriptions-client";

async function loadSubscription(): Promise<CurrentSubscription | null> {
  try {
    return await getCurrentSubscription();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}

export default async function SubscriptionsPage() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const subscription = await loadSubscription();

  return (
    <SubscriptionsClient
      dictionary={dict.dashboard}
      subscription={subscription}
    />
  );
}
