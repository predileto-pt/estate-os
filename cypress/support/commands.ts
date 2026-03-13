declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", () => {
  const email = Cypress.env("TEST_EMAIL");
  const password = Cypress.env("TEST_PASSWORD");

  if (!email || !password) {
    throw new Error(
      "CYPRESS_TEST_EMAIL and CYPRESS_TEST_PASSWORD env vars are required"
    );
  }

  cy.session([email], () => {
    cy.visit("/pt/login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});

export {};
