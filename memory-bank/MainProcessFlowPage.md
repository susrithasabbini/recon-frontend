# Main Process Flow Page (`src/pages/MainProcessFlowPage.tsx`)

## Overview

The `MainProcessFlowPage` provides a guided, multi-step workflow for users to complete the core reconciliation setup process. It orchestrates several other page components, presenting them in a sequential manner.

## Key Features

- **Guided Workflow:** Presents a clear, step-by-step process to the user.
- **Step Indicator:** Utilizes the `RowSteps` component to visually display the current step and allow users to navigate to other steps (if permitted by `RowSteps` logic).
- **Sequential Page Display:** Renders different page components based on the current step. The defined steps and their corresponding components are:
  1.  **Merchant Creation:** Renders `MerchantManagementPage` (from `./merchant-creation`).
  2.  **Account Creation:** Renders `AccountCreationPage` (from `./account-creation`).
  3.  **Rules Mapping:** Renders `RulesMappingPage` (from `./rules-mapping`).
  4.  **File Upload:** Renders `FileUploadPage` (from `./file-upload`).
- **Navigation Controls:** Employs a `NavigationButtons` component (likely providing "Previous" and "Next" functionality) to move between steps.
- **State Management:** Uses a `currentStep` state variable (integer) to track the active step in the flow.

## Implementation Details

- **Layout:** Uses `DefaultLayout` for overall page structure.
- **Component Orchestration:**
  - An array `pageSteps` defines the titles for each step.
  - An array `stepContentComponents` maps each step index to the React component to be rendered.
  - The component corresponding to `currentStep` is dynamically rendered.
- **State:**
  - `currentStep`: A `useState` hook manages the index of the current active step. `setCurrentStep` is passed to both `RowSteps` and `NavigationButtons` to handle step changes.

## Dependencies

- `@/components/RowSteps`: For displaying the step progression.
  - Receives `steps` (titles), `currentStep` (active index), and `onStepChange` (callback).
- `./account-creation` (AccountCreationPage)
- `./file-upload` (FileUploadPage)
- `./rules-mapping` (RulesMappingPage)
- `@/layouts/default` (DefaultLayout)
- `./merchant-creation` (MerchantManagementPage)
- `@/components/NavigationButtons`: For "Previous"/"Next" step navigation.
  - Receives `currentStep`, `setCurrentStep`, and `totalPages`.

## Purpose in User Flow

- Acts as the main guided path for users, especially new users, to set up their reconciliation environment.
- Accessed typically after the initial landing page (e.g., from the "Get Started" button on `home.tsx` which links to `/process-flow`).
- Ensures users follow a logical sequence of operations: merchant setup -> account setup -> rule definition -> data upload.

## Noted Patterns

- **Wizard/Stepper Pattern:** A common UI pattern for guiding users through complex or sequential tasks.
- **Page Composition:** This "page" is primarily composed of other components that are themselves full "pages" in terms of functionality. This highlights a modular approach where individual management pages can also be accessed directly (presumably via routing) or as part of this guided flow.
