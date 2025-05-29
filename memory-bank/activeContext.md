# Active Context - 2025-05-29

## Current Focus
- Implemented the new "View Transactions" page (`src/pages/view-transactions-page.tsx`).
- Page includes accordion display for transactions, showing versions and entries.
- Integrated the new page into `src/routes.tsx` and `src/pages/main-process-flow-page.tsx` (as a new step in `RowSteps`).
- Defined necessary TypeScript types in `src/types/transaction.types.ts` and updated `src/types/index.ts`.

## Key Decisions & Changes
- **`src/types/transaction.types.ts`**: Created to define interfaces for `Transaction`, `TransactionVersion`, `TransactionEntry`, and `TransactionAccountInfo`.
- **`src/types/index.ts`**: Updated to export new transaction types.
- **`src/pages/view-transactions-page.tsx`**:
    - Created with data fetching logic for `/merchants/{merchant_id}/transactions`.
    - Uses `@heroui/accordion` for displaying transactions.
    - Each `AccordionItem` title shows: `logical_transaction_id` (shortened), amount, from/to account names, and status.
    - Expanded content shows versions, each with a table of entries (Entry ID, Amount, Account ID, Type, Status).
    - Handles loading, error, and no-merchant-selected states.
- **`src/routes.tsx`**: Added a new route `/transactions` for `ViewTransactionsPage`.
- **`src/pages/main-process-flow-page.tsx`**:
    - Added "View Transactions" to `pageSteps`.
    - Added `ViewTransactionsPage` to `stepContentComponents`.
- **HeroUI Accordion**: Confirmed it's available via `npx heroui-cli@latest add accordion` and imported from `@heroui/accordion`.
- **Card Components**: Imports for `Card`, `CardBody` corrected to `@heroui/card`. `CardHeader` and `CardTitle` simulated with basic HTML/Tailwind as direct HeroUI exports were not found in `primitives` or common `react` package.

## Next Steps
- Update `memory-bank/progress.md`.
- Create `memory-bank/view-transactions.md` for detailed page documentation.
- Test the new "View Transactions" page functionality and appearance.
