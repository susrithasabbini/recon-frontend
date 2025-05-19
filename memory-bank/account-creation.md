## Memory Bank: `src/pages/account-creation.tsx`

### **State**
- `accounts`: List of account objects (`{ name, type }`).
- `name`, `type`: Controlled values for the new account form.
- `page`: Current page for paginated account list.
- `query`: Search query for filtering accounts.
- `accountToDelete`: Account object pending deletion (for modal).
- `accountToEdit`: Account object pending edit (for modal).
- `editName`, `editType`: Controlled values for the edit account modal.
- `formTouched`: Tracks if the add form has been interacted with (for validation).
- `loading`: Boolean, shows skeleton while “fetching” accounts (simulated).
- `rowsPerPage`: Number of accounts per page.

### **UI Structure**
- **Header**: Title and description, animated in with Framer Motion.
- **Form (left column)**:
  - Card with input for account name and a select for type (Debit/Credit).
  - Validation: Name required, type always required.
  - Add button disabled if name is empty.
  - On submit, adds account, resets form, shows toast.
- **Account List (right column)**:
  - Search input for filtering.
  - Table with paginated, filtered accounts.
  - Each row: name, type badge, Edit and Delete buttons (with tooltips).
  - Edit opens modal with pre-filled values.
  - Delete opens confirmation modal.
  - Loading skeleton shown on initial load.
  - Empty state with animation if no accounts.
- **Modals**:
  - Delete confirmation modal.
  - Edit account modal (with form).

### **Key Behaviors**
- **Add Account**: Validates, adds to list, resets form, shows toast.
- **Edit Account**: Opens modal, updates account in list, shows toast.
- **Delete Account**: Opens modal, removes from list, shows toast.
- **Pagination**: Handles page changes, resets to first page on add.
- **Search**: Filters accounts by name.
- **Type Select**: Only “debit” or “credit” allowed, cannot be deselected.
- **Toasts**: Uses `addToast` from `@heroui/toast` for feedback.

### **Accessibility & UX**
- All forms and modals have ARIA labels.
- Buttons are disabled appropriately.
- Focus and hover states are styled.
- Table header is sticky.
- Responsive layout.

---