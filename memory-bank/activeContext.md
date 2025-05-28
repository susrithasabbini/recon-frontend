# Active Context - 2025-05-28

## Current Focus

- Refactor `src/pages/rules-mapping.tsx` page layout to be similar to `src/pages/merchant-creation.tsx`.

## Key Decisions & Changes

- **`src/pages/rules-mapping.tsx`**:
  - Changed the root wrapper to a `div` with class `max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12`.
  - Replaced the complex hero section with a simpler centered title using `motion.div` with `fadeInUp` animation, styled like `merchant-creation.tsx`.
  - Removed the two-column grid layout (`aside` for form, `main` for table).
  - Consolidated the "Current Mappings" table into a single main `Card` component, wrapped in a `motion.div` with `scaleIn` animation.
  - The `CardBody` now contains a header section with the "Current Mappings" title and a "New Mapping" button.
  - The "Add Mapping" form has been moved into a `Modal` component.
  - Added `isCreateMappingModalOpen` state to control the visibility of the "Add Mapping" modal.
  - The "New Mapping" button in the card header now triggers this modal.
  - The `handleAddMapping` function now closes the modal on successful submission.
  - Imported `PlusIcon` for the "New Mapping" button.
  - Ensured animation variants (`fadeInUp`, `scaleIn`) and general structure align with `merchant-creation.tsx`.
- **Files Modified**:
  - `src/pages/rules-mapping.tsx`
  - `memory-bank/plans/2025-05-28-rules-mapping-layout-refactor-plan.md` (followed)
  - `memory-bank/activeContext.md` (this update)

## Next Steps

- Update `memory-bank/progress.md`.
- Update `memory-bank/rules-mapping.md`.
- Thoroughly test the rules mapping page functionality (listing, modal form, creation, deletion, pagination, responsiveness).
