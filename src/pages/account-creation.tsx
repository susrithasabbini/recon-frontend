import type { Account } from "@/types";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BanknotesIcon, // Keep for consistency if desired, or remove if not used in new design
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 * i, ease: "easeOut" },
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
  >("DEBIT_NORMAL");
  const [newAccountCurrency, setNewAccountCurrency] = useState("USD");
  const [newInitialBalance, setNewInitialBalance] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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
        initial_balance: parseFloat(newInitialBalance) || 0,
      });
      setNewAccountName("");
      setNewAccountType("DEBIT_NORMAL");
      setNewAccountCurrency("USD");
      setNewInitialBalance("");
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
          animate="visible"
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          variants={fadeInUp}
        >
          <h1
            className={clsx(
              pageTitleStyle({ size: "lg", color: "primary" }),
              "mb-2",
            )}
          >
            Account Management
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Create and manage your accounts here.
          </p>
        </motion.div>

        <motion.div animate="visible" initial="hidden" variants={scaleIn}>
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
                      className="pl-10 w-full"
                      classNames={{ inputWrapper: "h-10" }}
                      disabled={!selectedMerchant}
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    aria-disabled={!selectedMerchant}
                    className="text-white flex-shrink-0"
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />}
                    onPress={() => setIsCreateDialogOpen(true)}
                  >
                    New Account
                  </Button>
                </div>
              </div>

              <div>
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
                        color="primary"
                        variant="light"
                        onPress={() => setIsCreateDialogOpen(true)}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  )}
                {!isLoading &&
                  selectedMerchant &&
                  filteredAccounts.length > 0 && (
                    <Table
                      aria-label="Accounts table"
                      className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <TableHeader>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Account Name
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Currency
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Expected Balance
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Posted Balance
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Variance
                        </TableColumn>
                        <TableColumn className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </TableColumn>
                      </TableHeader>
                      <TableBody
                        emptyContent={
                          <div className="text-center p-4">
                            No accounts to display.
                          </div>
                        }
                        items={filteredAccounts}
                      >
                        {(account) => (
                          <TableRow
                            key={account.account_id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full">
                                  <BanknotesIcon className="w-5 h-5 text-primary" />
                                </div>
                                <span
                                  className="truncate"
                                  title={account.account_name}
                                >
                                  {account.account_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {account.account_type === "DEBIT_NORMAL"
                                ? "Debit"
                                : "Credit"}
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {account.currency}
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {account.pending_balance}
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {account.posted_balance}
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {parseInt(account.pending_balance) -
                                parseInt(account.posted_balance)}
                            </TableCell>
                            <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                                <Tooltip content="Edit Account" placement="top">
                                  <Button
                                    isIconOnly
                                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                                    size="sm"
                                    variant="light"
                                    onPress={() => openEditModal(account)}
                                  >
                                    <PencilSquareIcon className="w-5 h-5" />
                                  </Button>
                                </Tooltip>
                                <Tooltip
                                  content="Delete Account"
                                  placement="top"
                                >
                                  <Button
                                    isIconOnly
                                    className="text-gray-500 hover:text-danger dark:text-gray-400 dark:hover:text-danger-400"
                                    size="sm"
                                    variant="light"
                                    onPress={() =>
                                      openDeleteConfirmModal(account)
                                    }
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </Button>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Create Account Modal */}
      <Modal
        isOpen={isCreateDialogOpen}
        size="md"
        onClose={() => {
          setIsCreateDialogOpen(false);
          setNewAccountName("");
          setNewAccountType("DEBIT_NORMAL");
          setNewAccountCurrency("USD");
          setNewInitialBalance("");
          setCreateError("");
        }}
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="new-account-name"
                >
                  Account Name
                </label>
                <Input
                  autoFocus
                  id="new-account-name"
                  placeholder="Enter account name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="new-account-type"
                >
                  Account Type
                </label>
                <Select
                  disallowEmptySelection
                  aria-label="Account Type"
                  className="w-full"
                  id="new-account-type"
                  selectedKeys={[newAccountType]}
                  onChange={(e) =>
                    setNewAccountType(
                      e.target.value as "DEBIT_NORMAL" | "CREDIT_NORMAL",
                    )
                  }
                >
                  <SelectItem
                    key="DEBIT_NORMAL"
                    aria-disabled={newAccountType === "DEBIT_NORMAL"}
                  >
                    Debit
                  </SelectItem>
                  <SelectItem
                    key="CREDIT_NORMAL"
                    aria-disabled={newAccountType === "CREDIT_NORMAL"}
                  >
                    Credit
                  </SelectItem>
                </Select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="new-account-currency"
                >
                  Currency
                </label>
                <Select
                  disallowEmptySelection
                  aria-label="Currency"
                  className="w-full"
                  id="new-account-currency"
                  selectedKeys={[newAccountCurrency]}
                  onChange={(e) => setNewAccountCurrency(e.target.value)}
                >
                  <SelectItem
                    key="USD"
                    aria-disabled={newAccountCurrency === "USD"}
                  >
                    USD
                  </SelectItem>
                  <SelectItem
                    key="EUR"
                    aria-disabled={newAccountCurrency === "EUR"}
                  >
                    EUR
                  </SelectItem>
                  <SelectItem
                    key="GBP"
                    aria-disabled={newAccountCurrency === "GBP"}
                  >
                    GBP
                  </SelectItem>
                  {/* Add more currencies as needed */}
                </Select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="new-initial-balance"
                >
                  Initial Balance
                </label>
                <Input
                  id="new-initial-balance"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={newInitialBalance}
                  onChange={(e) => setNewInitialBalance(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="light"
                onPress={() => {
                  setIsCreateDialogOpen(false);
                  setNewAccountName("");
                  setNewAccountType("DEBIT_NORMAL");
                  setNewAccountCurrency("USD");
                  setNewInitialBalance("");
                  setCreateError("");
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!newAccountName.trim() || !selectedMerchant}
                isLoading={isCreatingAccount}
                type="submit"
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
          size="md"
          onClose={() => setAccountToEdit(null)}
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="edit-account-name"
                  >
                    Account Name
                  </label>
                  <Input
                    autoFocus
                    id="edit-account-name"
                    placeholder="Enter account name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                {/* 
                  Note: The original account-creation.tsx only allowed editing the name.
                  If account_type and currency should also be editable, uncomment and adapt the following:
                */}
                {/*
                <div>
                  <label htmlFor="edit-account-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                  <Select
                    id="edit-account-type"
                    aria-label="Account Type"
                    // selectedKeys={[editAccountType]} // Requires state: const [editAccountType, setEditAccountType] = useState(accountToEdit.account_type);
                    // onChange={(e) => setEditAccountType(e.target.value as "DEBIT_NORMAL" | "CREDIT_NORMAL")}
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
                    // selectedKeys={[editAccountCurrency]} // Requires state: const [editAccountCurrency, setEditAccountCurrency] = useState(accountToEdit.currency);
                    // onChange={(e) => setEditAccountCurrency(e.target.value)}
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
                  type="button"
                  variant="light"
                  onPress={() => setAccountToEdit(null)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={!editName.trim()}
                  isLoading={isUpdatingAccount}
                  type="submit"
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
          size="md"
          onClose={() => setAccountToDelete(null)}
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
                type="button"
                variant="light"
                onPress={() => setAccountToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isDeletingAccount}
                onPress={handleDeleteAccount}
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
