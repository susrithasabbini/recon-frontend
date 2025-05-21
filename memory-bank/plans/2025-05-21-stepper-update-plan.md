# Plan: Update Stepper Navigation Arrows

**Date:** 2025-05-21

**Objective:** Modify the stepper component (likely `RowSteps.tsx`) to replace external "previous" and "next" buttons with arrow icons placed directly to the left and right of the stepper.

## Steps

| Done | #   | Action                                                       | Detail                                                                                                                            |
| ---- | --- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| [x]  | 1   | Read `MainProcessFlowPage.tsx`                               | Examine `src/pages/MainProcessFlowPage.tsx` to understand current usage of `RowSteps` and identify existing navigation buttons.   |
| [x]  | 2   | Add Arrow Icons and Logic to `RowSteps.tsx`                  | Import `ChevronLeftIcon` and `ChevronRightIcon`. Add them as clickable buttons within `RowSteps.tsx` to control `currentStep`.    |
| [x]  | 3   | Implement Button Disabling in `RowSteps.tsx`                 | Ensure the new arrow buttons are disabled when `currentStep` is at the first or last step.                                        |
| [x]  | 4   | Remove Old Navigation Buttons from `MainProcessFlowPage.tsx` | Delete the existing "previous" and "next" buttons from `src/pages/MainProcessFlowPage.tsx`.                                       |
| [x]  | 5   | Adjust Styling in `RowSteps.tsx` for Centering and Spacing   | Modify Tailwind CSS classes in `src/components/RowSteps.tsx` to ensure even spacing and horizontal centering of arrows and steps. |
| [x]  | 6   | Update Memory Bank (`activeContext.md`, `progress.md`)       | Document the changes made, decisions, and mark the task as complete.                                                              |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "read_file",
      "args": { "path": "src/pages/MainProcessFlowPage.tsx" },
      "success": "file_read",
      "status": "success"
    },
    {
      "id": 2,
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/RowSteps.tsx",
        "diff": [
          "SEARCH_IMPORTS_HERE",
          "REPLACE_IMPORTS_HERE",
          "SEARCH_JSX_STRUCTURE_HERE",
          "REPLACE_JSX_STRUCTURE_WITH_ARROWS_HERE"
        ]
      },
      "success": "arrows_added",
      "status": "success"
    },
    {
      "id": 3,
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/RowSteps.tsx",
        "diff": [
          "SEARCH_ARROW_BUTTON_LOGIC_HERE",
          "REPLACE_ARROW_BUTTON_LOGIC_WITH_DISABLED_STATE_HERE"
        ]
      },
      "success": "arrows_disabled_logic_added",
      "status": "success"
    },
    {
      "id": 4,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/MainProcessFlowPage.tsx",
        "diff": [
          "SEARCH_OLD_BUTTONS_HERE",
          "REPLACE_OLD_BUTTONS_WITH_EMPTY_HERE"
        ]
      },
      "success": "old_buttons_removed",
      "status": "success"
    },
    {
      "id": 5,
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/RowSteps.tsx",
        "diff": [
          "SEARCH_NAV_STYLES_HERE",
          "REPLACE_NAV_STYLES_FOR_CENTERING_HERE"
        ]
      },
      "success": "styling_adjusted",
      "status": "success"
    },
    {
      "id": 6,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "..."
      },
      "success": "active_context_updated",
      "status": "success"
    },
    {
      "id": 7,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/progress.md",
        "content": "..."
      },
      "success": "progress_updated",
      "status": "success"
    }
  ]
}
-->
