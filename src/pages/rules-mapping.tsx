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

import { motion, AnimatePresence } from "framer-motion";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import DefaultLayout from "@/layouts/default";
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

// Mock account data (replace with real data as needed)
const mockAccounts = [
  { id: "1", name: "OMS Account" },
  { id: "2", name: "PSP Account" },
  { id: "3", name: "Bank Account" },
];

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

const skeletonVariants = {
  shimmer: {
    backgroundPosition: ["-200px 0", "200px 0"],
    transition: {
      repeat: Infinity,
      duration: 1.2,
      ease: "linear",
    },
  },
};

export default function RulesMappingPage() {
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Simulate loading on mount and after add/delete
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapping.source || !newMapping.target) return;
    if (newMapping.source === newMapping.target) {
      setError("Source and target accounts cannot be the same");
      return;
    }
    const mappingExists = mappings.some(
      (m) => m.source === newMapping.source && m.target === newMapping.target
    );
    if (mappingExists) {
      setError("This mapping already exists");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMappings([
        ...mappings,
        {
          id: Date.now().toString(),
          source: newMapping.source,
          target: newMapping.target,
        },
      ]);
      setNewMapping({ source: "", target: "" });
      setError("");
      setLoading(false);
      addToast({
        title: "Mapping created",
      });
    }, 700);
  };

  const handleDelete = (mapping: {
    id: string;
    source: string;
    target: string;
  }) => {
    setMappingToDelete(mapping);
  };

  const confirmDelete = () => {
    if (!mappingToDelete) return;
    setLoading(true);
    setTimeout(() => {
      setMappings((prev) => prev.filter((m) => m.id !== mappingToDelete.id));
      setMappingToDelete(null);
      setLoading(false);
      addToast({
        title: "Mapping deleted",
      });
    }, 700);
  };

  const handleEdit = (mapping: {
    id: string;
    source: string;
    target: string;
  }) => {
    setMappingToEdit(mapping);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappingToEdit) return;
    if (mappingToEdit.source === mappingToEdit.target) {
      setError("Source and target accounts cannot be the same");
      return;
    }
    const mappingExists = mappings.some(
      (m) =>
        m.id !== mappingToEdit.id &&
        m.source === mappingToEdit.source &&
        m.target === mappingToEdit.target
    );
    if (mappingExists) {
      setError("This mapping already exists");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMappings((prev) =>
        prev.map((m) =>
          m.id === mappingToEdit.id
            ? {
                ...m,
                source: mappingToEdit.source,
                target: mappingToEdit.target,
              }
            : m
        )
      );
      setMappingToEdit(null);
      setError("");
      setLoading(false);
      addToast({
        title: "Mapping updated successfully",
      });
    }, 700);
  };

  // Filter available target accounts based on selected source
  const getAvailableTargetAccounts = (sourceId: string) => {
    return mockAccounts.filter((acc) => acc.id !== sourceId);
  };

  // Skeleton loader for mapping list
  const MappingSkeleton = () => (
    <tbody>
      {[...Array(3)].map((_, i) => (
        <tr key={i}>
          {[...Array(3)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <motion.div
                className="h-5 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
                style={{ backgroundSize: "400px 100%" }}
                variants={skeletonVariants}
                animate="shimmer"
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const pages = Math.max(1, Math.ceil(mappings.length / rowsPerPage));
  const items = mappings.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
            <ArrowsRightLeftIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </span>
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
                      data-testid="source-account-select"
                    >
                      {mockAccounts.map((acc) => (
                        <SelectItem key={acc.id}>{acc.name}</SelectItem>
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
                      isDisabled={!newMapping.source}
                      disallowEmptySelection
                      data-testid="target-account-select"
                    >
                      {getAvailableTargetAccounts(newMapping.source).map(
                        (acc) => (
                          <SelectItem key={acc.id}>{acc.name}</SelectItem>
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
                      isDisabled={!newMapping.source || !newMapping.target}
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
                {loading ? (
                  <MappingSkeleton />
                ) : mappings.length === 0 ? (
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
                      No mappings found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Start by adding your first mapping using the form
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
                          <TableColumn>Source</TableColumn>
                          <TableColumn>Target</TableColumn>
                          <TableColumn align="center">Actions</TableColumn>
                        </TableHeader>
                        <TableBody items={items} emptyContent={<></>}>
                          {(m) => (
                            <TableRow key={m.id}>
                              <TableCell className="whitespace-nowrap text-primary font-medium">
                                {mockAccounts.find((a) => a.id === m.source)
                                  ?.name || "?"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-secondary font-medium">
                                {mockAccounts.find((a) => a.id === m.target)
                                  ?.name || "?"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-center">
                                <div className="flex gap-2 justify-center">
                                  <Tooltip content="Edit" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="warning"
                                      onPress={() => handleEdit(m)}
                                      aria-label="Edit"
                                    >
                                      <PencilSquareIcon className="w-5 h-5" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip content="Delete" placement="top">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      color="danger"
                                      onPress={() => handleDelete(m)}
                                      aria-label="Delete"
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </main>
        </div>
      </motion.section>

      {/* Edit Modal */}
      <Modal
        isOpen={mappingToEdit !== null}
        onClose={() => {
          setMappingToEdit(null);
          setError("");
        }}
        size="sm"
        aria-label="Edit mapping"
      >
        <ModalContent as={motion.form} onSubmit={handleSaveEdit}>
          <ModalHeader>Edit Mapping</ModalHeader>
          <ModalBody className="space-y-5">
            <Select
              label="Source Account"
              aria-label="Source Account"
              placeholder="Select source"
              selectedKeys={mappingToEdit?.source ? [mappingToEdit.source] : []}
              onSelectionChange={(keys: any) => {
                const val = Array.from(keys)[0] as string;
                setMappingToEdit((prev) =>
                  prev ? { ...prev, source: val, target: "" } : null
                );
                setError("");
              }}
              className="w-full"
              disallowEmptySelection
              data-testid="edit-source-select"
            >
              {mockAccounts.map((acc) => (
                <SelectItem key={acc.id}>{acc.name}</SelectItem>
              ))}
            </Select>
            <Select
              label="Target Account"
              placeholder="Select target"
              aria-label="Target Account"
              selectedKeys={mappingToEdit?.target ? [mappingToEdit.target] : []}
              onSelectionChange={(keys: any) => {
                const val = Array.from(keys)[0] as string;
                setMappingToEdit((prev) =>
                  prev ? { ...prev, target: val } : null
                );
                setError("");
              }}
              className="w-full"
              isDisabled={!mappingToEdit?.source}
              disallowEmptySelection
              data-testid="edit-target-select"
            >
              {getAvailableTargetAccounts(mappingToEdit?.source || "").map(
                (acc) => (
                  <SelectItem key={acc.id}>{acc.name}</SelectItem>
                )
              )}
            </Select>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setMappingToEdit(null);
                setError("");
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isDisabled={!mappingToEdit?.source || !mappingToEdit?.target}
              data-testid="save-edit-button"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
                {
                  mockAccounts.find((a) => a.id === mappingToDelete?.source)
                    ?.name
                }
              </span>{" "}
              and{" "}
              <span className="font-medium">
                {
                  mockAccounts.find((a) => a.id === mappingToDelete?.target)
                    ?.name
                }
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
    </DefaultLayout>
  );
}
