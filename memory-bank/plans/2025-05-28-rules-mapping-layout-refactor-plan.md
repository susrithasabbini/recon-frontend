# Plan: Refactor Rules Mapping Page Layout (2025-05-28)

**Objective:** Make the `src/pages/rules-mapping.tsx` page layout similar to `src/pages/merchant-creation.tsx`.

## Steps

| Done | #   | Action                                                | Detail                                                                                                                                                                                                                             |
| ---- | --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]  | 1   | Modify Outer Structure & Title Section                | Change root wrapper, replace hero section with a simple centered title.                                                                                                                                                            |
| [ ]  | 2   | Implement Single Main Card Structure                  | Consolidate "Add Mapping" form and "Current Mappings" table into one main `Card`. The form will initially be moved conceptually, then placed in a modal in Step 3. The table of mappings will be the primary content of this card. |
| [ ]  | 3   | Move "Add Mapping" Form to Modal & Add Trigger Button | Relocate the existing "Add Mapping" form into a `Modal`. Add a "New Mapping" button in the main card's header area to open this modal.                                                                                             |
| [ ]  | 4   | Adjust Styles, Animations, and Refine                 | Ensure consistent application of animations (`fadeInUp`, `scaleIn`) and styling (padding, margins) with `merchant-creation.tsx`. This step will largely be about verifying the previous changes and making minor tweaks if needed. |
| [ ]  | 5   | Update Memory Bank                                    | Update `activeContext.md`, `progress.md`, and `rules-mapping.md` in the Memory Bank to reflect the changes.                                                                                                                        |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/rules-mapping.tsx",
        "diff": [
          {
            "SEARCH": "export default function RulesMappingPage() {",
            "REPLACE": "export default function RulesMappingPage() {"
          }
        ]
      },
      "description": "Step 1: Modify outer structure and title section of rules-mapping.tsx. This involves changing the root wrapper from a React Fragment to a div styled like merchant-creation.tsx, and simplifying the current hero section to a centered title.",
      "success": "Outer structure and title updated.",
      "status": "pending"
    },
    {
      "id": 2,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/rules-mapping.tsx",
        "diff": [
           {
            "SEARCH": "export default function RulesMappingPage() {",
            "REPLACE": "export default function RulesMappingPage() {"
          }
        ]
      },
      "description": "Step 2: Restructure content into a single main Card. The current two-column grid (form in aside, table in main) will be replaced. The mappings table will be moved into this new main CardBody.",
      "success": "Main card structure implemented.",
      "status": "pending"
    },
    {
      "id": 3,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/rules-mapping.tsx",
        "diff": [
           {
            "SEARCH": "export default function RulesMappingPage() {",
            "REPLACE": "export default function RulesMappingPage() {"
          }
        ]
      },
      "description": "Step 3: Move the 'Add Mapping' form into a Modal. Add a 'New Mapping' button within the main card's header to trigger this modal. This includes adding state for modal visibility and adapting the form submission logic.",
      "success": "Form moved to modal with trigger button.",
      "status": "pending"
    },
    {
      "id": 4,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/rules-mapping.tsx",
        "diff": [
           {
            "SEARCH": "export default function RulesMappingPage() {",
            "REPLACE": "export default function RulesMappingPage() {"
          }
        ]
      },
      "description": "Step 4: Review and refine styles and animations. Ensure consistency with merchant-creation.tsx. This may involve minor adjustments to classes, padding, or animation variants based on the outcome of previous steps.",
      "success": "Styles and animations refined.",
      "status": "pending"
    },
    {
      "id": 5,
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "# Active Context - {{ISO_DATE}}\\n\\n## Current Focus\\n- Refactor src/pages/rules-mapping.tsx layout to be similar to src/pages/merchant-creation.tsx.\\n\\n## Key Decisions & Changes\\n- Details of changes made to src/pages/rules-mapping.tsx...\\n\\n## Next Steps\\n- Update memory-bank/progress.md\\n- Update memory-bank/rules-mapping.md"
      },
      "description": "Step 5: Update Memory Bank files (activeContext.md, progress.md, rules-mapping.md).",
      "success": "Memory Bank updated.",
      "status": "pending"
    }
  ]
}
-->
