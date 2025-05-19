# Rules Mapping Page

## Overview

The Rules Mapping page allows users to create and manage mappings between different accounts for reconciliation purposes. It features a two-column layout with a creation form on the left and a table of existing mappings on the right.

## Components and Structure

### Layout

- Uses `DefaultLayout` as the base layout
- Two-column grid layout (4:8 split on large screens)
- Hero section at the top with title and description

### Left Column - Creation Form

- Card component with header, body, and footer
- Form with two Select components:
  - Source Account selection
  - Target Account selection (disabled until source is selected)
- Add Mapping button
- Total mappings count in footer

### Right Column - Mappings Table

- Card component containing the table
- Table with three columns:
  - Source (displays account name)
  - Target (displays account name)
  - Actions (centered, contains edit and delete buttons)
- Loading state with skeleton loader
- Empty state message

### Modals

1. **Edit Modal**

   - Opens when edit button is clicked
   - Contains source and target account selectors
   - Save and Cancel buttons
   - Validation for duplicate mappings

2. **Delete Confirmation Modal**
   - Opens when delete button is clicked
   - Shows mapping details
   - Confirmation message
   - Delete and Cancel buttons

## State Management

```typescript
// Main states
const [mappings, setMappings] = useState<
  {
    id: string;
    source: string;
    target: string;
  }[]
>([]);
const [newMapping, setNewMapping] = useState({ source: "", target: "" });
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [mappingToDelete, setMappingToDelete] = useState<{
  id: string;
  source: string;
  target: string;
} | null>(null);
const [mappingToEdit, setMappingToEdit] = useState<{
  id: string;
  source: string;
  target: string;
} | null>(null);
```

## Key Features

1. **Mapping Creation**

   - Form validation
   - Prevents duplicate mappings
   - Prevents same source and target
   - Dynamic target options based on source selection

2. **Mapping Management**

   - Edit existing mappings
   - Delete mappings with confirmation
   - Loading states for all operations
   - Error handling and display

3. **UI/UX**
   - Responsive design
   - Loading skeletons
   - Animated transitions
   - Tooltips for actions
   - Clear error messages

## Dependencies

- HeroUI components (Card, Button, Select, Modal, Table)
- Framer Motion for animations
- Heroicons for icons
- Tailwind CSS for styling

## Mock Data

```typescript
const mockAccounts = [
  { id: "1", name: "OMS Account" },
  { id: "2", name: "PSP Account" },
  { id: "3", name: "Bank Account" },
];
```

## Animation Variants

```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.2 * i,
      ease: "easeOut",
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "backOut" },
  },
};
```

## Common Issues and Solutions

1. **Table Alignment**

   - Use `align="center"` for action column header
   - Add `className="text-center"` to action cells

2. **Loading States**

   - Use skeleton loader during operations
   - Simulate loading with setTimeout
   - Clear loading state after operation

3. **Form Validation**

   - Check for empty fields
   - Validate source and target are different
   - Check for duplicate mappings

4. **Modal Management**
   - Clear error state when closing modals
   - Reset form state after successful operations
   - Handle cancellation properly

## Best Practices

1. Always use proper key props for lists
2. Handle loading states for all operations
3. Provide clear error messages
4. Use proper aria labels for accessibility
5. Maintain consistent styling with other pages
6. Use proper TypeScript types for all state
7. Handle edge cases (empty states, loading, errors)
