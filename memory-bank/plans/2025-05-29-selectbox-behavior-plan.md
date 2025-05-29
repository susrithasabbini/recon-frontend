# Plan: Modify Selectbox Behavior Globally (Revised)

## Date: 2025-05-29

## Goal

Modify all instances of `@heroui/select` (and components using it, like `MerchantSelect`) across the application to:

1. Ensure the `disallowEmptySelection` prop is active on all select components.
2. Disable the currently selected item within the dropdown list to prevent re-selection. This inherently prevents the selected item from being "removed" by clicking it again.

## Steps

| Done | #   | Action                                                      | Detail                                                                                                                             | Success Criterion                                  |
| ---- | --- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [x]  | 1   | Create initial plan file                                    | `memory-bank/plans/2025-05-29-selectbox-behavior-plan.md`                                                                          | File created.                                      |
| [ ]  | 2   | Update plan file with revised goal                          | Reflect user's clarification about `disallowEmptySelection` and no explicit deselection.                                           | Plan file updated.                                 |
| [ ]  | 3   | Search for `@heroui/select` usages (already done)           | Use `search_files` tool in `src/` for `@heroui/select` and `MerchantSelect`.                                                       | List of files using the select component obtained. |
| [ ]  | 4   | Analyze `MerchantSelect` component (already done)           | Read `src/components/merchant-select.tsx`.                                                                                         | Understanding of `MerchantSelect` structure.       |
| [ ]  | 5   | Modify `MerchantSelect` for revised behavior                | Ensure `disallowEmptySelection` is present. Disable already selected option using its `key`.                                       | `MerchantSelect` behaves as per new requirements.  |
| [ ]  | 6   | Identify and modify other direct `@heroui/select` usages    | For each identified file: Read, analyze, and apply similar modifications (ensure `disallowEmptySelection`, disable selected item). | All direct usages updated.                         |
| [ ]  | 7   | Test changes (manual for now, suggest E2E later if complex) | Manually verify behavior on key pages like Merchant Selection, Account Creation, Rules Mapping, File Upload.                       | Selectboxes function correctly.                    |
| [ ]  | 8   | Update `activeContext.md`                                   | Document the changes made.                                                                                                         | `activeContext.md` updated.                        |
| [ ]  | 9   | Update `progress.md`                                        | Add entry for this task.                                                                                                           | `progress.md` updated.                             |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/plans/2025-05-29-selectbox-behavior-plan.md",
        "content": "..."
      },
      "success": "File created.",
      "status": "success"
    },
    {
      "id": 2,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/plans/2025-05-29-selectbox-behavior-plan.md",
        "content": "# Plan: Modify Selectbox Behavior Globally (Revised)\n\n## Date: 2025-05-29\n\n## Goal\nModify all instances of `@heroui/select` (and components using it, like `MerchantSelect`) across the application to:\n1. Ensure the `disallowEmptySelection` prop is active on all select components.\n2. Disable the currently selected item within the dropdown list to prevent re-selection. This inherently prevents the selected item from being \"removed\" by clicking it again.\n\n## Steps\n\n| Done | # | Action                                                                 | Detail                                                                                                                                                                                             | Success Criterion                                     |\n|------|---|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|\n| [x]  | 1 | Create initial plan file                                               | `memory-bank/plans/2025-05-29-selectbox-behavior-plan.md`                                                                                                                                          | File created.                                         |\n| [x]  | 2 | Update plan file with revised goal                                     | Reflect user's clarification about `disallowEmptySelection` and no explicit deselection.                                                                                                           | Plan file updated.                                    |\n| [ ]  | 3 | Search for `@heroui/select` usages (already done)                      | Use `search_files` tool in `src/` for `@heroui/select` and `MerchantSelect`.                                                                                                                       | List of files using the select component obtained.    |\n| [ ]  | 4 | Analyze `MerchantSelect` component (already done)                      | Read `src/components/merchant-select.tsx`.                                                                                                                                                         | Understanding of `MerchantSelect` structure.        |\n| [ ]  | 5 | Modify `MerchantSelect` for revised behavior                           | Ensure `disallowEmptySelection` is present. Disable already selected option using its `key`.                                                                                                       | `MerchantSelect` behaves as per new requirements.     |\n| [ ]  | 6 | Identify and modify other direct `@heroui/select` usages               | For each identified file: Read, analyze, and apply similar modifications (ensure `disallowEmptySelection`, disable selected item).                                                                 | All direct usages updated.                            |\n| [ ]  | 7 | Test changes (manual for now, suggest E2E later if complex)            | Manually verify behavior on key pages like Merchant Selection, Account Creation, Rules Mapping, File Upload.                                                                                       | Selectboxes function correctly.                       |\n| [ ]  | 8 | Update `activeContext.md`                                              | Document the changes made.                                                                                                                                                                         | `activeContext.md` updated.                           |\n| [ ]  | 9 | Update `progress.md`                                                   | Add entry for this task.                                                                                                                                                                           | `progress.md` updated.                                |\n"
      },
      "success": "Plan file updated.",
      "status": "success"
    },
    {
      "id": 3,
      "tool": "search_files",
      "args": {
        "path": "src",
        "regex": "(@heroui/select|MerchantSelect)",
        "file_pattern": "*.tsx"
      },
      "success": "List of files using the select component obtained.",
      "status": "skipped"
    },
    {
      "id": 4,
      "tool": "read_file",
      "args": {
        "path": "src/components/merchant-select.tsx"
      },
      "success": "Understanding of `MerchantSelect` structure.",
      "status": "skipped"
    },
    {
      "id": 5,
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/merchant-select.tsx",
        "diff": "..."
      },
      "success": "`MerchantSelect` behaves as per new requirements.",
      "status": "pending"
    }
  ]
}
-->
