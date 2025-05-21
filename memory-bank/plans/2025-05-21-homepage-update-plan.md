## Plan: Update Home Page for Unified Process Flow

**Date:** 2025-05-21

**Objective:** Modify the Home page (`src/pages/home.tsx`) to remove the individual step navigation and replace it with a brief explanation of the unified process flow and a "Get Started" button linking to `/process-flow`.

## Steps

| Done | #   | Action                                                               | Detail                                                                                             |
| ---- | --- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [ ]  | 1   | Modify `src/pages/home.tsx`                                          | Remove existing step cards, update description, add "Get Started" button.                          |
| [ ]  | 2   | Verify changes (Manual or via `browser_action` if server is running) | Ensure the Home page displays correctly and the "Get Started" button navigates to `/process-flow`. |
| [ ]  | 3   | Update `memory-bank/activeContext.md`                                | Document the changes made to the Home page and the new focus on the unified process flow.          |
| [ ]  | 4   | Update `memory-bank/progress.md`                                     | Log the completion of the Home page update task.                                                   |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/home.tsx",
        "diff": [
          {
            "search": "const steps = [\\n  {\\n    title: \"1. Account Creation\",\\n    description:\\n      \"Set up your accounts (e.g., Sales Revenue, PSP Holding, Bank Account).\",\\n    href: \"/account-creation\",\\n  },\\n  {\\n    title: \"2. Recon Rules Mapping\",\\n    description:\\n      \"Define how data flows and set up expectations between accounts.\",\\n    href: \"/rules-mapping\",\\n  },\\n  {\\n    title: \"3. File Upload\",\\n    description: \"Upload OMS, PSP, and Bank data for reconciliation.\",\\n    href: \"/file-upload\",\\n  },\\n];",
            "replace": ""
          },
          {
            "search": "          <p className={subtitle()}>\\n            Gain real-time financial clarity and automate reconciliation with a\\n            smart ledger system.\\n          </p>",
            "replace": "          <p className={subtitle()}>\\n            Our streamlined process guides you through setting up accounts, mapping rules, and uploading files for efficient reconciliation. Click below to begin.\\n          </p>"
          },
          {
            "search": "        {/* Step Navigation with Animation */}\\n        <motion.div\\n          className=\"grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl\"\\n          initial=\"hidden\"\\n          animate=\"visible\"\\n          variants={{\\n            hidden: {},\\n            visible: {\\n              transition: {\\n                staggerChildren: 0.15,\\n              },\\n            },\\n          }}\\n        >\\n          {steps.map((step) => (\\n            <motion.div\\n              key={step.title}\\n              variants={{\\n                hidden: { opacity: 0, y: 30 },\\n                visible: { opacity: 1, y: 0 },\\n              }}\\n              whileHover={{\\n                scale: 1.03,\\n                boxShadow: \"0 4px 24px 0 rgba(60, 80, 180, 0.10)\",\\n              }}\\n              transition={{ type: \"spring\", stiffness: 200, damping: 18 }}\\n            >\\n              <div className=\"h-full flex flex-col justify-between p-6 rounded-xl border border-blue-100 dark:border-neutral-800 shadow bg-white dark:bg-neutral-900 hover:border-blue-400 dark:hover:border-blue-300 transition-colors duration-300\">\\n                <div>\\n                  <h2 className=\"text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200\">\\n                    {step.title}\\n                  </h2>\\n                  <p className=\"text-gray-600 dark:text-gray-300 mb-4\">\\n                    {step.description}\\n                  </p>\\n                </div>\\n                <Button\\n                  as={Link}\\n                  color=\"primary\"\\n                  href={step.href}\\n                  className=\"w-full mt-auto\"\\n                >\\n                  Go to {step.title}\\n                </Button>\\n              </div>\\n            </motion.div>\\n          ))}\\n        </motion.div>",
            "replace": "        {/* Get Started Button */}\\n        <motion.div\\n          initial={{ opacity: 0, y: 20 }}\\n          animate={{ opacity: 1, y: 0 }}\\n          transition={{ duration: 0.5, delay: 0.4 }}\\n        >\\n          <Button\\n            as={Link}\\n            href=\"/process-flow\"\\n            color=\"primary\"\\n            size=\"lg\"\\n            className=\"px-8 py-4 text-lg font-semibold\"\\n          >\\n            Get Started\\n          </Button>\\n        </motion.div>"
          }
        ]
      },
      "success": "file_modified_successfully",
      "status": "pending"
    },
    {
      "id": 2,
      "tool": "browser_action",
      "args": { "action": "launch", "url": "http://localhost:5173/" },
      "success": "browser_launched_and_page_loaded",
      "status": "pending"
    },
    {
      "id": 2.1,
      "tool": "browser_action",
      "args": { "action": "close" },
      "success": "browser_closed",
      "status": "pending"
    },
    {
      "id": 3,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "# Active Context\\n\\n## Current Focus\\nUpdated the Home page (`src/pages/home.tsx`) to reflect a unified process flow. Removed individual step navigation (Account Creation, Rules Mapping, File Upload) and replaced it with a general description and a 'Get Started' button linking to `/process-flow`.\\n\\n## Key Decisions Made Recently\\n- Simplified Home page to direct users to a single process flow.\\n- Maintained the existing `/process-flow` route for the `MainProcessFlowPage` component.\\n\\n## Next Steps (Immediate)\\n- Verify the Home page changes visually.\\n- Update `progress.md` to log this task.\\n- Await further user instructions.\\n\\n## Code Snippet Example (New Home Page Button)\\n```tsx\n// src/pages/home.tsx (Relevant part)\nimport { Link } from \"@heroui/link\";\nimport { Button } from \"@heroui/button\";\n// ... other imports\n\n// ... component logic ...\n\n        {/* Get Started Button */}\n        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.5, delay: 0.4 }}\n        >\n          <Button\n            as={Link}\n            href=\"/process-flow\"\n            color=\"primary\"\n            size=\"lg\"\n            className=\"px-8 py-4 text-lg font-semibold\"\n          >\n            Get Started\n          </Button>\n        </motion.div>\n// ...\n```"
      },
      "success": "active_context_updated",
      "status": "pending"
    },
    {
      "id": 4,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/progress.md",
        "content": "# Progress Log\\n\\n## Date: 2025-05-21\\n\\n### Task: Update Home Page for Unified Process Flow\\n- **Status:** In Progress (Pending Verification)\\n- **Summary:** Modified `src/pages/home.tsx` to remove individual step navigation and added a 'Get Started' button linking to `/process-flow`. The aim is to guide users to a single, comprehensive process flow page.\\n- **Details:**\\n    - Removed the `steps` array and associated card rendering logic.\\n    - Updated the subtitle text to describe the unified flow.\\n    - Added a new `Button` component linking to `/process-flow`.\\n- **Issues Encountered:** None so far.\\n- **Impact:** Streamlines user navigation by directing them to a central process flow instead of separate initial steps.\\n\\n### Task: Standardize Pagination\\n- **Status:** Completed\\n- **Summary:** Refactored pagination across `src/pages/account-creation.tsx`, `src/pages/file-upload.tsx`, and `src/pages/rules-mapping.tsx`. Replaced custom pagination button logic with the standardized `Pagination` component from `@heroui/pagination`.\\n- **Details:**\\n    - Added `import { Pagination } from \"@heroui/pagination\";` to relevant files.\\n    - Updated the `bottomContent` prop of the `Table` component to use `<Pagination total={pages} initialPage={page} onChange={setPage} />`.\\n    - Ensured pagination is only rendered if `pages > 1`.\\n- **Issues Encountered:**\\n    - Initial incorrect import path (`@heroui/react` instead of `@heroui/pagination`) was identified and corrected by the user.\\n    - Initial attempts to write to `/memory-bank/` (absolute root) failed due to file system permissions. Clarified with the user to use the project-relative `memory-bank/` directory.\\n- **Impact:** Improved code consistency, maintainability, and adherence to the HeroUI component library for pagination.\\n\\n### Task: Update Memory Bank (Initial Setup)\\n- **Status:** Completed\\n- **Summary:** Created and populated all core Memory Bank documents based on the current understanding of the project and recent activities.\\n- **Files Updated/Created:**\\n    - `projectbrief.md`\\n    - `productContext.md`\\n    - `systemPatterns.md`\\n    - `techContext.md`\\n    - `activeContext.md`\\n    - `progress.md` (this file)\\n- **Details:** Content was generated by analyzing the project structure, existing Memory Bank snippets provided by the user, and the latest code changes.\\n- **Next Steps:** The Memory Bank is now up-to-date. Awaiting further tasks."
      },
      "success": "progress_log_updated",
      "status": "pending"
    }
  ]
}
-->
