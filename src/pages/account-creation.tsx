import DefaultLayout from "@/layouts/default";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import {
  PlusIcon,
  MinusIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";
import clsx from "clsx";
import { title } from "@/components/primitives";

interface Account {
  name: string;
  type: "debit" | "credit";
}

/**
 * Motion variants for reusable animations
 */
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "backOut" },
  },
};

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<"debit" | "credit">("debit");
  const [formTouched, setFormTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  /**
   * Derived state
   */
  const filteredAccounts = useMemo(
    () =>
      accounts.filter((acc) =>
        acc.name.toLowerCase().includes(query.toLowerCase())
      ),
    [accounts, query]
  );

  const pages = Math.max(1, Math.ceil(filteredAccounts.length / rowsPerPage));
  const items = filteredAccounts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /**
   * Handlers
   */
  function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    setFormTouched(true);
    if (!name.trim()) return;
    setAccounts((prev) => [...prev, { name: name.trim(), type }]);
    setName("");
    setType("debit");
    setPage(1);
    setFormTouched(false);
    addToast({ title: "Account added successfully" });
  }

  function handleDeleteAccount(account: Account) {
    setAccountToDelete(account);
  }

  function confirmDelete() {
    if (!accountToDelete) return;
    setAccounts((prev) =>
      prev.filter(
        (acc) =>
          !(
            acc.name === accountToDelete.name &&
            acc.type === accountToDelete.type
          )
      )
    );
    setAccountToDelete(null);
    if (items.length === 1 && page > 1) setPage(page - 1);
    addToast({ title: "Account deleted" });
  }

  function handleEditAccount(account: Account) {
    setAccountToEdit(account);
    setEditName(account.name);
    setEditType(account.type);
  }

  function confirmEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || !accountToEdit) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === accountToEdit.name && acc.type === accountToEdit.type
          ? { name: editName.trim(), type: editType }
          : acc
      )
    );
    setAccountToEdit(null);
    addToast({ title: "Account updated successfully" });
  }

  /**
   * Skeleton loading demo (optional)
   */
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const isNameValid = name.trim().length > 0;
  const nameError =
    formTouched && !isNameValid ? "Account name is required" : "";

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="container mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-4xl rounded-3xl px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 flex flex-col items-center gap-2 text-center"
        >
          <span className="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 p-2 shadow">
            <BanknotesIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </span>
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className={clsx(
              title({ size: "md", color: "blue" }),
              "leading-6 py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            )}
          >
            Account Management
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium"
          >
            Easily create, view, and manage your reconciliation accounts. Keep
            your financial records organized and up to date.
          </motion.p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full mt-10">
          {/* FORM */}
          <aside className="lg:col-span-4 w-full max-w-full">
            <motion.div variants={scaleIn} initial="hidden" animate="visible">
              <Card className="shadow-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full">
                <CardHeader className="flex items-center gap-2 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-primary/5 dark:bg-primary/10 rounded-t-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    New Account
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form
                    onSubmit={handleAddAccount}
                    className="space-y-4 sm:space-y-6"
                    aria-label="Add new account"
                  >
                    <div>
                      <Input
                        aria-label="Account Name"
                        placeholder="Enter account name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setFormTouched(true);
                        }}
                        onBlur={() => setFormTouched(true)}
                        required
                        classNames={{
                          input: "text-base",
                          inputWrapper: "h-10 sm:h-12",
                        }}
                        autoFocus
                      />
                      <p className="text-xs text-red-500 mt-1 min-h-[1.25rem]">
                        {nameError}
                      </p>
                    </div>
                    <Select
                      aria-label="Account Type"
                      selectedKeys={[type]}
                      onChange={(e) =>
                        setType(e.target.value as "debit" | "credit")
                      }
                      disallowEmptySelection
                      className="w-full"
                    >
                      <SelectItem key="debit">Debit</SelectItem>
                      <SelectItem key="credit">Credit</SelectItem>
                    </Select>
                    <Button
                      type="submit"
                      color="primary"
                      className="w-full h-10 sm:h-12 text-base font-medium"
                      disabled={!isNameValid}
                      aria-disabled={!isNameValid}
                    >
                      <PlusIcon className="h-5 w-5 mr-2" /> Add Account
                    </Button>
                  </form>
                </CardBody>
                {accounts.length > 0 && (
                  <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
                    Total accounts: {accounts.length}
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </aside>

          {/* ACCOUNT LIST */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full">
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Account List
              </h2>
              <Input
                aria-label="Search"
                startContent={
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                }
                placeholder="Search accounts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:max-w-xs"
                classNames={{ input: "text-sm", inputWrapper: "h-9" }}
              />
            </motion.div>

            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-8 space-y-3 sm:space-y-4"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-800 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    ))}
                  </motion.div>
                ) : filteredAccounts.length > 0 ? (
                  <motion.div
                    key="table"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="overflow-x-auto w-full">
                      <Table
                        aria-label="Accounts table"
                        isStriped
                        selectionMode="none"
                        classNames={{
                          wrapper: "min-w-full",
                          th: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium sticky top-0 z-10",
                        }}
                        bottomContent={
                          <div className="flex w-full justify-center gap-2 py-4">
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => setPage((p) => Math.max(p - 1, 1))}
                              isDisabled={page === 1}
                              className="min-w-[100px]"
                            >
                              Previous
                            </Button>
                            {Array.from({ length: pages }, (_, i) => i + 1).map(
                              (p) => (
                                <Button
                                  key={p}
                                  size="sm"
                                  variant={p === page ? "flat" : "light"}
                                  className={`min-w-[40px] ${p === page ? "bg-primary text-primary-foreground" : ""}`}
                                  onPress={() => setPage(p)}
                                >
                                  {p}
                                </Button>
                              )
                            )}
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                setPage((p) => Math.min(p + 1, pages))
                              }
                              isDisabled={page === pages}
                              className="min-w-[100px]"
                            >
                              Next
                            </Button>
                          </div>
                        }
                      >
                        <TableHeader>
                          <TableColumn align="start">Account Name</TableColumn>
                          <TableColumn align="center">Account Type</TableColumn>
                          <TableColumn align="center" width={140}>
                            Actions
                          </TableColumn>
                        </TableHeader>
                        <TableBody items={items} emptyContent={<></>}>
                          {(acc: Account) => (
                            <TableRow
                              key={acc.name + acc.type}
                              className="focus:outline-primary"
                            >
                              <TableCell className="font-medium">
                                {acc.name}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${acc.type === "debit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                  {acc.type === "debit" ? (
                                    <PlusIcon className="h-3 w-3" />
                                  ) : (
                                    <MinusIcon className="h-3 w-3" />
                                  )}
                                  {acc.type === "debit" ? "Debit" : "Credit"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <Tooltip content="Edit" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="primary"
                                      size="sm"
                                      onPress={() => handleEditAccount(acc)}
                                      className="text-primary-500 hover:text-primary-600 focus:outline focus:outline-2 focus:outline-primary"
                                      aria-label={`Edit account ${acc.name}`}
                                    >
                                      <PencilSquareIcon className="h-4 w-4" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip content="Delete" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="danger"
                                      size="sm"
                                      onPress={() => handleDeleteAccount(acc)}
                                      className="text-danger-500 hover:text-danger-600 focus:outline focus:outline-2 focus:outline-danger"
                                      aria-label={`Delete account ${acc.name}`}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex flex-col items-center gap-3 py-14 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                    >
                      <BanknotesIcon className="h-12 w-12 text-gray-400" />
                    </motion.div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                      No accounts found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Start by adding your first account using the form
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </main>
        </div>
      </motion.section>

      {/* DELETE MODAL */}
      <Modal
        isOpen={accountToDelete !== null}
        onClose={() => setAccountToDelete(null)}
        size="sm"
        aria-label="Delete account confirmation"
      >
        <ModalContent as={motion.div}>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{accountToDelete?.name}</span>? This
              action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setAccountToDelete(null)}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={accountToEdit !== null}
        onClose={() => setAccountToEdit(null)}
        size="sm"
        aria-label="Edit account"
      >
        <ModalContent as={motion.form} onSubmit={confirmEdit}>
          <ModalHeader>Edit Account</ModalHeader>
          <ModalBody className="space-y-5">
            <Input
              aria-label="Edit Account Name"
              placeholder="Account Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              autoFocus
            />
            <Select
              aria-label="Edit Account Type"
              selectedKeys={[editType]}
              onChange={(e) =>
                setEditType(e.target.value as "debit" | "credit")
              }
            >
              <SelectItem key="debit">Debit</SelectItem>
              <SelectItem key="credit">Credit</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setAccountToEdit(null)}
              type="button"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
