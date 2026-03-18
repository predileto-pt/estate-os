import React from "react";
import { renderWithProviders, screen, waitFor, userEvent } from "@/__tests__/test-utils";
import { CreateIntakeFormRequestForm } from "../create-intake-form-request-form";
import { FormPreviewCard } from "../form-preview-card";
import en from "@/dictionaries/en.json";

// Mock server actions (getPropertySummaries now fetched via /api/properties/summary, handled by MSW)
jest.mock("../../actions", () => ({
  createIntakeFormRequest: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/en/formularios",
  useSearchParams: () => new URLSearchParams(),
}));

// Radix Select uses pointer events; stub them in jsdom
beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

const dict = en.dashboard;

function renderForm() {
  return renderWithProviders(
    <>
      <CreateIntakeFormRequestForm dict={dict} />
      <FormPreviewCard dict={dict} />
    </>,
  );
}

async function openFormAndSwitchToSelect(user: ReturnType<typeof userEvent.setup>) {
  // The form starts closed — click "New Request" to open
  await user.click(screen.getByText(dict.createIntakeFormRequest));

  // Wait for the form preview card to appear
  await waitFor(() => {
    expect(screen.getByTestId("form-preview-card")).toBeInTheDocument();
  });

  // Switch to select mode
  await user.click(screen.getByText(dict.propertySelect));

  // Wait for summaries to load — the combobox should appear
  await waitFor(() => {
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
}

async function selectPropertyOption(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
) {
  const trigger = screen.getByRole("combobox");
  await user.click(trigger);
  const option = await screen.findByRole("option", { name: label });
  await user.click(option);
}

describe("CreateIntakeFormRequestForm", () => {
  it("select mode: selecting a property updates preview with property_type and listing_type", async () => {
    const user = userEvent.setup();
    renderForm();

    await openFormAndSwitchToSelect(user);

    // Select prop-1 (house, sale)
    await selectPropertyOption(user, "Rua do Carrao 307, Ponte de Lima");

    // Assert preview shows the property data
    await waitFor(() => {
      expect(screen.getByTestId("value-property_type")).toHaveTextContent("House");
    });
    expect(screen.getByTestId("value-listing_type")).toHaveTextContent("Sale");
    expect(screen.getByTestId("value-property_address")).toHaveTextContent(
      "Rua do Carrao 307, Ponte de Lima",
    );
  });

  it("select mode: selecting a different property updates preview", async () => {
    const user = userEvent.setup();
    renderForm();

    await openFormAndSwitchToSelect(user);

    // Select first property
    await selectPropertyOption(user, "Rua do Carrao 307, Ponte de Lima");

    await waitFor(() => {
      expect(screen.getByTestId("value-property_type")).toHaveTextContent("House");
    });

    // Now select second property
    await selectPropertyOption(user, "Av. da Liberdade 100, Lisboa");

    await waitFor(() => {
      expect(screen.getByTestId("value-property_type")).toHaveTextContent("Apartment");
    });
    expect(screen.getByTestId("value-listing_type")).toHaveTextContent("Rental");
    expect(screen.getByTestId("value-property_address")).toHaveTextContent(
      "Av. da Liberdade 100, Lisboa",
    );
  });

  it("manual mode: property_type and listing_type appear from form inputs", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByText(dict.createIntakeFormRequest));

    // Manual mode is default — find property_id input by its name attribute
    const propertyIdInput = document.querySelector<HTMLInputElement>(
      'input[name="property_id"]',
    )!;
    await user.type(propertyIdInput, "PROP-123");

    // In manual mode there are two comboboxes: property type and listing type
    const comboboxes = screen.getAllByRole("combobox");
    // Select property type = House
    await user.click(comboboxes[0]);
    await user.click(await screen.findByRole("option", { name: dict.house }));

    // Select listing type = Sale
    await user.click(comboboxes[1]);
    await user.click(await screen.findByRole("option", { name: dict.sale }));

    await waitFor(() => {
      expect(screen.getByTestId("value-property_type")).toHaveTextContent("House");
    });
    expect(screen.getByTestId("value-listing_type")).toHaveTextContent("Sale");
  });
});
