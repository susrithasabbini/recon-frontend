// cypress/e2e/account-creation.cy.ts
describe("Account Creation Page", () => {
  beforeEach(() => {
    cy.visit("/account-creation");
  });

  it("should display loading skeleton initially", () => {
    cy.get('[data-testid="loading-skeleton"]').should("be.visible");
  });

  it("should create a new account", () => {
    cy.get('[data-testid="account-name-input"]').type("Test Account");
    cy.get('[data-testid="add-account-button"]').click();
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account created",
    );
    cy.get('[data-testid="accounts-table"]').should("contain", "Test Account");
    cy.get('[data-testid="accounts-table"]').should("contain", "Debit");
    cy.get('[data-testid="total-accounts"]').should("contain", "1");
  });

  it("should validate required fields", () => {
    cy.get('[data-testid="name-error"]').should("be.visible");
  });

  it("should edit an existing account", () => {
    // First create an account
    cy.get('[data-testid="account-name-input"]').type("Test Account");
    cy.get('[data-testid="add-account-button"]').click();
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account created",
    );

    // Then edit it
    cy.get('[data-testid="edit-button"]').first().click();
    cy.get('[data-testid="edit-name-input"]').clear().type("Updated Account");
    cy.get('[data-testid="edit-type-select"]').click();
    cy.get('[data-key="credit"]').click();
    cy.get('[data-testid="save-edit-button"]').click();
    cy.get('[data-testid="accounts-table"]').should(
      "contain",
      "Updated Account",
    );
    cy.get('[data-testid="accounts-table"]').should("contain", "Credit");
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account updated successfully",
    );
  });

  it("should delete an account", () => {
    // First create an account
    cy.get('[data-testid="account-name-input"]').type("Test Account");
    cy.get('[data-testid="add-account-button"]').click();
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account created",
    );

    cy.get('[data-testid="delete-button"]').first().click();
    cy.get('[data-testid="confirm-delete-button"]').click();
    cy.get('[data-testid="no-accounts-found"]').should("be.visible");
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account deleted",
    );
  });

  it("should filter accounts by search", () => {
    // Create multiple accounts
    cy.get('[data-testid="account-name-input"]').type("Test Account 1");
    cy.get('[data-testid="add-account-button"]').click();
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account created",
    );

    cy.get('[data-testid="account-name-input"]').type("Test Account 2");
    cy.get('[aria-label="Account Type"]').click();
    cy.get('[data-key="credit"]').click();
    cy.get('[data-testid="add-account-button"]').click();
    cy.get('[data-placement="bottom-right"]').should(
      "contain",
      "Account created",
    );

    // Search for specific account
    cy.get('[data-testid="search-input"]').type("Test Account 1");
    cy.get('[data-testid="accounts-table"]').should(
      "contain",
      "Test Account 1",
    );
    cy.get('[data-testid="accounts-table"]').should(
      "not.contain",
      "Test Account 2",
    );
  });
});
