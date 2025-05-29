# Plan: File Upload Page Refactor and Shared State

## Date: 2025-05-29

## Goals
1.  Remove the "Processing Entries" tab and related logic from `src/pages/file-upload.tsx` and `src/pages/file-upload-2.tsx`.
2.  Implement shared state management via `src/contexts/default-context.tsx` to prevent selecting the same account in both file upload components.

## Steps

| Done | # | Component / File                 | Action                                                                 | Detail / Success Criteria                                                                                                |
|------|---|----------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| [ ]  | 1 | `src/pages/file-upload.tsx`      | Remove "Processing Entries" tab & logic                                | Only "Processed Entries" table and filters are visible. No `activeTabKey` state. Staging-related code removed.           |
| [ ]  | 2 | `src/pages/file-upload-2.tsx`    | Remove "Processing Entries" tab & logic                                | Only "Processed Entries" table and filters are visible. No `activeTabKey` state. Staging-related code removed.           |
| [ ]  | 3 | `src/contexts/default-context.tsx` | Request file content                                                   | Content of `src/contexts/default-context.tsx` obtained.                                                                  |
| [ ]  | 4 | `src/contexts/default-context.tsx` | Add shared state for selected accounts                                 | Context includes `selectedAccount1`, `setSelectedAccount1`, `selectedAccount2`, `setSelectedAccount2`.                   |
| [ ]  | 5 | `src/pages/file-upload.tsx`      | Integrate shared account state & filter dropdown                       | Uses context state for `selectedAccount1`. Filters out `selectedAccount2` from dropdown.                                 |
| [ ]  | 6 | `src/pages/file-upload-2.tsx`    | Integrate shared account state & filter dropdown                       | Uses context state for `selectedAccount2`. Filters out `selectedAccount1` from dropdown.                                 |
| [ ]  | 7 | Memory Bank                      | Update `activeContext.md` and `progress.md`                            | Files updated with summary of changes and next steps.                                                                    |

<!--
{
  "plan": [
    {
      "id": 1,
      "description": "Refactor file-upload.tsx to remove processing tab",
      "tool": "replace_in_file",
      "args": {"path": "src/pages/file-upload.tsx", "diff": "TBD"},
      "success": "Processing tab and related logic removed. File compiles.",
      "status": "pending"
    },
    {
      "id": 2,
      "description": "Refactor file-upload-2.tsx to remove processing tab",
      "tool": "replace_in_file",
      "args": {"path": "src/pages/file-upload-2.tsx", "diff": "TBD"},
      "success": "Processing tab and related logic removed. File compiles.",
      "status": "pending"
    },
    {
      "id": 3,
      "description": "Request content of default-context.tsx",
      "tool": "read_file",
      "args": {"path": "src/contexts/default-context.tsx"},
      "success": "File content read successfully or user provides content.",
      "status": "pending"
    },
    {
      "id": 4,
      "description": "Modify default-context.tsx for shared state",
      "tool": "replace_in_file",
      "args": {"path": "src/contexts/default-context.tsx", "diff": "TBD"},
      "success": "Context updated with new shared state variables and setters. File compiles.",
      "status": "pending"
    },
    {
      "id": 5,
      "description": "Update file-upload.tsx to use shared state",
      "tool": "replace_in_file",
      "args": {"path": "src/pages/file-upload.tsx", "diff": "TBD"},
      "success": "Component uses context state and filters account dropdown. File compiles.",
      "status": "pending"
    },
    {
      "id": 6,
      "description": "Update file-upload-2.tsx to use shared state",
      "tool": "replace_in_file",
      "args": {"path": "src/pages/file-upload-2.tsx", "diff": "TBD"},
      "success": "Component uses context state and filters account dropdown. File compiles.",
      "status": "pending"
    },
    {
      "id": 7,
      "description": "Update Memory Bank activeContext.md and progress.md",
      "tool": "write_to_file",
      "args": {"path": "memory-bank/activeContext.md", "content": "TBD"},
      "success": "activeContext.md updated.",
      "status": "pending"
    }
  ]
}
-->
