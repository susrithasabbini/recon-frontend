import { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
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
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { useDefaultContext } from "@/contexts/default-context";
import type { Merchant } from "@/types";

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

export default function MerchantManagementPage() {
  const { merchants, addMerchant, isLoading, updateMerchant } =
    useDefaultContext();
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [merchantToEdit, setMerchantToEdit] = useState<Merchant | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  /**
   * Derived state
   */
  const filteredMerchants = useMemo(
    () =>
      merchants.filter((merch) =>
        merch.merchant_name.toLowerCase().includes(query.toLowerCase()),
      ),
    [merchants, query],
  );

  const pages = Math.max(1, Math.ceil(filteredMerchants.length / rowsPerPage));
  const items = filteredMerchants.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  /**
   * Handlers
   */
  async function handleAddMerchant(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Merchant name is required");
      return;
    }

    setLoading(true);
    try {
      await addMerchant(name.trim());
      // Reset form
      setName("");
      setPage(1);
      setError("");

      addToast({
        title: "Merchant created successfully",
      });
    } catch (error) {
      addToast({
        title: "Failed to create merchant",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEditMerchant(merchant: Merchant) {
    setMerchantToEdit(merchant);
    setEditName(merchant.merchant_name);
  }

  async function confirmEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || !merchantToEdit) {
      addToast({
        title: "Error",
        description: "Missing required information to update merchant.",
        variant: "flat",
      });
      return;
    }

    setLoading(true);
    try {
      await updateMerchant(merchantToEdit.merchant_id, {
        merchant_name: editName.trim(),
        merchant_code: merchantToEdit.merchant_code,
      });
      setMerchantToEdit(null);
      addToast({
        title: "Merchant updated successfully",
      });
    } catch (error) {
      addToast({
        title: "Failed to update merchant",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className={clsx(
              title({ size: "md", color: "primary" }), // Changed color to "primary"
              "leading-6 py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
            )}
          >
            Merchant Management
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium"
          >
            Create and manage your merchants. Set up new merchants and configure
            their settings.
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
                    <BuildingOfficeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    New Merchant
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form
                    onSubmit={handleAddMerchant}
                    className="space-y-4 sm:space-y-6"
                    aria-label="Add new merchant"
                  >
                    <div>
                      <Input
                        aria-label="Merchant Name"
                        placeholder="Enter merchant name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError("");
                        }}
                        classNames={{
                          input: "text-base",
                          inputWrapper:
                            "h-10 sm:h-12 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
                        }}
                        autoFocus
                        data-testid="merchant-name-input"
                      />
                    </div>

                    {error && (
                      <p
                        className="text-red-500 text-sm mt-2"
                        data-testid="error-message"
                      >
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      color="primary"
                      className="w-full h-10 sm:h-12 text-base font-medium"
                      data-testid="add-merchant-button"
                      isLoading={loading}
                    >
                      Add Merchant
                    </Button>
                  </form>
                </CardBody>
                {merchants.length > 0 && (
                  <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
                    Total merchants: {merchants.length}
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </aside>

          {/* MERCHANT LIST */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full">
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Merchant List
              </h2>
              <Input
                aria-label="Search"
                startContent={
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                }
                placeholder="Search merchants..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:max-w-xs"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "h-9 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
                }}
                data-testid="search-input"
              />
            </motion.div>

            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-8 space-y-3 sm:space-y-4"
                    data-testid="loading-skeleton"
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
                ) : merchants.length === 0 ? (
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
                      <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                    </motion.div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                      No merchants found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Start by adding your first merchant using the form
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="overflow-x-auto w-full">
                      <Table
                        aria-label="Merchants table"
                        isStriped
                        selectionMode="none"
                        classNames={{
                          wrapper: "min-w-full",
                          th: "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium sticky top-0 z-10",
                        }}
                        bottomContent={
                          pages > 1 ? (
                            <div className="flex w-full justify-center gap-2 py-4">
                              <Pagination
                                total={pages}
                                initialPage={page}
                                onChange={(newPage) => setPage(newPage)}
                                showControls
                              />
                            </div>
                          ) : null
                        }
                        data-testid="merchants-table"
                      >
                        <TableHeader>
                          <TableColumn align="start">Merchant Name</TableColumn>
                          <TableColumn align="center" width={100}>
                            Actions
                          </TableColumn>
                        </TableHeader>
                        <TableBody items={items} emptyContent={<></>}>
                          {(merch: Merchant) => (
                            <TableRow
                              key={merch.merchant_id}
                              className="focus:outline-primary"
                            >
                              <TableCell className="font-medium py-0.5">
                                {merch.merchant_name}
                              </TableCell>
                              <TableCell className="py-0.5">
                                <div className="flex gap-2 justify-center">
                                  <Tooltip content="Edit" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="primary"
                                      size="sm"
                                      onPress={() => handleEditMerchant(merch)}
                                      className="text-primary-500 hover:text-primary-600 focus:outline focus:outline-2 focus:outline-primary"
                                      aria-label={`Edit merchant ${merch.merchant_name}`}
                                      data-testid="edit-button"
                                    >
                                      <PencilSquareIcon className="h-4 w-4" />
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
                )}
              </AnimatePresence>
            </Card>
          </main>
        </div>
      </motion.section>

      {/* EDIT MODAL */}
      <Modal
        isOpen={merchantToEdit !== null}
        onClose={() => setMerchantToEdit(null)}
        size="sm"
        aria-label="Edit merchant"
      >
        <ModalContent as={motion.form} onSubmit={confirmEdit}>
          <ModalHeader>Edit Merchant</ModalHeader>
          <ModalBody className="space-y-5">
            <Input
              aria-label="Edit Merchant Name"
              placeholder="Merchant Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              autoFocus
              data-testid="edit-name-input"
              classNames={{
                inputWrapper:
                  "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setMerchantToEdit(null)}
              type="button"
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              data-testid="save-edit-button"
              isLoading={loading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
