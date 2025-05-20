// cypress/support/commands.ts
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
}
