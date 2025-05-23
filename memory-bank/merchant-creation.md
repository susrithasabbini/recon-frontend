# Merchant Management Page (`src/pages/merchant-creation.tsx`)

## Overview

The `MerchantManagementPage` allows users to create, view, and edit merchants. It provides a form for adding new merchants and a paginated, searchable table listing existing merchants with an option to edit each.

## Key Features

- **Merchant Creation:**
  - A form with an input field for the new merchant's name.
  - Client-side validation to ensure the merchant name is not empty.
  - Uses the `addMerchant` function from `useDefaultContext`.
- **Merchant Listing:**
  - Displays a list of merchants fetched via `merchants` from `useDefaultContext`.
  - Uses `@heroui/table` for display.
  - Columns: Merchant Name, Actions.
  - Search functionality to filter merchants by name.
  - Pagination using `@heroui/pagination` if the number of merchants exceeds `rowsPerPage`.
- **Merchant Editing:**
  - An "Edit" button for each merchant in the list.
  - Opens a modal (`@heroui/modal`) pre-filled with the merchant's current name.
  - Allows updating the merchant's name using the `updateMerchant` function from `useDefaultContext`.
- **User Feedback:**
  - Toast notifications (`@heroui/toast`) for success or failure of create/update operations.
  - Loading indicators:
    - Skeleton loader for the table while `isLoading` (from context, for initial list load) is true.
    - Button loading state for "Add Merchant" and "Save Changes" (in edit modal) during their respective operations.
  - Empty state display if no merchants are found.
  - Form error messages for validation failures.
- **UI Structure:**
  - Hero section with title and description.
  - Two-column layout: Form on the left, merchant list on the right.
  - Animations using `framer-motion` (`fadeInUp`, `scaleIn`).

## Context Integration

- Uses `useDefaultContext` hook for:
  - `merchants`: Array of merchant objects.
  - `addMerchant`: Function to create a new merchant.
  - `isLoading`: Boolean indicating if the initial merchant list is loading.
  - `updateMerchant`: Function to update an existing merchant's details (name).

## State Management (Local)

- `name`: Name for the new merchant being created.
- `page`: Current page number for the merchant list pagination.
- `query`: Search query for filtering the merchant list.
- `merchantToEdit`: The merchant object currently being edited (null if no edit modal is open).
- `editName`: The name being edited in the modal.
- `error`: Error message for the new merchant form.
- `loading`: Local loading state for add/edit operations (distinct from context's `isLoading`).
- `rowsPerPage`: Constant defining items per page for pagination (set to 5).

## Dependencies

- `@heroui/input`, `@heroui/button`, `@heroui/card`, `@heroui/table`, `@heroui/modal`, `@heroui/pagination`, `@heroui/tooltip`, `@heroui/toast`
- `@heroicons/react/24/outline` (BuildingOfficeIcon, MagnifyingGlassIcon, PencilSquareIcon)
- `framer-motion`
- `clsx`
- `@/components/primitives` (for `title`)
- `@/contexts/default-context`

## Noted Patterns

- Consistent CRUD-like interface pattern (similar to `AccountManagementPage`).
- Use of modals for editing, keeping the main list view clean.
- Combination of context-driven data (`merchants`, `isLoading`) and local UI state.
