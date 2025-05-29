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
import {
  TrashIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
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
    null,
  );
  const [isCreateMappingModalOpen, setIsCreateMappingModalOpen] =
    useState(false);
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
          `/merchants/${selectedMerchant}/recon-rules`,
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
          m.account_two_id === newMapping.source),
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
        `/merchants/${selectedMerchant}/recon-rules`,
      );
      setMappings(updatedMappings);

      // Reset form
      setNewMapping({ source: "", target: "" });
      setError("");
      setIsCreateMappingModalOpen(false); // Close modal on success
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
        `/merchants/${selectedMerchant}/recon-rules/${mappingToDelete.id}`,
      );

      // Fetch updated mappings after successful deletion
      const { data: updatedMappings } = await api.get<ReconRule[]>(
        `/merchants/${selectedMerchant}/recon-rules`,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <h1 className={clsx(title({ size: "lg", color: "primary" }), "mb-2")}>
          Rules Mapping
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Create and manage your mappings here.
        </p>
      </motion.div>

      <motion.div variants={scaleIn} initial="hidden" animate="visible">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardBody className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Current Mappings
              </h3>
              <Button
                color="primary"
                onPress={() => setIsCreateMappingModalOpen(true)}
                className="text-white flex-shrink-0"
                startContent={<PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />}
              >
                New Mapping
              </Button>
            </div>

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
          </CardBody>
        </Card>
      </motion.div>

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

      {/* Add Mapping Modal */}
      <Modal
        isOpen={isCreateMappingModalOpen}
        onClose={() => {
          setIsCreateMappingModalOpen(false);
          setNewMapping({ source: "", target: "" }); // Reset form on close
          setError(""); // Clear errors on close
        }}
        size="md" // Or "lg" if the form is complex
        aria-label="Add new mapping"
      >
        <ModalContent as={motion.div}>
          <ModalHeader>Add New Mapping</ModalHeader>
          <form onSubmit={handleAddMapping} aria-label="Add new mapping form">
            <ModalBody className="space-y-4 sm:space-y-6">
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
                    target: "", // Reset target when source changes
                  }));
                  setError("");
                }}
                className="w-full"
                disallowEmptySelection
                isDisabled={loading}
                data-testid="source-account-select-modal"
                classNames={{
                  trigger:
                    "focus:ring-2 focus:ring-primary focus:border-primary",
                }}
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
                data-testid="target-account-select-modal"
                classNames={{
                  trigger:
                    "focus:ring-2 focus:ring-primary focus:border-primary",
                }}
              >
                {getAvailableTargetAccounts(newMapping.source).map((acc) => (
                  <SelectItem key={acc.account_id}>
                    {acc.account_name}
                  </SelectItem>
                ))}
              </Select>
              {error && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="error-message-modal"
                >
                  {error}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setIsCreateMappingModalOpen(false);
                  setNewMapping({ source: "", target: "" });
                  setError("");
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className="h-10 sm:h-12 text-base font-medium"
                isDisabled={!newMapping.source || !newMapping.target || loading}
                isLoading={loading}
                data-testid="add-mapping-button-modal"
              >
                Add Mapping
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
