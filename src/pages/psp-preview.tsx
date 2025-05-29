import { useState, useEffect, useMemo } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Card } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@heroui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@heroui/pagination";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useDefaultContext } from "@/contexts/default-context";
import api from "@/config/axios";
import type { Account, StagingEntry, AccountEntry } from "@/types";

interface FileUploadPageProps {
  accounts: Account[];
  selectedAccount: string;
  onAccountChange: (key: string) => void;
  componentId: string;
  isLoading: boolean;
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function PSPPreview({
  accounts,
  selectedAccount,
  onAccountChange,
  componentId,
  isLoading,
}: FileUploadPageProps) {
  const { selectedMerchant } = useDefaultContext();
  const [stagingPage, setStagingPage] = useState(1);
  const [stagingStatusFilter, setStagingStatusFilter] = useState<
    string | "all"
  >("all");
  const [entriesPage, setEntriesPage] = useState(1);
  const [entriesStatusFilter, setEntriesStatusFilter] = useState<
    string | "all"
  >("all");
  const [entriesReconStatusFilter, setEntriesReconStatusFilter] = useState<
    string | "all"
  >("all");
  const [excludeArchivedTransactions, setExcludeArchivedTransactions] =
    useState<boolean>(false);
  const [stagingEntries, setStagingEntries] = useState<StagingEntry[]>([]);
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([]);
  const rowsPerPage = 5;
  const [activeTabKey, setActiveTabKey] = useState<string>("processing");

  const [stagingSortDescriptor, setStagingSortDescriptor] =
    useState<SortDescriptor>({
      column: "created_at",
      direction: "descending",
    });
  const [entriesSortDescriptor, setEntriesSortDescriptor] =
    useState<SortDescriptor>({
      column: "created_at",
      direction: "descending",
    });

  useEffect(() => {
    onAccountChange("");
    setStagingEntries([]);
    setStagingStatusFilter("all");
    setStagingPage(1);
    setAccountEntries([]);
    setEntriesStatusFilter("all");
    setEntriesReconStatusFilter("all");
    setExcludeArchivedTransactions(false);
    setEntriesPage(1);
  }, [selectedMerchant, onAccountChange]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    const fetchStagingEntries = async () => {
      if (!selectedAccount || !selectedMerchant) return;
      try {
        const { data } = await api.get<StagingEntry[]>(
          `/accounts/${selectedAccount}/staging-entries`,
        );
        setStagingEntries(data);
      } catch (error) {
        console.error("Error fetching staging entries:", error);
      }
    };

    if (selectedAccount && selectedMerchant && activeTabKey === "processing") {
      fetchStagingEntries();
      intervalId = setInterval(fetchStagingEntries, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedAccount, selectedMerchant, activeTabKey]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    const fetchAccountEntries = async () => {
      if (!selectedAccount || !selectedMerchant) return;
      try {
        const { data } = await api.get<AccountEntry[]>(
          `/accounts/${selectedAccount}/entries`,
        );
        setAccountEntries(data);
      } catch (error) {
        console.error("Error fetching account entries:", error);
      }
    };

    if (selectedAccount && selectedMerchant && activeTabKey === "processed") {
      fetchAccountEntries();
      intervalId = setInterval(fetchAccountEntries, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedAccount, selectedMerchant, activeTabKey]);

  const filteredStagingEntries = useMemo(() => {
    let result = stagingEntries;
    if (stagingStatusFilter !== "all") {
      result = stagingEntries.filter(
        (entry) => entry.status === stagingStatusFilter,
      );
    }
    return result;
  }, [stagingEntries, stagingStatusFilter]);

  const stagingPages = Math.max(
    1,
    Math.ceil(filteredStagingEntries.length / rowsPerPage),
  );
  const stagingItems = useMemo(() => {
    let sortedEntries = [...filteredStagingEntries];
    if (stagingSortDescriptor.column) {
      sortedEntries.sort((a, b) => {
        const key = stagingSortDescriptor.column as keyof StagingEntry;
        const valA = a[key];
        const valB = b[key];
        let cmpResult = 0;
        if (valA == null && valB == null) cmpResult = 0;
        else if (valA == null) cmpResult = -1;
        else if (valB == null) cmpResult = 1;
        else if (key === "created_at" || key === "effective_date") {
          cmpResult =
            new Date(valA as string).getTime() <
            new Date(valB as string).getTime()
              ? -1
              : 1;
        } else {
          const numA = parseFloat(valA as string);
          const numB = parseFloat(valB as string);
          if (!isNaN(numA) && !isNaN(numB)) cmpResult = numA < numB ? -1 : 1;
          else cmpResult = (valA as string).localeCompare(valB as string);
        }
        return stagingSortDescriptor.direction === "descending"
          ? -cmpResult
          : cmpResult;
      });
    }
    return sortedEntries.slice(
      (stagingPage - 1) * rowsPerPage,
      stagingPage * rowsPerPage,
    );
  }, [filteredStagingEntries, stagingPage, rowsPerPage, stagingSortDescriptor]);

  const filteredAccountEntries = useMemo(() => {
    return accountEntries.filter((entry) => {
      const entryStatusMatch =
        entriesStatusFilter === "all" || entry.status === entriesStatusFilter;
      let reconStatusMatch =
        entriesReconStatusFilter === "all" ||
        entry.transaction?.status === entriesReconStatusFilter;
      if (
        excludeArchivedTransactions &&
        entry.transaction?.status === "ARCHIVED" &&
        entriesReconStatusFilter !== "ARCHIVED"
      )
        return false;
      return entryStatusMatch && reconStatusMatch;
    });
  }, [
    accountEntries,
    entriesStatusFilter,
    entriesReconStatusFilter,
    excludeArchivedTransactions,
  ]);

  const entriesPages = Math.max(
    1,
    Math.ceil(filteredAccountEntries.length / rowsPerPage),
  );
  const entriesItems = useMemo(() => {
    let sortedEntries = [...filteredAccountEntries];
    if (entriesSortDescriptor.column) {
      sortedEntries.sort((a, b) => {
        const key = entriesSortDescriptor.column as keyof AccountEntry;
        const valA = a[key];
        const valB = b[key];
        let cmpResult = 0;
        if (valA == null && valB == null) cmpResult = 0;
        else if (valA == null) cmpResult = -1;
        else if (valB == null) cmpResult = 1;
        else if (key === "created_at" || key === "effective_date") {
          cmpResult =
            new Date(valA as string).getTime() <
            new Date(valB as string).getTime()
              ? -1
              : 1;
        } else if (key === "amount") {
          cmpResult = (valA as number) < (valB as number) ? -1 : 1;
        } else {
          cmpResult = String(valA).localeCompare(String(valB));
        }
        return entriesSortDescriptor.direction === "descending"
          ? -cmpResult
          : cmpResult;
      });
    }
    return sortedEntries.slice(
      (entriesPage - 1) * rowsPerPage,
      entriesPage * rowsPerPage,
    );
  }, [filteredAccountEntries, entriesPage, rowsPerPage, entriesSortDescriptor]);

  useEffect(() => {
    setStagingPage(1);
  }, [stagingStatusFilter]);
  useEffect(() => {
    setEntriesPage(1);
  }, [
    entriesStatusFilter,
    entriesReconStatusFilter,
    excludeArchivedTransactions,
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 md:gap-8 w-full">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div className="flex-grow">
            <Select
              id={`account-select-${componentId}`}
              aria-label="Select Account"
              placeholder="Select an account"
              className="w-full md:max-w-xs"
              aria-disabled={
                !selectedMerchant || isLoading || accounts.length === 0
              }
              selectedKeys={selectedAccount ? [selectedAccount] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                onAccountChange(value || "");
              }}
              data-testid={`account-select-${componentId}`}
              disallowEmptySelection
              classNames={{
                trigger: "focus:ring-2 focus:ring-primary focus:border-primary",
              }}
            >
              {accounts.map((account) => (
                <SelectItem
                  key={account.account_id}
                  aria-disabled={account.account_id === selectedAccount}
                >
                  {account.account_name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </motion.div>

        <main className="w-full max-w-full">
          <Tabs
            aria-label="File Entries"
            selectedKey={activeTabKey}
            onSelectionChange={(key) => setActiveTabKey(key as string)}
            className="w-full"
          >
            <Tab key="processing" title="Processing Entries">
              <div className="mt-4">
                <motion.div
                  variants={fadeInUp}
                  custom={1}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
                >
                  {selectedAccount && (
                    <Select
                      aria-label="Filter Staging Entries by Status"
                      placeholder="Filter by Status"
                      selectedKeys={
                        stagingStatusFilter === "all"
                          ? []
                          : [stagingStatusFilter]
                      }
                      onSelectionChange={(keys) =>
                        setStagingStatusFilter(
                          (Array.from(keys)[0] as string) || "all",
                        )
                      }
                      className="w-56"
                      size="sm"
                      classNames={{
                        trigger:
                          "focus:ring-2 focus:ring-primary focus:border-primary",
                      }}
                    >
                      <SelectItem
                        key="all"
                        aria-disabled={stagingStatusFilter === "all"}
                      >
                        All Statuses
                      </SelectItem>
                      <SelectItem
                        key="NEEDS_MANUAL_REVIEW"
                        aria-disabled={
                          stagingStatusFilter === "NEEDS_MANUAL_REVIEW"
                        }
                      >
                        Needs Manual Review
                      </SelectItem>
                      <SelectItem
                        key="PROCESSED"
                        aria-disabled={stagingStatusFilter === "PROCESSED"}
                      >
                        Processed
                      </SelectItem>
                      <SelectItem
                        key="PENDING"
                        aria-disabled={stagingStatusFilter === "PENDING"}
                      >
                        Pending
                      </SelectItem>
                    </Select>
                  )}
                </motion.div>
                <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full flex flex-col mt-4">
                  <div className="flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading && selectedMerchant ? (
                        <motion.div
                          key="skeleton"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 sm:p-8 space-y-3 sm:space-y-4 flex flex-col justify-center items-center"
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
                      ) : !selectedMerchant ? (
                        <motion.div
                          key="empty"
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex flex-col items-center justify-center gap-3 text-center"
                          data-testid="empty-state"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                          >
                            <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            Please select a merchant first
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Select a merchant to view staging entries
                          </p>
                        </motion.div>
                      ) : !selectedAccount ? (
                        <motion.div
                          key="empty"
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex flex-col items-center justify-center gap-3 text-center py-10"
                          data-testid="empty-state"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                          >
                            <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            Please select an account
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Select an account to view staging entries
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
                          <Table
                            aria-label="Staging Entries"
                            className="min-w-full"
                            data-testid={`staging-entries-table-${componentId}`}
                            sortDescriptor={stagingSortDescriptor}
                            onSortChange={setStagingSortDescriptor}
                            bottomContent={
                              stagingPages > 1 ? (
                                <div
                                  className="flex w-full justify-center gap-2 py-4"
                                  data-testid="staging-pagination"
                                >
                                  <Pagination
                                    total={stagingPages}
                                    initialPage={stagingPage}
                                    onChange={(newPage) =>
                                      setStagingPage(newPage)
                                    }
                                    showControls
                                  />
                                </div>
                              ) : null
                            }
                          >
                            <TableHeader>
                              <TableColumn>Order ID</TableColumn>
                              <TableColumn>Entry Type</TableColumn>
                              <TableColumn className="text-right">
                                Amount
                              </TableColumn>
                              <TableColumn>Currency</TableColumn>
                              <TableColumn className="text-center">
                                Status
                              </TableColumn>
                              <TableColumn key="effective_date" allowsSorting>
                                Effective Date
                              </TableColumn>
                              <TableColumn key="created_at" allowsSorting>
                                Created At
                              </TableColumn>
                            </TableHeader>
                            <TableBody items={stagingItems}>
                              {(entry) => (
                                <TableRow key={entry.staging_entry_id}>
                                  <TableCell className="font-mono text-sm align-middle">
                                    {entry.metadata?.order_id || "-"}
                                  </TableCell>
                                  <TableCell className="align-middle">
                                    {entry.entry_type}
                                  </TableCell>
                                  <TableCell className="text-right align-middle">
                                    {entry.amount}
                                  </TableCell>
                                  <TableCell className="align-middle">
                                    {entry.currency}
                                  </TableCell>
                                  <TableCell className="text-center align-middle">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${entry.status === "PROCESSED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : entry.status === "NEEDS_MANUAL_REVIEW" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : entry.status === "PENDING" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}`}
                                    >
                                      {entry.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="align-middle whitespace-nowrap">
                                    {formatDate(entry.effective_date)}
                                  </TableCell>
                                  <TableCell className="align-middle whitespace-nowrap">
                                    {formatDate(entry.created_at)}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </div>
            </Tab>
            <Tab key="processed" title="Processed Entries">
              <div className="mt-4">
                <motion.div
                  variants={fadeInUp}
                  custom={1}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
                >
                  {selectedAccount && (
                    <div className="flex items-center gap-2">
                      <Select
                        aria-label="Filter Account Entries by Entry Status"
                        placeholder="Filter Entry Status"
                        selectedKeys={
                          entriesStatusFilter === "all"
                            ? []
                            : [entriesStatusFilter]
                        }
                        onSelectionChange={(keys) =>
                          setEntriesStatusFilter(
                            (Array.from(keys)[0] as string) || "all",
                          )
                        }
                        className="w-56"
                        size="sm"
                        classNames={{
                          trigger:
                            "focus:ring-2 focus:ring-primary focus:border-primary",
                        }}
                        disallowEmptySelection
                      >
                        <SelectItem
                          key="all"
                          aria-disabled={entriesStatusFilter === "all"}
                        >
                          All Entry Statuses
                        </SelectItem>
                        <SelectItem
                          key="EXPECTED"
                          aria-disabled={entriesStatusFilter === "EXPECTED"}
                        >
                          Expected
                        </SelectItem>
                        <SelectItem
                          key="POSTED"
                          aria-disabled={entriesStatusFilter === "POSTED"}
                        >
                          Posted
                        </SelectItem>
                        <SelectItem
                          key="ARCHIVED"
                          aria-disabled={entriesStatusFilter === "ARCHIVED"}
                        >
                          Archived
                        </SelectItem>
                      </Select>
                      <Select
                        aria-label="Filter Account Entries by Recon Status"
                        placeholder="Filter Recon Status"
                        selectedKeys={
                          entriesReconStatusFilter === "all"
                            ? []
                            : [entriesReconStatusFilter]
                        }
                        onSelectionChange={(keys) =>
                          setEntriesReconStatusFilter(
                            (Array.from(keys)[0] as string) || "all",
                          )
                        }
                        className="w-56"
                        size="sm"
                        disallowEmptySelection
                        classNames={{
                          trigger:
                            "focus:ring-2 focus:ring-primary focus:border-primary",
                        }}
                      >
                        <SelectItem
                          key="all"
                          aria-disabled={entriesReconStatusFilter === "all"}
                        >
                          All Recon Statuses
                        </SelectItem>
                        <SelectItem
                          key="EXPECTED"
                          aria-disabled={
                            entriesReconStatusFilter === "EXPECTED"
                          }
                        >
                          Expected
                        </SelectItem>
                        <SelectItem
                          key="POSTED"
                          aria-disabled={entriesReconStatusFilter === "POSTED"}
                        >
                          Posted
                        </SelectItem>
                        <SelectItem
                          key="MISMATCH"
                          aria-disabled={
                            entriesReconStatusFilter === "MISMATCH"
                          }
                        >
                          Mismatch
                        </SelectItem>
                        <SelectItem
                          key="ARCHIVED"
                          aria-disabled={
                            entriesReconStatusFilter === "ARCHIVED"
                          }
                        >
                          Archived
                        </SelectItem>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Switch
                          isSelected={excludeArchivedTransactions}
                          onValueChange={setExcludeArchivedTransactions}
                          aria-label="Exclude Archived Transactions"
                          size="sm"
                        />
                        <span className="text-sm">Exclude Archived</span>
                      </div>
                    </div>
                  )}
                </motion.div>
                <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full mt-4 flex flex-col">
                  <div className="flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading && selectedMerchant ? (
                        <motion.div
                          key="skeleton"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 sm:p-8 space-y-3 sm:space-y-4 flex flex-col justify-center items-center"
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
                      ) : !selectedMerchant ? (
                        <motion.div
                          key="empty"
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex flex-col items-center justify-center gap-3 text-center"
                          data-testid="empty-state"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                          >
                            <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            Please select a merchant first
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Select a merchant to view account entries
                          </p>
                        </motion.div>
                      ) : !selectedAccount ? (
                        <motion.div
                          key="empty"
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex flex-col items-center justify-center gap-3 text-center py-10"
                          data-testid="empty-state"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                          >
                            <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            Please select an account
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Select an account to view account entries
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
                          <Table
                            aria-label="Account Entries"
                            className="min-w-full"
                            data-testid={`account-entries-table-${componentId}`}
                            sortDescriptor={entriesSortDescriptor}
                            onSortChange={setEntriesSortDescriptor}
                            bottomContent={
                              entriesPages > 1 ? (
                                <div
                                  className="flex w-full justify-center gap-2 py-4"
                                  data-testid="entries-pagination"
                                >
                                  <Pagination
                                    total={entriesPages}
                                    initialPage={entriesPage}
                                    onChange={(newPage) =>
                                      setEntriesPage(newPage)
                                    }
                                    showControls
                                  />
                                </div>
                              ) : null
                            }
                          >
                            <TableHeader>
                              <TableColumn>Order ID</TableColumn>
                              <TableColumn>Entry Type</TableColumn>
                              <TableColumn className="text-right">
                                Amount
                              </TableColumn>
                              <TableColumn>Currency</TableColumn>
                              <TableColumn className="text-center">
                                Entry Status
                              </TableColumn>
                              <TableColumn className="text-center">
                                Recon Status
                              </TableColumn>
                              <TableColumn key="effective_date" allowsSorting>
                                Effective Date
                              </TableColumn>
                              <TableColumn key="created_at" allowsSorting>
                                Created At
                              </TableColumn>
                            </TableHeader>
                            <TableBody items={entriesItems}>
                              {(entry) => (
                                <TableRow key={entry.entry_id}>
                                  <TableCell className="font-mono text-sm align-middle">
                                    {entry.metadata?.order_id || "-"}
                                  </TableCell>
                                  <TableCell className="align-middle">
                                    {entry.entry_type}
                                  </TableCell>
                                  <TableCell className="text-right align-middle">
                                    {entry.amount}
                                  </TableCell>
                                  <TableCell className="align-middle">
                                    {entry.currency}
                                  </TableCell>
                                  <TableCell className="text-center align-middle">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${entry.status === "POSTED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : entry.status === "EXPECTED" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : entry.status === "ARCHIVED" ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}`}
                                    >
                                      {entry.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-center align-middle">
                                    {entry.transaction?.status ? (
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${entry.transaction.status === "POSTED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : entry.transaction.status === "EXPECTED" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : entry.transaction.status === "ARCHIVED" ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" : entry.transaction.status === "MISMATCH" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}`}
                                      >
                                        {entry.transaction.status}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </TableCell>
                                  <TableCell className="align-middle whitespace-nowrap">
                                    {formatDate(entry.effective_date)}
                                  </TableCell>
                                  <TableCell className="align-middle whitespace-nowrap">
                                    {formatDate(entry.created_at)}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
