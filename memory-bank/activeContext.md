# Active Context - 2025-05-22

## Current Focus
- Completed task: "Refactor TypeScript types to follow clean coding patterns."

## Key Decisions & Changes

### TypeScript Types Refactoring:
- **Objective**: Improve organization and maintainability of TypeScript types.
- **Strategy**:
    - Identified all inline types in `src/pages` and `src/components`.
    - Created domain-specific type files under `src/types/`:
        - `common.types.ts` (for UI/utility types like `IconSvgProps`, `ThemeSwitchProps`, `NavigationButtonsProps`, `RowStepProps`, `RowStepsProps`)
        - `merchant.types.ts` (for `Merchant`, `MerchantSelectProps`)
        - `account.types.ts` (for `Account`, `AccountDetails`)
        - `rule.types.ts` (for `ReconRule`)
        - `file.types.ts` (for `StagingEntry`, `AccountEntry`, `UploadResponse`, `FileUploadFormProps`)
    - Updated `src/types/index.ts` to be a barrel file re-exporting from the new type files.
    - Refactored all component and page files to remove inline type definitions and import them from `@/types`.
    - Corrected inconsistencies in `UploadResponse` type usage between `src/pages/file-upload.tsx` and `src/components/FileUploadForm.tsx`.
    - Ensured props in `common.types.ts` for `ThemeSwitchProps`, `NavigationButtonsProps`, and `RowStepsProps` accurately matched their usage in respective components.
- **Files Created/Modified**:
    - `src/types/common.types.ts` (created)
    - `src/types/merchant.types.ts` (created)
    - `src/types/account.types.ts` (created)
    - `src/types/rule.types.ts` (created)
    - `src/types/file.types.ts` (created)
    - `src/types/index.ts` (updated)
    - `src/pages/merchant-creation.tsx` (refactored)
    - `src/pages/account-creation.tsx` (refactored)
    - `src/pages/rules-mapping.tsx` (refactored)
    - `src/pages/file-upload.tsx` (refactored, type usage corrected)
    - `src/components/theme-switch.tsx` (refactored)
    - `src/components/NavigationButtons.tsx` (refactored)
    - `src/components/RowSteps.tsx` (refactored)
    - `src/components/merchant-select.tsx` (refactored)
    - `src/components/FileUploadForm.tsx` (refactored, type usage corrected)
    - `memory-bank/systemPatterns.md` (updated with new type structure)

---
*Previous Context (Memory Bank Documentation Overhaul):*

### Memory Bank Documentation Overhaul:
A comprehensive review and update of the Memory Bank was performed based on the current state of `src/pages/`.

**1. Page-Specific Documentation (`memory-bank/[pageName].md`):**
    - **`account-creation.md`**: Reviewed and confirmed accuracy. Content re-saved.
    - **`file-upload.md`**: Significantly updated to reflect current complex functionality (account selection, file upload to staging, polling for staging and processed entries, advanced filtering). Previous content was outdated.
    - **`home.md`**: Created new document for this landing page, detailing its illustrative and navigational purpose.
    - **`index-page-component.md`**: Created new document for `src/pages/index.tsx`, identifying it as a component/section ("How It Works" stepper) rather than a standalone page.
    - **`MainProcessFlowPage.md`**: Created new document for this wizard-style page orchestrator.
    - **`merchant-creation.md`**: Created new document, detailing its CRUD functionality for merchants.
    - **`rules-mapping.md`**: Reviewed and confirmed accuracy. Content re-saved.

**2. Global Memory Bank Files:**
    - **`systemPatterns.md`**: Updated to include:
        - "Two-Column CRUD Pattern"
        - "Complex Filtering Logic"
        - "Wizard/Stepper Pattern"
        - "Page Composition"
        - Note on `src/pages/index.tsx`'s unconventional nature in Code Structure.
        - Expanded "Backend Interaction" with more API endpoint examples and the "Polling for Real-time Updates" pattern.
    - **`productContext.md`**: Updated "User Experience (UX) Expectations" section with concrete examples from the codebase that support existing expectations (e.g., polling for real-time insights, `MainProcessFlowPage` for guided actions, UI consistency).
    - **`techContext.md`**: Reviewed, no major changes deemed necessary from this pass. The note about `src/pages/index.tsx` in `systemPatterns.md` was considered sufficient for now.

## Next Steps
- Type refactoring task is complete.
- Awaiting new tasks.
