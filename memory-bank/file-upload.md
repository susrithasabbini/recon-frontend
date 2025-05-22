# File Upload Page (`src/pages/file-upload.tsx`)

## Overview

The File Upload page enables users to upload CSV transaction files to a specific, selected financial account. These uploaded entries are initially treated as "staging entries" and are processed by the backend. The page displays both these staging entries and the resulting "processed entries" (actual account entries), providing real-time updates through polling.

## Key Features

-   **Merchant & Account Context:**
    -   Requires a merchant to be selected (via `useDefaultContext`).
    -   Users must select a specific account from a dropdown populated by `getAccounts` from the context.
-   **File Upload:**
    -   Uses a dedicated `FileUploadForm` component.
    -   Allows uploading a single CSV file.
    -   Validates file type (must be `.csv`).
    -   Users select a `processingMode` (e.g., "CONFIRMATION").
    -   Uploads the file to `/accounts/{selectedAccount}/staging-entries/files` API endpoint.
    -   Displays upload status (success, failure, number of ingested/failed entries, specific errors).
-   **Staging Entries Table:**
    -   Displays entries ingested from the uploaded file.
    -   Data is fetched by polling `/accounts/{selectedAccount}/staging-entries` every second.
    -   Columns: Order ID (from metadata), Entry Type, Amount, Currency, Status, Effective Date, Created At.
    -   Filterable by `status` (All, Needs Manual Review, Processed, Pending).
    -   Sortable by `effective_date` and `created_at`.
    -   Paginated using `@heroui/pagination`.
-   **Processed Entries (Account Entries) Table:**
    -   Displays actual entries recorded against the account.
    -   Data is fetched by polling `/accounts/{selectedAccount}/entries` every second.
    -   Columns: Order ID (from metadata), Entry Type, Amount, Currency, Entry Status, Recon Status, Effective Date, Created At.
    -   Filterable by:
        -   `entry.status` (All, Expected, Posted, Archived).
        -   `entry.transaction.status` (Recon Status: All, Expected, Posted, Mismatch, Archived).
        -   Switch to `excludeArchivedTransactions` (defaults to true, hides entries where `transaction.status` is "ARCHIVED" unless the Recon Status filter is explicitly "ARCHIVED").
    -   Sortable by `effective_date`, `created_at`, and `amount`.
    -   Paginated using `@heroui/pagination`.
-   **State Management:**
    -   Extensive use of `useState` for managing selected account, file, processing mode, table data, filters, pagination, sort descriptors, loading states, and upload status.
    -   `useEffect` hooks for:
        -   Resetting page state when `selectedMerchant` changes.
        -   Fetching accounts when `selectedMerchant` changes.
        -   Polling staging entries when `selectedAccount` changes.
        -   Polling account entries when `selectedAccount` changes.
        -   Resetting table page numbers when filters change.
-   **UI/UX:**
    -   Hero section with title and description.
    -   Two-column layout: Upload form on the left, tables on the right.
    -   Loading skeletons and empty states for tables (dependent on merchant/account selection and data availability).
    -   Toast notifications for feedback (e.g., file upload success/failure, errors).
    -   Animations using Framer Motion (`fadeInUp`, `scaleIn`).

## Context Integration

-   `useDefaultContext`:
    -   `selectedMerchant`: To scope account selection and operations.
    -   `getAccounts`: To populate the account selection dropdown.
-   `api` (Axios instance from `@/config/axios`): Used for direct API calls for file upload and polling entries.

## Key Behaviors & Data Flow

1.  User selects a merchant (global context).
2.  Page fetches accounts for the selected merchant.
3.  User selects an account from the dropdown.
4.  Once an account is selected:
    -   Polling starts for staging entries and account entries for that account.
    -   File upload form becomes fully active.
5.  User selects a CSV file and a processing mode.
6.  User clicks "Upload".
    -   File is sent to the backend API.
    -   Upload status is displayed.
    -   Staging entries table updates via polling, reflecting newly ingested data.
    -   Processed entries table updates via polling, reflecting entries created from staging data.
7.  Users can filter and sort both tables to analyze data. Pagination resets appropriately when filters change.

## Noted Patterns

-   **Real-time Updates via Polling:** Both data tables are updated by repeatedly fetching data every second.
-   **Conditional UI:** Many UI elements (tables, filters, forms) are enabled/disabled or show different content based on whether a merchant and an account are selected.
-   **Complex Filtering Logic:** The "Processed Entries" table has interconnected filters.
-   **Componentization:** `FileUploadForm` encapsulates part of the UI and logic.

## Dependencies

-   `@heroui/*` (Select, Switch, Card, Table, Pagination, Toast)
-   `@heroicons/react`
-   `framer-motion`
-   `clsx`
-   `axios` (via `@/config/axios`)
-   `@/components/FileUploadForm`
-   `@/contexts/default-context`
-   `@/components/primitives`

## Future Considerations (from previous doc, may still apply)

-   Drag-and-drop file upload.
-   Option to clear/reset uploaded files or staging entries directly from UI.
