describe("Form Preview Card", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/pt/formularios");
  });

  it("shows skeleton placeholders when the form opens with empty fields", () => {
    // Click the "Novo Pedido" button to open the form
    cy.contains("button", "Novo Pedido").click();

    // Preview card should appear
    cy.get('[data-testid="form-preview-card"]').should("be.visible");

    // All fields should show skeletons (no values typed yet)
    cy.get('[data-testid="skeleton-applicant_name"]').should("exist");
    cy.get('[data-testid="skeleton-applicant_email"]').should("exist");
    cy.get('[data-testid="skeleton-applicant_phone"]').should("exist");
    cy.get('[data-testid="skeleton-property_id"]').should("exist");
    cy.get('[data-testid="skeleton-property_type"]').should("exist");
    cy.get('[data-testid="skeleton-listing_type"]').should("exist");
    cy.get('[data-testid="skeleton-property_title"]').should("exist");
    cy.get('[data-testid="skeleton-property_price"]').should("exist");
    cy.get('[data-testid="skeleton-property_address"]').should("exist");
  });

  it("replaces skeletons with values as user types", () => {
    cy.contains("button", "Novo Pedido").click();
    cy.get('[data-testid="form-preview-card"]').should("be.visible");

    // Type applicant name
    cy.get('input[name="applicant_name"]').type("João Silva");
    cy.get('[data-testid="value-applicant_name"]')
      .should("exist")
      .and("contain.text", "João Silva");
    cy.get('[data-testid="skeleton-applicant_name"]').should("not.exist");

    // Type email
    cy.get('input[name="applicant_email"]').type("joao@exemplo.pt");
    cy.get('[data-testid="value-applicant_email"]')
      .should("exist")
      .and("contain.text", "joao@exemplo.pt");
    cy.get('[data-testid="skeleton-applicant_email"]').should("not.exist");

    // Type property ID
    cy.get('input[name="property_id"]').type("PROP-001");
    cy.get('[data-testid="value-property_id"]')
      .should("exist")
      .and("contain.text", "PROP-001");
    cy.get('[data-testid="skeleton-property_id"]').should("not.exist");
  });

  it("formats phone input as 000 000 000 and shows formatted value in preview", () => {
    cy.contains("button", "Novo Pedido").click();
    cy.get('[data-testid="form-preview-card"]').should("be.visible");

    // Type phone digits
    cy.get('input[type="tel"]').type("912345678");

    // Input should display masked value
    cy.get('input[type="tel"]').should("have.value", "912 345 678");

    // Preview should show formatted phone
    cy.get('[data-testid="value-applicant_phone"]')
      .should("exist")
      .and("contain.text", "912 345 678");
    cy.get('[data-testid="skeleton-applicant_phone"]').should("not.exist");
  });

  it("strips non-digit characters from phone input", () => {
    cy.contains("button", "Novo Pedido").click();

    cy.get('input[type="tel"]').type("91a2b3c4d5e6f7g8h");
    cy.get('input[type="tel"]').should("have.value", "912 345 678");
  });

  it("limits phone to 9 digits", () => {
    cy.contains("button", "Novo Pedido").click();

    cy.get('input[type="tel"]').type("9123456789999");
    cy.get('input[type="tel"]').should("have.value", "912 345 678");
  });

  it("hides preview card when form is cancelled", () => {
    cy.contains("button", "Novo Pedido").click();
    cy.get('[data-testid="form-preview-card"]').should("be.visible");

    cy.contains("button", "Cancelar").click();
    cy.get('[data-testid="form-preview-card"]').should("not.exist");
  });
});
