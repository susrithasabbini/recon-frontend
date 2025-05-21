## Memory Bank: `src/pages/account-creation.tsx`

### **State**

- `accounts`: List of account objects with complete details including balances.
- `name`, `type`, `currency`: Controlled values for the new account form.
- `page`: Current page for the paginated account list, managed by the `@heroui/pagination` component.
- `query`: Search query for filtering accounts.
- `accountToDelete`: Account object pending deletion (for modal).
- `accountToEdit`: Account object pending edit (for modal).
- `editName`: Controlled value for the edit account modal's name field. (Note: `editType`, `editCurrency` were mentioned in original doc but not present in the provided `account-creation.tsx` code for editing, only name is editable).
- `error`: Error message state for form validation.
- `loading`: Boolean, shows skeleton while fetching accounts or during operations.
- `rowsPerPage`: Number of accounts per page, used to calculate total pages for pagination.
- `selectedMerchant`: Current selected merchant from default context.

### **Context Integration**

- Uses `useDefaultContext` hook for:
  - `selectedMerchant`: Current selected merchant ID
  - `createAccount`: Function to create new accounts
  - `getAccounts`: Function to fetch accounts list
  - `deleteAccount`: Function to delete accounts
  - `updateAccount`: Function to update account details (specifically name).

### **UI Structure**

- **Header**: Title and description, animated with Framer Motion.
- **Form (left column)**:
  - Card with input for account name, selects for type (Debit/Credit) and currency.
  - Validation: Name required.
  - Add button disabled if no merchant is selected.
- **Account List (right column)**:
  - Shows "Please select a merchant first" message if no merchant selected.
  - Search input for filtering accounts.
  - Table (`@heroui/table`) displaying filtered accounts.
  - Pagination: Uses `@heroui/pagination` component in the table's `bottomContent`, conditionally rendered if `pages > 1`. The `onChange` callback updates the `page` state.
  - Each row: name, type badge, currency, available balance, Edit and Delete buttons.
  - Loading skeleton shown only when merchant is selected and data is loading.
  - Empty state with animation if no accounts or no merchant selected.
- **Modals**:
  - Delete confirmation modal with account name.
  - Edit account modal for changing the account name.

### **Key Behaviors**

- **Merchant Selection**:
  - Required before any account operations.
  - Shows appropriate message when no merchant selected.
  - Disables add button when no merchant selected.
- **Account Creation**:
  - Validates merchant selection first.
  - Validates account name is not empty.
  - Fetches updated account list after creation.
  - Shows success/error toast messages.
  - Resets form and `page` state to 1 after successful creation.
- **Account Deletion**:
  - Shows confirmation modal with account name.
  - Fetches updated account list after deletion.
  - Adjusts `page` state if the last item on a page (and not the first page) is deleted.
  - Shows success/error toast messages.
- **Account Editing**:
  - Opens modal with pre-filled account name.
  - Updates account name in the list locally and via API.
  - Shows success/error toast messages.
- **Pagination**:
  - The number of pages (`pages`) is calculated based on `filteredAccounts.length` and `rowsPerPage`.
  - The `Pagination` component handles page navigation. `setPage` updates the current page, triggering re-render of `items`.
- **State Management**:
  - Fetches fresh data from backend after create/delete operations.
  - Local state updates for immediate UI feedback (e.g., on edit).
  - Proper loading states during all operations.
  - Error handling with user feedback via toasts and form errors.

### **Accessibility**

- ARIA labels for all interactive elements.
- Proper focus management in modals.
- Keyboard navigation support.
- Loading states communicated.

### **Error Handling**

- Form validation errors shown below input.
- Toast notifications for operation success/failure.
- Loading states during API operations.
- Proper error messages for missing merchant selection.

### **Test Cases (Relevant to Pagination)**

#### **Account List**

- `accounts-table`: Table component
  - Should display accounts in paginated format using `@heroui/pagination`.
  - Pagination controls should appear only if total items exceed `rowsPerPage`.
  - Clicking a page number or next/previous in pagination should display the correct set of items.
- `edit-button`, `delete-button`: Actions should not reset pagination unless necessary (e.g., deleting last item on a page).

#### **State Management**

- Should fetch accounts when merchant is selected.
- Should update list and potentially pagination (if total pages change) after successful account creation/deletion/edit.
- Should handle pagination correctly after operations (e.g., if an item is deleted from the current page).
- Search state should be maintained during pagination changes and vice-versa.
