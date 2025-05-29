# Active Context - 2025-05-29

## Current Focus

- Modified selectbox behavior globally.

## Key Decisions & Changes

- **Global Selectbox Behavior**:
  - Ensured `disallowEmptySelection` prop is active on all `@heroui/select` components.
  - Disabled the currently selected item within dropdown lists using the `isDisabled` prop on `SelectItem` to prevent re-selection.
- **Files Modified**:
  - `src/components/merchant-select.tsx`
  - `src/pages/upload-page.tsx`
  - `src/pages/account-creation.tsx`
  - `src/pages/rules-mapping.tsx`
  - `src/components/color-theme-selector.tsx`
  - `src/components/file-upload-form.tsx`
  - `src/pages/bank-preview.tsx`
  - `src/pages/psp-preview.tsx`
- **Previous Focus (View Transactions Page)**:
  - Implemented the new "View Transactions" page (`src/pages/view-transactions-page.tsx`).
  - Page includes accordion display for transactions, showing versions and entries.
  - Integrated the new page into `src/routes.tsx` and `src/pages/main-process-flow-page.tsx` (as a new step in `RowSteps`).
  - Defined necessary TypeScript types in `src/types/transaction.types.ts` and updated `src/types/index.ts`.

## Next Steps

- Update `memory-bank/progress.md`.
- Test the selectbox changes across the application.
