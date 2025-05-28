# Plan: Refactor Account Display in account-creation.tsx to Table

## Objective

Replace the current card-based list of accounts in `src/pages/account-creation.tsx` with a table display using `@heroui/table` components, while maintaining the overall page layout and functionality (search, create, edit, delete modals).

## Steps

| Done | #   | Action                                                                  | Detail                                                                                                                                                                                                              |
| ---- | --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]  | 1   | **Setup**: Create this plan file.                                       | `memory-bank/plans/2025-05-28-account-table-refactor-plan.md`                                                                                                                                                       |
| [ ]  | 2   | **Modify `src/pages/account-creation.tsx`**: Import Table Components    | Add imports for `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableColumn` from `@heroui/table`.                                                                                                   |
| [ ]  | 3   | **Modify `src/pages/account-creation.tsx`**: Implement Table Structure  | Replace the `filteredAccounts.map(...)` card rendering logic with a `<Table>` component. Define headers: Account Name, Type, Currency, Balance, Actions. Map `filteredAccounts` to `<TableRow>` and `<TableCell>`s. |
| [ ]  | 4   | **Modify `src/pages/account-creation.tsx`**: Integrate Action Buttons   | Move existing Edit and Delete `Button` components (with `Tooltip`s) into the 'Actions' `TableCell` for each row.                                                                                                    |
| [ ]  | 5   | **Modify `src/pages/account-creation.tsx`**: Adapt Loading/Empty States | Ensure `isLoading`, no merchant selected, and no accounts messages are displayed appropriately within or around the table structure. Remove card-specific `fadeInUp` animation.                                     |
| [ ]  | 6   | **Testing**: Verify Functionality                                       | Manually test account listing, search, creation, editing, and deletion to ensure the table display works correctly and all modals function as before. Check responsiveness.                                         |
| [ ]  | 7   | **Update Memory Bank**: `activeContext.md`                              | Document the refactoring of `account-creation.tsx` as the current focus and detail the changes made.                                                                                                                |
| [ ]  | 8   | **Update Memory Bank**: `progress.md`                                   | Add an entry detailing the successful refactoring of the account display to a table.                                                                                                                                |
| [ ]  | 9   | **Update Memory Bank**: `systemPatterns.md` (if applicable)             | Review if this change significantly alters or reinforces documented system patterns for data display.                                                                                                               |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/plans/2025-05-28-account-table-refactor-plan.md",
        "content": "# Plan: Refactor Account Display in account-creation.tsx to Table\n\n## Objective\nReplace the current card-based list of accounts in `src/pages/account-creation.tsx` with a table display using `@heroui/table` components, while maintaining the overall page layout and functionality (search, create, edit, delete modals).\n\n## Steps\n\n| Done | # | Action                                                                 | Detail                                                                                                                                                                                                                                                           |\n|------|---|------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|\n| [X]  | 1 | **Setup**: Create this plan file.                                      | `memory-bank/plans/2025-05-28-account-table-refactor-plan.md`                                                                                                                                                                                                    |\n| [ ]  | 2 | **Modify `src/pages/account-creation.tsx`**: Import Table Components   | Add imports for `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableColumn` from `@heroui/table`.                                                                                                                                              |\n| [ ]  | 3 | **Modify `src/pages/account-creation.tsx`**: Implement Table Structure | Replace the `filteredAccounts.map(...)` card rendering logic with a `<Table>` component. Define headers: Account Name, Type, Currency, Balance, Actions. Map `filteredAccounts` to `<TableRow>` and `<TableCell>`s.                                              |\n| [ ]  | 4 | **Modify `src/pages/account-creation.tsx`**: Integrate Action Buttons  | Move existing Edit and Delete `Button` components (with `Tooltip`s) into the 'Actions' `TableCell` for each row.                                                                                                                                                 |\n| [ ]  | 5 | **Modify `src/pages/account-creation.tsx`**: Adapt Loading/Empty States| Ensure `isLoading`, no merchant selected, and no accounts messages are displayed appropriately within or around the table structure. Remove card-specific `fadeInUp` animation.                                                                                 |\n| [ ]  | 6 | **Testing**: Verify Functionality                                      | Manually test account listing, search, creation, editing, and deletion to ensure the table display works correctly and all modals function as before. Check responsiveness.                                                                                 |\n| [ ]  | 7 | **Update Memory Bank**: `activeContext.md`                             | Document the refactoring of `account-creation.tsx` as the current focus and detail the changes made.                                                                                                                                                             |\n| [ ]  | 8 | **Update Memory Bank**: `progress.md`                                  | Add an entry detailing the successful refactoring of the account display to a table.                                                                                                                                                                             |\n| [ ]  | 9 | **Update Memory Bank**: `systemPatterns.md` (if applicable)            | Review if this change significantly alters or reinforces documented system patterns for data display.                                                                                                                                                            |"
      },
      "success": "file_written",
      "status": "success"
    },
    {
      "id": 2,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/account-creation.tsx",
        "diff": "<<<<<<< SEARCH\nimport { Card, CardBody } from \"@heroui/card\";\n=======\nimport { Card, CardBody } from \"@heroui/card\";\nimport { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from \"@heroui/table\";\n>>>>>>> REPLACE"
      },
      "success": "imports_added",
      "status": "pending"
    },
    {
      "id": 3,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/account-creation.tsx",
        "diff": "..."
      },
      "success": "table_structure_implemented",
      "status": "pending"
    },
    {
      "id": 4,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/account-creation.tsx",
        "diff": "..."
      },
      "success": "action_buttons_integrated",
      "status": "pending"
    },
    {
      "id": 5,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/account-creation.tsx",
        "diff": "..."
      },
      "success": "loading_empty_states_adapted",
      "status": "pending"
    },
    {
      "id": 6,
      "tool": "ask_followup_question",
      "args": {
        "question": "Manual testing of account listing, search, creation, editing, deletion, and responsiveness is complete. Does everything work as expected?"
      },
      "success": "user_confirms_testing",
      "status": "pending"
    },
    {
      "id": 7,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "..."
      },
      "success": "active_context_updated",
      "status": "pending"
    },
    {
      "id": 8,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/progress.md",
        "content": "..."
      },
      "success": "progress_md_updated",
      "status": "pending"
    },
    {
      "id": 9,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/systemPatterns.md",
        "content": "..."
      },
      "success": "system_patterns_updated",
      "status": "pending"
    }
  ]
}
-->
