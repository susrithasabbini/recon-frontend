# Plan: Refactor Account Creation Page UI

Date: 2025-05-28

Objective: Update `src/pages/account-creation.tsx` to have a UI similar to `src/pages/merchant-creation.tsx`, but without the item selection feature.

## Steps

| Done | # | Action | Detail ikaTBEPP Okay, I understand the task. You want to update the UI of `src/pages/account-PREP.tsx` to match the UI of `srcika_user
Okay, I will help you with that. I will start by asking some clarifying questions to ensure I understand the requirements correctly.

First, could you please provide the content of `src/pages/account-PREP.tsx`? This will help me understand the current state of the file and what needs to be changed.

Once I have that, I will proceed with the following plan:

1.  **Analyze `src/pages/merchant-creation.tsx`**: I will analyze the provided code to understand its structure, components, state management, and UI patterns, focusing on the card list, modals for create/edit/delete, and search functionality.
2.  **Analyze `src/pages/account-PREP.tsx`**: I will analyze the current code of `src/pages/account-PREP.tsx` to understand its current structure, components, and state management.
3.  **Adapt `account-PREP.tsx`**: I will then modify `account-PREP.tsx` to implement the new UI, including:
    - Modifying the main layout to a single-column structure.
    - Removing the existing form for creating accounts from the main page.
    - Implementing a "New Account" button that opens a modal for account creation.
    - Refactoring the account listing from a table to a list of cards. Each card should display account details.
    - Implementing edit and delete functionality for each account, likely using modals triggered from buttons/icons on each account card.
    - Adding a search bar to filter the list of accounts.
    - Ensuring all necessary imports, state variables, and handler functions are updated or created.
    - Applying similar styling and animations.
    - Ensuring no selection functionality is present.
4.  **Review and Refine**: After making the changes, I will review the code to ensure it meets all the requirements and best practices.

Please provide the content of `src/pages/account-PREP.tsx` so I can proceed with the task.Okay, I understand. You want to update `src/pages/account-creation.tsx` to mirror the UI of `src/pages/merchant-creation.tsx`, but without the selection functionality.

Here's the plan:

1.  **Analyze `src/pages/merchant-creation.tsx`**: I've reviewed the provided code for `merchant-creation.tsx`. I'll use its structure, components (like `Card`, `Modal`, `Input`, `Button`), state management for modals (create, edit, delete), and animation patterns (`fadeInUp`, `scaleIn`) as a reference.
2.  **Analyze `src/pages/account-creation.tsx`**: I've also reviewed the provided code for `account-creation.tsx`. I see it currently uses a two-column layout with a form on one side and a table for listing accounts on the other.
3.  **Adapt `account-creation.tsx`**: I will now proceed to modify `account-creation.tsx`. This will involve:
    - Changing the main layout to a single-column structure similar to `merchant-creation.tsx`.
    - Removing the inline account creation form.
    - Adding a "New Account" button that will trigger a modal for creating accounts.
    - Replacing the `Table` component with a `Card`-based list for displaying accounts. Each account will be represented by a card-like item.
    - Implementing "Edit" and "Delete" actions for each account item, likely using icons within each item that trigger respective modals. The existing edit and delete modals can be reused with minor adjustments.
    - Keeping the search bar functionality for filtering accounts.
    - Ensuring all necessary imports from `@heroui` and other libraries are present and unused ones are removed.
    - Updating state variables and handler functions to support the new UI flow (e.g., managing modal visibility for create, edit, delete).
    - Applying similar `framer-motion` animations for a consistent user experience.
    - **Crucially, I will ensure that there is no selection behavior (like highlighting an account on click) as requested.**

I will now generate the code for the updated `src/pages/account-creation.tsx`.

<write_to_file>
<path>src/pages/account-creation.tsx</path>
<content>
import { useState, useMemo, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
MagnifyingGlassIcon,
PlusIcon,
PencilSquareIcon,
TrashIcon,
BanknotesIcon, // Keep for consistency if desired, or remove if not used in new design
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
Modal,
ModalContent,
ModalHeader,
ModalBody,
ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select"; // Keep for create/edit modals
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";
import clsx from "clsx";
import { title as pageTitleStyle } from "@/components/primitives";
import { useDefaultContext } from "@/contexts/default-context";
import type { Account } from "@/types";

const fadeInUp = {
hidden: { opacity: 0, y: 20 },
visible: (i = 1) => ({
opacity: 1,
y: 0,
transition: { duration: 0.4, delay: 0.2 \* i, ease: "easeOut" },
}),
};

const scaleIn = {
hidden: { opacity: 0, scale: 0.9 },
visible: {
opacity: 1,
scale: 1,
transition: { duration: 0.3, ease: "backOut" },
},
};

export default function AccountManagementPage() {
const {
selectedMerchant,
createAccount,
getAccounts,
deleteAccount,
updateAccount,
} = useDefaultContext();

const [accounts, setAccounts] = useState<Account[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");

// Create Modal State
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
const [newAccountName, setNewAccountName] = useState("");
const [newAccountType, setNewAccountType] = useState<
"DEBIT_NORMAL" | "CREDIT_NORMAL"

> ("DEBIT_NORMAL");
> const [newAccountCurrency, setNewAccountCurrency] = useState("USD");
> const [createError, setCreateError] = useState("");
> const [isCreatingAccount, setIsCreatingAccount] = useState(false);

// Edit Modal State
const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
const [editName, setEditName] = useState("");
// Assuming type and currency are not editable for existing accounts based on original edit logic
// If they are, add state for editAccountType and editAccountCurrency
const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

// Delete Modal State
const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
const [isDeletingAccount, setIsDeletingAccount] = useState(false);

useEffect(() => {
const fetchAccounts = async () => {
if (!selectedMerchant) {
setAccounts([]); // Clear accounts if no merchant is selected
return;
}
setIsLoading(true);
try {
const data = await getAccounts();
setAccounts(data);
} catch (error) {
addToast({
title: "Failed to fetch accounts",
description:
error instanceof Error
? error.message
: "An unknown error occurred.",
variant: "flat",
});
setAccounts([]); // Clear accounts on error
} finally {
setIsLoading(false);
}
};

    fetchAccounts();

}, [selectedMerchant, getAccounts]);

const filteredAccounts = useMemo(
() =>
accounts.filter((acc) =>
acc.account_name.toLowerCase().includes(searchTerm.toLowerCase()),
),
[accounts, searchTerm],
);

const handleCreateAccount = async () => {
if (!newAccountName.trim()) {
setCreateError("Account name is required");
return;
}
if (!selectedMerchant) {
addToast({
title: "Please select a merchant first",
variant: "flat",
});
return;
}

    setIsCreatingAccount(true);
    setCreateError("");
    try {
      await createAccount({
        account_name: newAccountName.trim(),
        account_type: newAccountType,
        currency: newAccountCurrency,
      });
      setNewAccountName("");
      setNewAccountType("DEBIT_NORMAL");
      setNewAccountCurrency("USD");
      setIsCreateDialogOpen(false);
      addToast({ title: "Account created successfully" });
      // Refetch accounts
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setCreateError(errorMessage);
      addToast({
        title: "Failed to create account",
        description: errorMessage,
        variant: "flat",
      });
    } finally {
      setIsCreatingAccount(false);
    }

};

const openEditModal = (account: Account) => {
setAccountToEdit(account);
setEditName(account.account_name);
// If type and currency are editable, set them here as well
// setEditAccountType(account.account_type);
// setEditAccountCurrency(account.currency);
};

const handleUpdateAccount = async () => {
if (!accountToEdit || !editName.trim() || !selectedMerchant) return;
setIsUpdatingAccount(true);
try {
await updateAccount(
selectedMerchant, // merchant_id
accountToEdit.account_id,
{
account_name: editName.trim(),
// Include other fields if they are editable
// account_type: editAccountType,
// currency: editAccountCurrency,
},
);
setAccountToEdit(null);
addToast({ title: "Account updated successfully" });
// Refetch accounts
const data = await getAccounts();
setAccounts(data);
} catch (error) {
addToast({
title: "Failed to update account",
description:
error instanceof Error ? error.message : "An unknown error occurred.",
variant: "flat",
});
} finally {
setIsUpdatingAccount(false);
}
};

const openDeleteConfirmModal = (account: Account) => {
setAccountToDelete(account);
};

const handleDeleteAccount = async () => {
if (!accountToDelete) return;
setIsDeletingAccount(true);
try {
await deleteAccount(accountToDelete.account_id);
addToast({ title: "Account deleted successfully" });
setAccountToDelete(null);
// Refetch accounts
const data = await getAccounts();
setAccounts(data);
} catch (error) {
addToast({
title: "Failed to delete account",
description:
error instanceof Error ? error.message : "An unknown error occurred.",
variant: "flat",
});
} finally {
setIsDeletingAccount(false);
}
};

return (
<>

<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
<motion.div
variants={fadeInUp}
initial="hidden"
animate="visible"
className="text-center mb-12 sm:mb-16" >
<h1
className={clsx(
pageTitleStyle({ size: "lg", color: "primary" }),
"mb-2",
)} >
Account Management
</h1>
<p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
Manage your financial accounts. Add, edit, or remove accounts as
needed.
</p>
</motion.div>

        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardBody className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedMerchant
                    ? "Accounts"
                    : "Please select a merchant to view accounts"}
                </h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    <Input
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                      classNames={{ inputWrapper: "h-10" }}
                      disabled={!selectedMerchant}
                    />
                  </div>
                  <Button
                    color="primary"
                    onPress={() => setIsCreateDialogOpen(true)}
                    className="text-white flex-shrink-0"
                    startContent={<PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />}
                    isDisabled={!selectedMerchant}
                  >
                    New Account
                  </Button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {isLoading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading accounts...
                    </p>
                  </div>
                )}
                {!isLoading && !selectedMerchant && (
                  <div className="text-center py-8">
                    <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Please select a merchant to view and manage accounts.
                    </p>
                  </div>
                )}
                {!isLoading &&
                  selectedMerchant &&
                  filteredAccounts.length === 0 && (
                    <div className="text-center py-8">
                      <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm
                          ? "No accounts match your search."
                          : "No accounts yet for this merchant."}
                      </p>
                      <Button
                        onPress={() => setIsCreateDialogOpen(true)}
                        variant="light"
                        color="primary"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  )}
                {!isLoading &&
                  selectedMerchant &&
                  filteredAccounts.map((account, index) => (
                    <motion.div
                      key={account.account_id}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      exit="hidden"
                      className={clsx(
                        "flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors",
                        "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50", // No selection style
                      )}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full">
                          <BanknotesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate" title={account.account_name}>
                            {account.account_name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {account.account_id} &bull; Type:{" "}
                            {account.account_type === "DEBIT_NORMAL"
                              ? "Debit"
                              : "Credit"}{" "}
                            &bull; Currency: {account.currency}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Balance: {account.available_balance}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                        <Tooltip content="Edit Account" placement="top">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                            onPress={() => openEditModal(account)}
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete Account" placement="top">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-500 hover:text-danger dark:text-gray-400 dark:hover:text-danger-400"
                            onPress={() => openDeleteConfirmModal(account)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Create Account Modal */}
      <Modal
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setNewAccountName("");
          setNewAccountType("DEBIT_NORMAL");
          setNewAccountCurrency("USD");
          setCreateError("");
        }}
        size="md"
      >
        <ModalContent>
          <ModalHeader>Create New Account</ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAccount();
            }}
          >
            <ModalBody className="space-y-4">
              <div>
                <label
                  htmlFor="new-account-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Account Name
                </label>
                <Input
                  id="new-account-name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Enter account name"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateAccount();
                  }}
                />
                {createError && (
                  <p className="text-red-500 text-xs mt-1">{createError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="new-account-type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Account Type
                </label>
                <Select
                  id="new-account-type"
                  aria-label="Account Type"
                  selectedKeys={[newAccountType]}
                  onChange={(e) =>
                    setNewAccountType(
                      e.target.value as "DEBIT_NORMAL" | "CREDIT_NORMAL",
                    )
                  }
                  disallowEmptySelection
                  className="w-full"
                >
                  <SelectItem key="DEBIT_NORMAL">Debit</SelectItem>
                  <SelectItem key="CREDIT_NORMAL">Credit</SelectItem>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="new-account-currency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Currency
                </label>
                <Select
                  id="new-account-currency"
                  aria-label="Currency"
                  selectedKeys={[newAccountCurrency]}
                  onChange={(e) => setNewAccountCurrency(e.target.value)}
                  disallowEmptySelection
                  className="w-full"
                >
                  <SelectItem key="USD">USD</SelectItem>
                  <SelectItem key="EUR">EUR</SelectItem>
                  <SelectItem key="GBP">GBP</SelectItem>
                  {/* Add more currencies as needed */}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setIsCreateDialogOpen(false);
                  setNewAccountName("");
                  setNewAccountType("DEBIT_NORMAL");
                  setNewAccountCurrency("USD");
                  setCreateError("");
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isCreatingAccount}
                disabled={!newAccountName.trim() || !selectedMerchant}
              >
                Create Account
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit Account Modal */}
      {accountToEdit && (
        <Modal
          isOpen={!!accountToEdit}
          onClose={() => setAccountToEdit(null)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>Edit Account</ModalHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAccount();
              }}
            >
              <ModalBody className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-account-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Account Name
                  </label>
                  <Input
                    id="edit-account-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter account name"
                    autoFocus
                  />
                </div>
                {/* Add fields for editing type and currency if needed */}
                {/*
                <div>
                  <label htmlFor="edit-account-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                  <Select
                    id="edit-account-type"
                    aria-label="Account Type"
                    selectedKeys={[editAccountType]} // Assuming you add editAccountType state
                    onChange={(e) => setEditAccountType(e.target.value as "DEBIT_NORMAL" | "CREDIT_NORMAL")}
                    disallowEmptySelection
                    className="w-full"
                  >
                    <SelectItem key="DEBIT_NORMAL">Debit</SelectItem>
                    <SelectItem key="CREDIT_NORMAL">Credit</SelectItem>
                  </Select>
                </div>
                <div>
                  <label htmlFor="edit-account-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <Select
                    id="edit-account-currency"
                    aria-label="Currency"
                    selectedKeys={[editAccountCurrency]} // Assuming you add editAccountCurrency state
                    onChange={(e) => setEditAccountCurrency(e.target.value)}
                    disallowEmptySelection
                    className="w-full"
                  >
                    <SelectItem key="USD">USD</SelectItem>
                    <SelectItem key="EUR">EUR</SelectItem>
                    <SelectItem key="GBP">GBP</SelectItem>
                  </Select>
                </div>
                */}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => setAccountToEdit(null)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isUpdatingAccount}
                  disabled={!editName.trim()}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {accountToDelete && (
        <Modal
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalBody>
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete account "
                {accountToDelete.account_name}"? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setAccountToDelete(null)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteAccount}
                isLoading={isDeletingAccount}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>

);
}
