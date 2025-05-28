# Rules Mapping Page (`src/pages/rules-mapping.tsx`) - Updated 2025-05-28

## Overview

The Rules Mapping page allows users to create and manage mappings between different accounts for reconciliation purposes. It now features a single-column layout, similar to `merchant-creation.tsx`, with a main card displaying existing mappings and a modal for creating new ones.

## Components and Structure

### Layout

- Uses `DefaultLayout` as the base layout.
- Root element is a `div` with class `max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12`.
- Simplified hero section at the top with a centered title, animated with Framer Motion (`fadeInUp`).

### Main Content Card

- A single `Card` component (`@heroui/card`) wrapped in a `motion.div` with `scaleIn` animation, styled with `border border-gray-200 dark:border-gray-700 shadow-lg`.
- `CardBody` with `p-4 sm:p-6`:
  - Header section:
    - Title: "Current Mappings" (`h3` styled `text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white`).
    - "New Mapping" button (`@heroui/button` with `PlusIcon`) to open the creation modal.
  - Mappings Table (`@heroui/table`):
    - Displays existing mappings.
    - Columns: Source (account name), Target (account name), Actions (centered, contains delete button).
    - Pagination: Uses `@heroui/pagination` component in the table's `bottomContent`, conditionally rendered if `pages > 1`.
    - Loading state with skeleton loader.
    - Empty state message if no merchant selected or no mappings exist.

### Modals

- **Add Mapping Modal (`@heroui/modal`)**:
  - Opens when "New Mapping" button is clicked.
  - Controlled by `isCreateMappingModalOpen` state.
  - `ModalHeader`: "Add New Mapping".
  - `ModalBody` contains the form:
    - Two `Select` components (`@heroui/select`): Source Account and Target Account.
    - Error message display.
  - `ModalFooter` with "Cancel" and "Add Mapping" buttons.
- **Delete Confirmation Modal (`@heroui/modal`)**:
  - Opens when delete button in the table is clicked.
  - Shows mapping details (source and target account names).
  - Confirmation message.
  - Delete and Cancel buttons.

## State Management

```typescript
// Main states
const [accounts, setAccounts] = useState<Account[]>([]); // For populating select dropdowns
const [mappings, setMappings] = useState<ReconRule[]>([]);
const [newMapping, setNewMapping] = useState({ source: "", target: "" });
const [error, setError] = useState(""); // For form validation errors
const [loading, setLoading] = useState(true); // General loading state
const [mappingToDelete, setMappingToDelete] = useState<ReconRule | null>(null);
const [isCreateMappingModalOpen, setIsCreateMappingModalOpen] = useState(false); // For Add Mapping Modal
const [page, setPage] = useState(1); // For pagination
const rowsPerPage = 5; // For pagination
```

- `ReconRule` and `Account` interfaces define the structure of mapping and account data.

## Key Features

1.  **Mapping Creation (via Modal)**:
    - Form validation (both accounts selected, source != target, mapping doesn't already exist).
    - Dynamic target account options based on selected source.
    - API call to create mapping, then refetches mappings.
    - Modal closes on successful creation.
    - Toast notifications for success/failure.
2.  **Mapping Deletion**:
    - Confirmation modal before deletion.
    - API call to delete mapping, then refetches mappings.
    - Toast notifications for success/failure.
3.  **Data Display and Interaction**:
    - Fetches accounts for select dropdowns.
    - Fetches existing mappings for the selected merchant.
    - Paginated display of mappings using `@heroui/pagination`.
    - Loading states for all asynchronous operations.
    - Clear error messages and empty states.
4.  **UI/UX**:
    - Responsive design.
    - Loading skeletons.
    - Animated transitions using Framer Motion (`fadeInUp`, `scaleIn`).
    - Tooltips (`@heroui/tooltip`) for actions like delete.
    - Layout and interaction patterns aligned with `merchant-creation.tsx`.

## Dependencies

- HeroUI components (`@heroui/card`, `@heroui/button`, `@heroui/select`, `@heroui/modal`, `@heroui/table`, `@heroui/tooltip`, `@heroui/pagination`, `@heroui/toast`)
- Framer Motion for animations
- Heroicons (`@heroicons/react/24/outline`) for icons (TrashIcon, ArrowsRightLeftIcon, PlusIcon)
- Tailwind CSS for styling
- Axios for API calls (`@/config/axios`)
- `clsx` for conditional class names

## Animation Variants

```typescript
const fadeInUp = {
  /* ... */
};
const scaleIn = {
  /* ... */
};
```

## Best Practices and Considerations

- Ensure `selectedMerchant` from `useDefaultContext` is available before fetching or performing operations.
- Handle API errors gracefully with toast notifications.
- Maintain consistency in UI and UX patterns (pagination, loading, empty states) with other pages.
- Use proper TypeScript types for all state and props.
