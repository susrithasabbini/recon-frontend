# Rules Mapping Page (`src/pages/rules-mapping.tsx`)

## Overview

The Rules Mapping page allows users to create and manage mappings between different accounts for reconciliation purposes. It features a two-column layout with a creation form on the left and a table of existing mappings on the right.

## Components and Structure

### Layout

- Uses `DefaultLayout` as the base layout.
- Two-column grid layout (e.g., 4:8 split on large screens).
- Hero section at the top with title and description, animated with Framer Motion.

### Left Column - Creation Form

- Card component (`@heroui/card`) with header, body, and footer.
- Form with two Select components (`@heroui/select`):
  - Source Account selection.
  - Target Account selection (disabled until source is selected, filters out source account).
- Add Mapping button (`@heroui/button`).
- Total mappings count in footer.

### Right Column - Mappings Table

- Card component containing the table (`@heroui/table`).
- Table with three columns: Source (account name), Target (account name), Actions (centered, contains delete button).
- Pagination: Uses `@heroui/pagination` component in the table's `bottomContent`, conditionally rendered if `pages > 1`. The `onChange` callback updates the `page` state.
- Loading state with skeleton loader.
- Empty state message if no merchant selected or no mappings exist.

### Modals

- **Delete Confirmation Modal (`@heroui/modal`)**:
  - Opens when delete button is clicked.
  - Shows mapping details (source and target account names).
  - Confirmation message.
  - Delete and Cancel buttons.
    (Note: The original `rules-mapping.md` mentioned an Edit Modal, but the provided `src/pages/rules-mapping.tsx` code does not include functionality or UI for editing mappings, only creating and deleting.)

## State Management

```typescript
// Main states
const [accounts, setAccounts] = useState<Account[]>([]); // For populating select dropdowns
const [mappings, setMappings] = useState<ReconRule[]>([]);
const [newMapping, setNewMapping] = useState({ source: "", target: "" });
const [error, setError] = useState(""); // For form validation errors
const [loading, setLoading] = useState(true); // General loading state
const [mappingToDelete, setMappingToDelete] = useState<ReconRule | null>(null);
const [page, setPage] = useState(1); // For pagination
const rowsPerPage = 5; // For pagination
```

- `ReconRule` and `Account` interfaces define the structure of mapping and account data.

## Key Features

1.  **Mapping Creation**:
    - Form validation (both accounts selected, source != target, mapping doesn't already exist).
    - Dynamic target account options based on selected source.
    - API call to create mapping, then refetches mappings.
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

## Dependencies

- HeroUI components (`@heroui/card`, `@heroui/button`, `@heroui/select`, `@heroui/modal`, `@heroui/table`, `@heroui/tooltip`, `@heroui/pagination`, `@heroui/toast`)
- Framer Motion for animations
- Heroicons (`@heroicons/react/24/outline`) for icons (TrashIcon, ArrowsRightLeftIcon)
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
