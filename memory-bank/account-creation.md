## Memory Bank: `src/pages/account-creation.tsx`

### **State**

- `accounts`: List of account objects with complete details including balances.
- `name`, `type`, `currency`: Controlled values for the new account form.
- `page`: Current page for paginated account list.
- `query`: Search query for filtering accounts.
- `accountToDelete`: Account object pending deletion (for modal).
- `accountToEdit`: Account object pending edit (for modal).
- `editName`, `editType`, `editCurrency`: Controlled values for the edit account modal.
- `error`: Error message state for form validation.
- `loading`: Boolean, shows skeleton while fetching accounts or during operations.
- `rowsPerPage`: Number of accounts per page.
- `selectedMerchant`: Current selected merchant from default context.

### **Context Integration**

- Uses `useDefaultContext` hook for:
  - `selectedMerchant`: Current selected merchant ID
  - `createAccount`: Function to create new accounts
  - `getAccounts`: Function to fetch accounts list
  - `deleteAccount`: Function to delete accounts

### **UI Structure**

- **Header**: Title and description, animated with Framer Motion.
- **Form (left column)**:
  - Card with input for account name, selects for type (Debit/Credit) and currency.
  - Validation: Name required, type and currency always required.
  - Add button disabled if no merchant is selected.
  - Shows error message only after form submission.
  - On submit, validates merchant selection first, then name.
- **Account List (right column)**:
  - Shows "Please select a merchant first" message if no merchant selected.
  - Search input for filtering accounts.
  - Table with paginated, filtered accounts.
  - Each row: name, type badge, currency, available balance, Edit and Delete buttons.
  - Loading skeleton shown only when merchant is selected and data is loading.
  - Empty state with animation if no accounts or no merchant selected.
- **Modals**:
  - Delete confirmation modal with account name.
  - Edit account modal with pre-filled values.

### **Key Behaviors**

- **Merchant Selection**:

  - Required before any account operations.
  - Shows appropriate message when no merchant selected.
  - Disables add button when no merchant selected.

- **Account Creation**:

  - Validates merchant selection first.
  - Validates account name is not empty.
  - Creates account with initial balances set to "0.0".
  - Fetches updated account list after creation.
  - Shows success/error toast messages.
  - Resets form after successful creation.

- **Account Deletion**:

  - Shows confirmation modal with account name.
  - Fetches updated account list after deletion.
  - Handles pagination when last item on page is deleted.
  - Shows success/error toast messages.

- **Account Editing**:

  - Opens modal with pre-filled values.
  - Updates account details in the list.
  - Shows success toast message.

- **State Management**:
  - Always fetches fresh data from backend after create/delete operations.
  - Maintains consistency between frontend and backend state.
  - Proper loading states during all operations.
  - Error handling with user feedback.

### **Accessibility**

- ARIA labels for all interactive elements.
- Proper focus management in modals.
- Keyboard navigation support.
- Loading states communicated to screen readers.

### **Error Handling**

- Form validation errors shown below input.
- Toast notifications for operation success/failure.
- Loading states during API operations.
- Proper error messages for missing merchant selection.

### **Test Cases**

#### **Form Validation**

- `account-name-input`: Input field for account name
  - Should show error when empty on submit
  - Should clear error when typing
  - Should be required
- `account-type-select`: Select field for account type
  - Should default to "DEBIT_NORMAL"
  - Should not allow empty selection
  - Should toggle between "DEBIT_NORMAL" and "CREDIT_NORMAL"
- `currency-select`: Select field for currency
  - Should default to "USD"
  - Should not allow empty selection
  - Should toggle between available currencies
- `add-account-button`: Submit button
  - Should be disabled when no merchant selected
  - Should be disabled when form is invalid
  - Should show loading state during submission

#### **Account List**

- `search-input`: Search field
  - Should filter accounts by name
  - Should be case-insensitive
  - Should update results in real-time
- `accounts-table`: Table component
  - Should display accounts in paginated format
  - Should show loading skeleton when loading
  - Should show empty state when no accounts
  - Should show merchant selection message when no merchant
- `edit-button`: Edit action button
  - Should open edit modal with pre-filled values
  - Should be disabled during loading
- `delete-button`: Delete action button
  - Should open confirmation modal
  - Should be disabled during loading

#### **Modals**

- Delete Confirmation Modal
  - Should display account name
  - Should have cancel and confirm buttons
  - Should close on cancel
  - Should trigger delete on confirm
- Edit Modal
  - Should pre-fill current account values
  - Should validate on submit
  - Should update account on save
  - Should close on cancel

#### **State Management**

- Should fetch accounts when merchant is selected
- Should update list after successful account creation
- Should update list after successful account deletion
- Should update list after successful account edit
- Should handle pagination correctly after operations
- Should maintain search state during operations

#### **Error Scenarios**

- Should handle API errors gracefully
- Should show appropriate error messages
- Should maintain form state on error
- Should allow retry after error
- Should handle network errors
- Should handle validation errors

#### **Accessibility**

- Should maintain focus trap in modals
- Should announce loading states
- Should announce success/error messages
- Should support keyboard navigation
- Should have proper ARIA labels

#### **Integration**

- Should integrate with merchant context
- Should handle merchant selection changes
- Should sync with backend state
- Should maintain data consistency

---
