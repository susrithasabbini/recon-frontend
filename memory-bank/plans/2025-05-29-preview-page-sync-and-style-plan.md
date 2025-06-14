# Plan: Preview Page Account Sync & Table Styling (2025-05-29)

## Goal

1.  Prevent selection of the same account in `file-upload.tsx` and `file-upload-2.tsx` when used in `preview-page.tsx`.
2.  Set table rows to 5 in both file upload components.
3.  Ensure tables have a minimum height.

## Affected Files

- `src/pages/preview-page.tsx`
- `src/pages/file-upload.tsx`
- `src/pages/file-upload-2.tsx`

## Detailed Steps

### Part 1: `src/pages/preview-page.tsx` Modifications

| Done | #   | Action                                                                                   | Detail                                                                                                                                                                                                                                                |
| ---- | --- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]  | 1   | Import necessary React hooks, context, and types.                                        | `import { useState, useEffect } from "react";`, `import { useDefaultContext } from "@/contexts/default-context";`, `import type { Account } from "@/types";`                                                                                          |
| [ ]  | 2   | Initialize state for all accounts and selected accounts.                                 | `const [allAccounts, setAllAccounts] = useState<Account[]>([]);`, `const [selectedAccount1, setSelectedAccount1] = useState<string>("");`, `const [selectedAccount2, setSelectedAccount2] = useState<string>("");`                                    |
| [ ]  | 3   | Use `useDefaultContext` to get `selectedMerchant` and `getAccounts`.                     | `const { selectedMerchant, getAccounts } = useDefaultContext();`                                                                                                                                                                                      |
| [ ]  | 4   | Add `useEffect` to fetch `allAccounts` when `selectedMerchant` or `getAccounts` changes. | Similar to the existing `useEffect` in `file-upload.tsx` for fetching accounts. Set loading state appropriately if needed.                                                                                                                            |
| [ ]  | 5   | Pass props to `FileUploadPage` component.                                                | `<FileUploadPage accounts={allAccounts.filter(acc => acc.account_id !== selectedAccount2)} selectedAccount={selectedAccount1} onAccountChange={setSelectedAccount1} componentId="fileUpload1" />` (add `componentId` for clarity if needed elsewhere) |
| [ ]  | 6   | Pass props to `FileUpload2Page` component.                                               | `<FileUpload2Page accounts={allAccounts.filter(acc => acc.account_id !== selectedAccount1)} selectedAccount={selectedAccount2} onAccountChange={setSelectedAccount2} componentId="fileUpload2" />`                                                    |

<!--
{ "plan":[
  {"id":1,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"imports_added"},
  {"id":2,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"state_initialized"},
  {"id":3,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"context_used"},
  {"id":4,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"useeffect_added"},
  {"id":5,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"fileuploadpage_props_passed"},
  {"id":6,"tool":"replace_in_file","args":{"path":"src/pages/preview-page.tsx","diff":""},"status":"pending","success":"fileupload2page_props_passed"}
]}
-->

### Part 2: `src/pages/file-upload.tsx` Modifications

| Done | # | Action | Detail MP LDRP_R_LINTING_ERROR
Okay, I've created the plan document outlining the changes required for `src/pages/preview-page.tsx`, `src/pages/file-Gupload.tsx`, and `src/pages/file-upload-2.tsx`.

Here's a summary of the plan:

**Plan Summary:**

**1. `src/pages/preview-page.tsx`:**
_ This component will manage the state for account selection for both file upload components.
_ It will fetch all accounts and pass down filtered lists to each file upload component, ensuring that an account selected in one component cannot be selected in the other. \* It will also pass down the selected account state and update functions to each respective component.

**2. `src/pages/file-upload.tsx` and `src/pages/file-upload-2.tsx`:**
_ These components will be updated to accept props for account selection from `preview-page.tsx`.
_ The `rowsPerPage` constant will be changed from 10 to 5. \* A minimum height will be applied to the `Card` component wrapping the tables to ensure consistent table display.

Would you like me to proceed with implementing these changes? If you'd like to review the detailed plan, you can find it at `memory-bank/plans/2025-05-29-preview-page-sync-and-style-plan.md`.

Once you approve, I will proceed with the implementation. Please let me know if you'd like to proceed or if you have any questions or modifications to the plan. If you're ready for me to start making these changes, please ask me to "toggle to Act mode".
