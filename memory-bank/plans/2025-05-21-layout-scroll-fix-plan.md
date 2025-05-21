## Steps

| Done | #   | Action                                  | Detail                                                               |
| ---- | --- | --------------------------------------- | -------------------------------------------------------------------- |
| [x]  | 1   | Modify `src/pages/file-upload.tsx`      | Adjust layout for correct Hero section fixing and content scrolling. |
| [x]  | 2   | Modify `src/pages/account-creation.tsx` | Adjust layout for correct Hero section fixing and content scrolling. |
| [x]  | 3   | Modify `src/pages/rules-mapping.tsx`    | Adjust layout for correct Hero section fixing and content scrolling. |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": [
          {
            "search": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height))] mt-10\"> {/* Adjust var(--page-header-height) as needed */}",
            "replace": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height)-2.5rem)] mt-10\"> {/* Assuming mt-10 is 2.5rem and --page-header-height is hero height */}"
          },
          {
            "search": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 fixed top-[var(--navbar-height)] left-0 h-[calc(100vh-var(--navbar-height))] overflow-y-auto\"> {/* Adjust top value based on actual navbar height */}",
            "replace": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 sticky top-0 self-start h-full overflow-y-auto\"> {/* Sticky, top-0 within flex, h-full of parent */}"
          }
        ]
      },
      "success": "file_updated_and_scroll_fixed",
      "status": "success"
    },
    {
      "id": 2,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/account-creation.tsx",
        "diff": [
          {
            "search": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height))] mt-10\"> {/* Adjust var(--page-header-height) as needed */}",
            "replace": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height)-2.5rem)] mt-10\"> {/* Assuming mt-10 is 2.5rem and --page-header-height is hero height */}"
          },
          {
            "search": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 fixed top-[var(--navbar-height)] left-0 h-[calc(100vh-var(--navbar-height))] overflow-y-auto\"> {/* Adjust top value based on actual navbar height */}",
            "replace": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 sticky top-0 self-start h-full overflow-y-auto\"> {/* Sticky, top-0 within flex, h-full of parent */}"
          }
        ]
      },
      "success": "file_updated_and_scroll_fixed",
      "status": "success"
    },
    {
      "id": 3,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/rules-mapping.tsx",
        "diff": [
          {
            "search": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height))] mt-10\"> {/* Adjust var(--page-header-height) as needed */}",
            "replace": "        <div className=\"flex h-[calc(100vh-var(--navbar-height)-var(--page-header-height)-2.5rem)] mt-10\"> {/* Assuming mt-10 is 2.5rem and --page-header-height is hero height */}"
          },
          {
            "search": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 fixed top-[var(--navbar-height)] left-0 h-[calc(100vh-var(--navbar-height))] overflow-y-auto\"> {/* Adjust top value based on actual navbar height */}",
            "replace": "          <aside className=\"w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 sticky top-0 self-start h-full overflow-y-auto\"> {/* Sticky, top-0 within flex, h-full of parent */}"
          }
        ]
      },
      "success": "file_updated_and_scroll_fixed",
      "status": "success"
    }
  ]
}
-->
