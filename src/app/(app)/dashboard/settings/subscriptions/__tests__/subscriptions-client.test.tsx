import React from "react";
import { renderWithProviders, screen, userEvent, waitFor } from "@/__tests__/test-utils";
import en from "@/dictionaries/en.json";

import { SubscriptionsClient } from "../subscriptions-client";

const d = en.dashboard;

function proTrialingSub() {
  return {
    id: "sub-1",
    organization_id: "org-1",
    plan: "pro" as const,
    type: "stripe" as const,
    status: "trialing" as const,
    cadence: "monthly" as const,
    stripe_customer_id: "cus_1",
    stripe_subscription_id: "stripe_sub_1",
    stripe_price_id: "price_pro_monthly_test",
    current_period_start: null,
    current_period_end: null,
  };
}

describe("SubscriptionsClient (management-only)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("no subscription (freemium) → shows Upgrade plan CTA linking to /upgrade", () => {
    renderWithProviders(<SubscriptionsClient dictionary={d} subscription={null} />);

    expect(screen.getByText(d.planFreemium)).toBeInTheDocument();
    const upgradeLink = screen.getByText(d.upgradePlan).closest("a");
    expect(upgradeLink).toHaveAttribute("href", "/upgrade");
  });

  test("trialing Pro → Manage billing button calls /api/billing/portal", async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ url: "http://stripe.test/portal_1" }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderWithProviders(
      <SubscriptionsClient dictionary={d} subscription={proTrialingSub()} />,
    );

    expect(screen.getByText(d.planPro)).toBeInTheDocument();
    expect(screen.queryByText(d.upgradePlan)).toBeNull();

    await user.click(screen.getByText(d.manageBilling));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/billing/portal",
        expect.objectContaining({ method: "POST" }),
      ),
    );
  });

  test("portal error shows billingUnavailable banner", async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "boom",
    }) as unknown as typeof fetch;

    renderWithProviders(
      <SubscriptionsClient dictionary={d} subscription={proTrialingSub()} />,
    );

    await user.click(screen.getByText(d.manageBilling));

    await waitFor(() =>
      expect(screen.getByText(d.billingUnavailable)).toBeInTheDocument(),
    );
  });
});
