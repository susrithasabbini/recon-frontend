import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
import api from "@/config/axios";

import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { Tooltip } from "@heroui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import type { Account, ReconRule } from "@/types";

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

export default function RulesMappingPage() {
  const { selectedMerchant, getAccounts } = useDefaultContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [mappings, setMappings] = useState<ReconRule[]>([]);
  const [newMapping, setNewMapping] = useState({ source: "", target: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mappingToDelete, setMappingToDelete] = useState<ReconRule | null>(
    null
  );
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch accounts when merchant is selected
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedMerchant) return;

      setLoading(true);
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        addToast({
          title: "Failed to fetch accounts",
          variant: "flat",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [selectedMerchant, getAccounts]);

  // Fetch existing mappings
  useEffect(() => {
    const fetchMappings = async () => {
      if (!selectedMerchant) return;

      setLoading(true);
      try {
        const { data } = await api.get<ReconRule[]>(
          `/merchants/${selectedMerchant}/recon-rules`
        );
        setMappings(data);
      } catch (error) {
        addToast({
          title: "Failed to fetch mappings",
          variant: "flat",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [selectedMerchant]);

  // Handlers
  const handleAddMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant) {
      addToast({
        title: "Please select a merchant first",
        variant: "flat",
      });
      return;
    }

    if (!newMapping.source || !newMapping.target) {
      setError("Please select both source and target accounts");
      return;
    }

    if (newMapping.source === newMapping.target) {
      setError("Source and target accounts cannot be the same");
      return;
    }

    const mappingExists = mappings.some(
      (m) =>
        (m.account_one_id === newMapping.source &&
          m.account_two_id === newMapping.target) ||
        (m.account_one_id === newMapping.target &&
          m.account_two_id === newMapping.source)
    );

    if (mappingExists) {
      setError("This mapping already exists");
      return;
    }

    try {
      setLoading(true);
      await api.post<ReconRule>(`/merchants/${selectedMerchant}/recon-rules`, {
        account_one_id: newMapping.source,
        account_two_id: newMapping.target,
      });

      // Fetch updated mappings after successful creation
      const { data: updatedMappings } = await api.get<ReconRule[]>(
        `/merchants/${selectedMerchant}/recon-rules`
      );
      setMappings(updatedMappings);

      // Reset form
      setNewMapping({ source: "", target: "" });
      setError("");
      addToast({
        title: "Mapping created successfully",
      });
    } catch (error) {
      addToast({
        title: "Failed to create mapping",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (mapping: ReconRule) => {
    setMappingToDelete(mapping);
  };

  const confirmDelete = async () => {
    if (!mappingToDelete) return;
    setLoading(true);
    try {
      await api.delete(
        `/merchants/${selectedMerchant}/recon-rules/${mappingToDelete.id}`
      );

      // Fetch updated mappings after successful deletion
      const { data: updatedMappings } = await api.get<ReconRule[]>(
        `/merchants/${selectedMerchant}/recon-rules`
      );
      setMappings(updatedMappings);

      setMappingToDelete(null);
      addToast({
        title: "Mapping deleted successfully",
      });
    } catch (error) {
      addToast({
        title: "Failed to delete mapping",
        variant: "flat",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter available target accounts based on selected source
  const getAvailableTargetAccounts = (sourceId: string) => {
    return accounts.filter((acc) => acc.account_id !== sourceId);
  };

  const pages = Math.max(1, Math.ceil(mappings.length / rowsPerPage));
  const items = mappings.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
              title({ size: "md", color: "blue" }),
              "leading-6 py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            )}
          >
            Rules Mapping
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium"
          >
            Define how data flows between accounts and set up expectations for
            automated reconciliation.
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
                    <ArrowsRightLeftIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Add Mapping
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form
                    onSubmit={handleAddMapping}
                    className="space-y-4 sm:space-y-6"
                    aria-label="Add new mapping"
                  >
                    <Select
                      label="Source Account"
                      aria-label="Source Account"
                      placeholder="Select source"
                      selectedKeys={[newMapping.source]}
                      onSelectionChange={(keys: any) => {
                        const val = Array.from(keys)[0] as string;
                        setNewMapping((prev) => ({
                          ...prev,
                          source: val,
                          target: "",
                        }));
                        setError("");
                      }}
                      className="w-full"
                      disallowEmptySelection
                      isDisabled={loading}
                      data-testid="source-account-select"
                    >
                      {accounts.map((acc) => (
                        <SelectItem key={acc.account_id}>
                          {acc.account_name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Target Account"
                      placeholder="Select target"
                      aria-label="Target Account"
                      selectedKeys={[newMapping.target]}
                      onSelectionChange={(keys: any) => {
                        const val = Array.from(keys)[0] as string;
                        setNewMapping((prev) => ({ ...prev, target: val }));
                        setError("");
                      }}
                      className="w-full"
                      isDisabled={!newMapping.source || loading}
                      disallowEmptySelection
                      data-testid="target-account-select"
                    >
                      {getAvailableTargetAccounts(newMapping.source).map(
                        (acc) => (
                          <SelectItem key={acc.account_id}>
                            {acc.account_name}
                          </SelectItem>
                        )
                      )}
                    </Select>
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
                      isDisabled={
                        !newMapping.source || !newMapping.target || loading
                      }
                      isLoading={loading}
                      data-testid="add-mapping-button"
                    >
                      Add Mapping
                    </Button>
                  </form>
                </CardBody>
                {mappings.length > 0 && (
                  <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
                    Total mappings: {mappings.length}
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </aside>

          {/* MAPPING LIST */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full">
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Current Mappings
              </h2>
            </motion.div>
            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full">
              <AnimatePresence mode="wait">
                {loading && selectedMerchant ? (
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
                ) : !selectedMerchant || mappings.length === 0 ? (
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
                      <ArrowsRightLeftIcon className="h-12 w-12 text-gray-400" />
                    </motion.div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                      {!selectedMerchant
                        ? "Please select a merchant first"
                        : "No mappings found"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {!selectedMerchant
                        ? "Select a merchant to view and manage mappings"
                        : "Start by adding your first mapping using the form"}
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
                        aria-label="Mapping table"
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
                      >
                        <TableHeader>
                          <TableColumn>Source</TableColumn>
                          <TableColumn>Target</TableColumn>
                          <TableColumn align="center">Actions</TableColumn>
                        </TableHeader>
                        <TableBody items={items} emptyContent={<></>}>
                          {(m) => (
                            <TableRow key={m.id}>
                              <TableCell className="whitespace-nowrap text-primary font-medium py-0.5">
                                {m.accountOne.account_name}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-secondary font-medium py-0.5">
                                {m.accountTwo.account_name}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-center py-0.5">
                                <div className="flex gap-2 justify-center">
                                  <Tooltip content="Delete" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="danger"
                                      size="sm" // Added size="sm"
                                      onPress={() => handleDelete(m)}
                                      aria-label="Delete"
                                      data-testid="delete-button"
                                    >
                                      <TrashIcon className="w-4 h-4" />{" "}
                                      {/* Changed w-5 h-5 to w-4 h-4 */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={mappingToDelete !== null}
        onClose={() => setMappingToDelete(null)}
        size="sm"
        aria-label="Delete mapping confirmation"
      >
        <ModalContent as={motion.div}>
          <ModalHeader>Delete Mapping</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete the mapping between{" "}
              <span className="font-medium">
                {mappingToDelete?.accountOne.account_name}
              </span>{" "}
              and{" "}
              <span className="font-medium">
                {mappingToDelete?.accountTwo.account_name}
              </span>
              ? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setMappingToDelete(null)}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDelete}
              data-testid="confirm-delete-button"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
