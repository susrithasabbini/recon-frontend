# File Upload Page (`src/pages/file-upload.tsx`)

## Overview

The File Upload page enables users to upload CSV transaction files to a specific, selected financial account. These uploaded entries are initially treated as "staging entries" and are processed by the backend. The page displays both these staging entries and the resulting "processed entries" (actual account entries) within a tabbed interface. Polling for updates for each table is active only when its respective tab is visible.

## Key Features

- **Merchant & Account Context:**
  - Requires a merchant to be selected (via `useDefaultContext`).
  - Users must select a specific account from a dropdown.
- **Account Selection & Upload Trigger Section:**
  - This section is now presented in a styled `motion.div` (card-like with border and shadow) that is responsive.
  - On medium screens and up, the "Select Account" dropdown and the "Upload File & Set Mode" button are displayed side-by-side. On smaller screens, they stack vertically.
  - The Select component has a constrained width (`md:max-w-xs`) on larger screens.
  - The Upload button is full-width on small screens and auto-width on larger screens.
- **File Upload (Modal-based):**
  - The "Upload File & Set Mode" button triggers a modal.
  - The `FileUploadForm` component is housed within this modal.
  - Uploads the file to `/accounts/{selectedAccount}/staging-entries/files` API endpoint (syntax corrected).
  - Displays upload status.
- **Tabbed Display for Entries:**
  - A `Tabs` component from `@heroui/tabs` is used, taking full available width.
  - `activeTabKey` state manages the visible tab.
- **Staging Entries Table (within "Processing Entries" Tab):**
  - Displays entries ingested from the uploaded file.
  - Data is fetched by polling `/accounts/{selectedAccount}/staging-entries` every second, **only when this tab is active**.
  - Columns: Order ID, Entry Type, Amount, Currency, Status, Effective Date, Created At.
  - Filterable by `status`.
  - Sortable and paginated.
- **Processed Entries (Account Entries) Table (within "Processed Entries" Tab):**
  - Displays actual entries recorded against the account.
  - Data is fetched by polling `/accounts/{selectedAccount}/entries` every second, **only when this tab is active**.
  - Columns: Order ID, Entry Type, Amount, Currency, Entry Status, Recon Status, Effective Date, Created At.
  - Filterable by entry status, recon status, and an "Exclude Archived" switch.
  - Sortable and paginated.
- **State Management:**
  - `useState` for selections, data, filters, pagination, sort descriptors, loading, modal visibility, and `activeTabKey`.
  - `useEffect` hooks for:
    - Resetting page state on `selectedMerchant` change.
    - Fetching accounts on `selectedMerchant` change.
    - Polling staging entries: triggers on `selectedAccount`, `selectedMerchant`, and `activeTabKey` changes. Interval is set only if `activeTabKey === "processing"`.
    - Polling account entries: triggers on `selectedAccount`, `selectedMerchant`, and `activeTabKey` changes. Interval is set only if `activeTabKey === "processed"`.
    - Resetting table page numbers when filters change.
- **UI/UX:**
  - Centered hero section (title and description).
  - Main page container `max-w-6xl mx-auto`.
  - The redesigned Account Selection and Upload Trigger section provides a more integrated and responsive experience.
  - File upload form within a `Modal`.
  - Data tables within `Tab` panels, each with its header, filters, and `Card`.
  - Loading skeletons, empty states, toasts, and Framer Motion animations.

## Context Integration

- `useDefaultContext` for `selectedMerchant` and `getAccounts`.
- `api` (Axios instance) for API calls.

## Key Behaviors & Data Flow

1.  User selects merchant. Page fetches accounts.
2.  User selects an account from the dropdown in the dedicated Account Selection section.
3.  Once an account is selected:
    - The "Upload File & Set Mode" button (alongside or below the select dropdown, depending on screen size) becomes active.
    - Tabbed interface for entries is displayed below this section.
    - Polling for the currently active tab's data starts.
4.  User clicks "Upload File & Set Mode", opens modal.
5.  User uploads file via `FileUploadForm`.
6.  File sent to backend. Status displayed.
7.  Relevant table (based on active tab) updates via its conditional polling.
8.  Users switch tabs; polling for the newly active tab's data starts/resumes, and polling for the inactive tab's data stops.
9.  Filters and sorting are available within each tab.

## Noted Patterns

- **Conditional Real-time Updates via Polling.**
- **Corrected API Endpoint Syntax.**
- **Responsive Layout for Key Actions:** Account selection and upload trigger adapt to screen size.
- **Modal for Focused Action.**
- **Componentization.**
- **Tabbed Interface.**

## Dependencies

- `@heroui/*` (Select, Switch, Card, Table, Pagination, Toast, Modal, Button, Tabs)
- `@heroicons/react`
- `framer-motion`
- `clsx`
- `axios`
- `@/components/FileUploadForm`
- `@/contexts/default-context`
- `@/components/primitives`

## Future Considerations

- Drag-and-drop file upload.
- Clear/reset staging entries from UI.
