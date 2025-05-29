# Active Context - 2025-05-29

## Current Focus

- Implemented changes to prevent same account selection in `file-upload.tsx` and `file-upload-2.tsx` when used in `preview-page.tsx`.
- Adjusted table row count to 5 and set a minimum height for tables in both file upload components.

## Key Decisions & Changes

- **`src/pages/preview-page.tsx`**:
  - Modified to manage account state for both `FileUploadPage` and `FileUpload2Page`.
  - Fetches all accounts and passes filtered lists and selection handlers as props to child components.
  - Passes `isLoading` prop to child components.

- **`src/pages/file-upload.tsx` & `src/pages/file-upload-2.tsx`**:
  - Refactored to accept `accounts`, `selectedAccount`, `onAccountChange`, `componentId`, and `isLoading` props.
  - Removed internal account fetching logic.
  - `rowsPerPage` constant changed from `10` to `5`.
  - Added `min-h-[350px]` class to `Card` components wrapping the tables to ensure consistent minimum height.
  - Updated `data-testid` attributes for account select and tables to include `componentId`.
  - Retained local `loading` state for file upload operations, distinct from the `isLoading` prop.

- **Files Modified**:
  - `src/pages/preview-page.tsx`
  - `src/pages/file-upload.tsx`
  - `src/pages/file-upload-2.tsx`
  - `memory-bank/plans/2025-05-29-preview-page-sync-and-style-plan.md` (created)
  - `memory-bank/activeContext.md` (this update)

## Next Steps

- Update `memory-bank/progress.md`.
- Update `memory-bank/file-upload.md` to reflect these changes.
- Suggest testing the `PreviewPage` to ensure the account selection logic and table styling work as expected.
