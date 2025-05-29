# Plan: Implement Transactions Accordion View

**Date:** 2025-05-29

## 1. Goal

Create a new page to display merchant transactions with an accordion-style interface. Each transaction, when expanded, will show its different versions, and each version will display its associated entries in a table. This page will be integrated as a new step in the main process flow.

## 2. Current State

- API endpoint for transactions is available: `http://localhost:3000/api/merchants/{merchant_id}/transactions`.
- Project uses React, TypeScript, Tailwind CSS, and HeroUI components.
- Memory Bank is loaded and provides project context.

## 3. Proposed Steps

| Done | #   | Action                                                    | Detail                                                                                                                                                                                                   |
| ---- | --- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [x]  | 1   | Clarifying Questions Answered                             | Data mapping: `logical_transaction_id` for Txn ID, `from_accounts[0].account_name` / `to_accounts[0].account_name` for Acc A/B. Entries table: `account_id`, entry `status`. Accordion: `@heroui/react`. |
| [ ]  | 2   | Install/Verify HeroUI Accordion                           | Run `npx heroui-cli@latest add accordion` if not already available. Verify import from `@heroui/react`.                                                                                                  |
| [ ]  | 3   | Define Transaction Types                                  | Create/update `src/types/transaction.types.ts` with interfaces for `Transaction`, `TransactionVersion`, `TransactionEntry`, `AccountInfo` based on API response and clarifications.                      |
| [ ]  | 4   | Create `ViewTransactionsPage` Component Shell             | Create `src/pages/view-transactions-page.tsx` with basic structure, title, and import for HeroUI Accordion.                                                                                              |
| [ ]  | 5   | Implement Data Fetching in `ViewTransactionsPage`         | Fetch data from `/api/merchants/{merchant_id}/transactions` using `axios`, handle loading/error states. Get `merchant_id` from `DefaultContext`.                                                         |
| [ ]  | 6   | Implement Main Transaction Row (Accordion Header) Display | Map fetched transactions to `AccordionItem`s. Header: `logical_transaction_id`, Amount, `from_accounts[0].account_name`, `to_accounts[0].account_name`, top-level `status`.                              |
| [ ]  | 7   | Implement Accordion Content (Versions & Entries Table)    | For each expanded `AccordionItem`, display its versions. For each version, display its entries in a `@heroui/table`. Columns: Entry ID, Amount, Account ID, Type, Entry Status.                          |
| [ ]  | 8   | Add Route for `ViewTransactionsPage`                      | Update `src/routes.tsx` to include the new page (e.g., path `/transactions`).                                                                                                                            |
| [ ]  | 9   | Update `row-steps.tsx`                                    | Add "View Transactions" as a new step, linking to the new page. Ensure styling consistency with other steps.                                                                                             |
| [ ]  | 10  | Style Page and Components                                 | Apply Tailwind CSS to match the provided image and application theme. Ensure responsiveness and consistent styling for the accordion and tables.                                                         |
| [ ]  | 11  | Update Memory Bank                                        | Update `activeContext.md`, `progress.md`, and create/update page-specific docs (e.g., `memory-bank/view-transactions.md`).                                                                               |

## 4. API Data Structure (for reference from user prompt)

```json
[
  {
    "logical_transaction_id": "string", // e.g., "0790126d-..._ORD210"
    "current_version": 0,
    "amount": "string", // "95"
    "currency": "string", // "USD"
    "from_accounts": [
      {
        "account_id": "string",
        "account_name": "string",
        "entry_type": "CREDIT"
      }
    ],
    "to_accounts": [
      {
        "account_id": "string",
        "account_name": "string",
        "entry_type": "DEBIT"
      }
    ],
    "status": "POSTED", // "POSTED", "MISMATCH", "EXPECTED"
    "versions": [
      {
        "transaction_id": "string",
        "version": 0,
        "amount": "string",
        "currency": "string",
        "status": "POSTED", // "POSTED", "ARCHIVED"
        "metadata": { "order_id": "string" /* e.g., ORD210 */ },
        "entries": [
          {
            "entry_id": "string",
            "account_id": "string",
            "entry_type": "CREDIT", // "CREDIT", "DEBIT"
            "amount": "string",
            "currency": "string",
            "status": "POSTED", // "POSTED", "ARCHIVED", "EXPECTED"
            "effective_date": "string"
          }
        ]
      }
    ]
  }
]
```

## 5. UI Mockup (Key elements from image)

- Main Table Columns: Txn id, Amount, Acc a, Acc b, Txn status
- Expanded View:
  - Version X
    - Entries Table Columns: e-id, amt, account, type, status (originally "curr" in sketch but values suggest status)

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "ask_followup_question",
      "args": {
        "question": "I have some questions to ensure the new Transactions View page matches your expectations based on the API data and the provided image: ... (see questions below)",
        "options": []
      },
      "success": "user_provides_clarifications",
      "status": "pending"
    },
    {
      "id": 2,
      "tool": "write_to_file",
      "args": {
        "path": "src/types/transaction.types.ts",
        "content": "// Define interfaces for Transaction, TransactionVersion, TransactionEntry etc. based on API and clarifications"
      },
      "success": "file_created_or_updated",
      "status": "pending"
    },
    {
      "id": 3,
      "tool": "write_to_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "content": "// Basic component shell for ViewTransactionsPage"
      },
      "success": "file_created",
      "status": "pending"
    },
    {
      "id": 4,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "diff": "// Add data fetching logic"
      },
      "success": "data_fetching_implemented",
      "status": "pending"
    },
    {
      "id": 5,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "diff": "// Add main transaction row display logic (accordion header)"
      },
      "success": "accordion_header_implemented",
      "status": "pending"
    },
    {
      "id": 6,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "diff": "// Add accordion expansion logic"
      },
      "success": "accordion_logic_implemented",
      "status": "pending"
    },
    {
      "id": 7,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "diff": "// Add accordion content display logic (versions and entries table)"
      },
      "success": "accordion_content_implemented",
      "status": "pending"
    },
    {
      "id": 8,
      "tool": "replace_in_file",
      "args": {
        "path": "src/routes.tsx",
        "diff": "// Add route for ViewTransactionsPage"
      },
      "success": "route_added",
      "status": "pending"
    },
    {
      "id": 9,
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/row-steps.tsx",
        "diff": "// Add new step for View Transactions"
      },
      "success": "row_step_updated",
      "status": "pending"
    },
    {
      "id": 10,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/view-transactions-page.tsx",
        "diff": "// Add Tailwind CSS styling"
      },
      "success": "styling_applied",
      "status": "pending"
    },
    {
      "id": 11,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "# Active Context - 2025-05-29\\n\\n## Current Focus\\n- Implementing the new 'View Transactions' page with accordion display."
      },
      "success": "active_context_updated",
      "status": "pending"
    }
  ]
}
-->
