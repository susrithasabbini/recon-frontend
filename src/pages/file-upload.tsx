import { useState, useEffect, useMemo } from "react"; 
import { Select, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
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
import { ArrowUpTrayIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
import api from "@/config/axios";
import FileUploadForm from "@/components/FileUploadForm";

interface Account {
  account_id: string;
  merchant_id: string;
  account_name: string;
  account_type: "DEBIT_NORMAL" | "CREDIT_NORMAL";
  currency: string;
  posted_balance: string;
  pending_balance: string;
  available_balance: string;
}

interface StagingEntry {
  staging_entry_id: string;
  account_id: string;
  entry_type: "DEBIT" | "CREDIT";
  amount: string;
  currency: string;
  status: string;
  effective_date: string;
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
  account: {
    account_name: string;
    merchant_id: string;
  };
}

interface AccountEntry {
  entry_id: string;
  account_id: string;
  transaction_id: string;
  entry_type: "DEBIT" | "CREDIT";
  amount: number;
  currency: string;
  status: "EXPECTED" | "POSTED" | "ARCHIVED"; // This might be the entry's own status, distinct from transaction status
  effective_date: string;
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
  transaction?: { // Made optional as it might not always be present, or use a specific type if always present
    transaction_id: string;
    status: "EXPECTED" | "POSTED" | "MISMATCH" | "ARCHIVED";
    logical_transaction_id?: string; // Optional based on example
    version?: number; // Optional based on example
  };
}

interface UploadResponse {
  message: string;
  successful_ingestions: number;
  failed_ingestions: number;
  errors: {
    row_number: number;
    error_details: string;
    row_data: Record<string, any>;
  }[];
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

export default function FileUploadPage() {
  const { selectedMerchant, getAccounts } = useDefaultContext();
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const [stagingPage, setStagingPage] = useState(1);
  const [stagingStatusFilter, setStagingStatusFilter] = useState<string | "all">("all");
  const [entriesPage, setEntriesPage] = useState(1);
  const [entriesStatusFilter, setEntriesStatusFilter] = useState<string | "all">("all");
  const [entriesReconStatusFilter, setEntriesReconStatusFilter] = useState<string | "all">("all"); // New filter state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [processingMode, setProcessingMode] = useState<string>("CONFIRMATION");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stagingEntries, setStagingEntries] = useState<StagingEntry[]>([]);
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    successful: number;
    failed: number;
    errors: { row: number; details: string }[];
  } | null>(null);
  const rowsPerPage = 10; // Changed to 10

  const [stagingSortDescriptor, setStagingSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });
  const [entriesSortDescriptor, setEntriesSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });

  // Reset state when merchant changes
  useEffect(() => {
    setSelectedAccount("");
    setProcessingMode("CONFIRMATION");
    setSelectedFile(null);
    setStagingEntries([]);
    setStagingStatusFilter("all");
    setStagingPage(1);
    setAccountEntries([]);
    setEntriesStatusFilter("all");
    setEntriesReconStatusFilter("all"); // Reset new filter
    setEntriesPage(1);
    setFilename(null);
    setUploadStatus(null);
  }, [selectedMerchant]);

  // Fetch accounts when merchant is selected
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedMerchant) {
        setAccounts([]);
        return;
      }

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

  // Poll staging entries every second when an account is selected
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStagingEntries = async () => {
      if (!selectedAccount || !selectedMerchant) return;

      try {
        const { data } = await api.get<StagingEntry[]>(
          `/accounts/${selectedAccount}/staging-entries`
        );
        setStagingEntries(data);
      } catch (error) {
        console.error("Error fetching staging entries:", error);
      }
    };

    if (selectedAccount && selectedMerchant) {
      // Initial fetch
      fetchStagingEntries();
      // Set up polling
      intervalId = setInterval(fetchStagingEntries, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedAccount, selectedMerchant]);

  // Poll account entries every second when an account is selected
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchAccountEntries = async () => {
      if (!selectedAccount || !selectedMerchant) return;

      try {
        const { data } = await api.get<AccountEntry[]>(
          `/accounts/${selectedAccount}/entries`
        );
        setAccountEntries(data);
      } catch (error) {
        console.error("Error fetching account entries:", error);
      }
    };

    if (selectedAccount && selectedMerchant) {
      // Initial fetch
      fetchAccountEntries();
      // Set up polling
      intervalId = setInterval(fetchAccountEntries, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedAccount, selectedMerchant]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        addToast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "flat",
        });
        setSelectedFile(null);
        setFilename(null);
        e.target.value = ""; 
        return;
      }
      setSelectedFile(file);
      setFilename(file.name);
      setUploadStatus(null); 
    } else {
      setSelectedFile(null);
      setFilename(null);
    }
  };

  const handleActualFileUpload = async () => {
    if (!selectedAccount) {
      addToast({ title: "Please select an account first.", variant: "flat" });
      return;
    }
    if (!processingMode) {
      addToast({ title: "Please select a processing mode.", variant: "flat" });
      return;
    }
    if (!selectedFile) {
      addToast({ title: "Please select a file to upload.", variant: "flat" });
      return;
    }

    setLoading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("processing_mode", processingMode); 

      const { data } = await api.post<UploadResponse>(
        `/accounts/${selectedAccount}/staging-entries/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus({
        message: data.message,
        successful: data.successful_ingestions,
        failed: data.failed_ingestions,
        errors: data.errors.map((err) => ({
          row: err.row_number,
          details: err.error_details,
        })),
      });

      if (data.failed_ingestions === 0) {
        addToast({
          title: "File uploaded successfully",
          description: `${data.successful_ingestions} entries processed.`,
        });
      } else {
        addToast({
          title: "File processed with some errors",
          description: `${data.successful_ingestions} successful, ${data.failed_ingestions} failed.`,
          variant: "flat",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to upload file.";
      addToast({
        title: "Upload failed",
        description: errorMessage,
        variant: "flat",
      });
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setFilename(null); 
    }
  };

  // Memoized filtered staging entries
  const filteredStagingEntries = useMemo(() => {
    let result;
    if (stagingStatusFilter === "all") {
      result = stagingEntries;
    } else {
      result = stagingEntries.filter(entry => entry.status === stagingStatusFilter);
    }
    return result;
  }, [stagingEntries, stagingStatusFilter]);

  const stagingPages = Math.max(
    1,
    Math.ceil(filteredStagingEntries.length / rowsPerPage)
  );
  const stagingItems = useMemo(() => {
    let sortedEntries = [...filteredStagingEntries];
    if (stagingSortDescriptor.column) {
      sortedEntries.sort((a, b) => {
        const first = a[stagingSortDescriptor.column as keyof StagingEntry] as string;
        const second = b[stagingSortDescriptor.column as keyof StagingEntry] as string;
        let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

        if (stagingSortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      });
    }
    const items = sortedEntries.slice(
      (stagingPage - 1) * rowsPerPage,
      stagingPage * rowsPerPage
    );
    return items;
  }, [filteredStagingEntries, stagingPage, rowsPerPage, stagingSortDescriptor]);
  
  // Memoized filtered account entries
  // Memoized filtered account entries
  const filteredAccountEntries = useMemo(() => {
    const result = accountEntries.filter(entry => {
      const entryStatusMatch = entriesStatusFilter === "all" || entry.status === entriesStatusFilter;
      const reconStatusMatch = entriesReconStatusFilter === "all" || entry.transaction?.status === entriesReconStatusFilter;
      return entryStatusMatch && reconStatusMatch;
    });
    return result;
  }, [accountEntries, entriesStatusFilter, entriesReconStatusFilter]);

  const entriesPages = Math.max(
    1,
    Math.ceil(filteredAccountEntries.length / rowsPerPage)
  );
  const entriesItems = useMemo(() => {
    let sortedEntries = [...filteredAccountEntries];
    if (entriesSortDescriptor.column) {
      sortedEntries.sort((a, b) => {
        const first = a[entriesSortDescriptor.column as keyof AccountEntry] as any;
        const second = b[entriesSortDescriptor.column as keyof AccountEntry] as any;
        let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

        if (entriesSortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      });
    }
    const items = sortedEntries.slice(
      (entriesPage - 1) * rowsPerPage,
      entriesPage * rowsPerPage
    );
    return items;
  }, [filteredAccountEntries, entriesPage, rowsPerPage, entriesSortDescriptor]);

  useEffect(() => {
    setStagingPage(1);
  }, [stagingStatusFilter]);

  useEffect(() => {
    setEntriesPage(1);
  }, [entriesStatusFilter, entriesReconStatusFilter]); // Also reset on new filter change

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
            File Upload
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium"
          >
            Upload transaction files to start the reconciliation process.
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    1. Select Account
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="account-select-page" className="font-medium">Select Account</label>
                      <Select
                        id="account-select-page"
                        aria-label="Select Account"
                        placeholder="Select an account"
                        className="w-full"
                        isDisabled={!selectedMerchant || loading}
                        selectedKeys={[selectedAccount]}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setSelectedAccount(selected);
                        }}
                        data-testid="account-select"
                      >
                        {accounts.map((account) => (
                          <SelectItem key={account.account_id}>
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <FileUploadForm
              selectedAccount={selectedAccount}
              loading={loading}
              processingMode={processingMode}
              setProcessingMode={setProcessingMode}
              onFileChange={handleFileChange}
              handleUploadClick={handleActualFileUpload}
              filename={filename}
              uploadStatus={uploadStatus}
              isFileSelected={!!selectedFile}
            />
          </aside>

          {/* DATA TABLE */}
          <main className="lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full">
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Processing Entries
              </h2>
              {selectedAccount && (
              <Select
                aria-label="Filter Staging Entries by Status"
                placeholder="Filter by Status"
                selectedKeys={stagingStatusFilter === "all" ? [] : [stagingStatusFilter]}
                onSelectionChange={(keys) => setStagingStatusFilter(Array.from(keys)[0] as string || "all")}
                className="w-56" // Increased width
                size="sm"
              >
                <SelectItem key="all">All Statuses</SelectItem>
                <SelectItem key="NEEDS_MANUAL_REVIEW">Needs Manual Review</SelectItem>
                <SelectItem key="PROCESSED">Processed</SelectItem>
                <SelectItem key="PENDING">Pending</SelectItem>
              </Select>
              )}
            </motion.div>
            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full"> {/* Removed min-height from Card */}
              <AnimatePresence mode="wait">
                {loading && selectedMerchant ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-8 space-y-3 sm:space-y-4 min-h-[33rem] flex flex-col justify-center items-center" // Added min-height & flex
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
                    className="flex flex-col items-center justify-center gap-3 text-center min-h-[33rem]" // Added min-height, removed py-14, h-full
                    data-testid="empty-state"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                    >
                      <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
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
                    className="flex flex-col items-center justify-center gap-3 text-center min-h-[33rem]" // Added min-height, removed py-14, h-full
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
                    className="min-h-[33rem]" // Adjusted min-height to match empty states
                  >
                    <Table
                      aria-label="Staging Entries"
                      className="min-w-full"
                      data-testid="staging-entries-table"
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
                              onChange={(newPage) => setStagingPage(newPage)}
                              showControls
                            />
                          </div>
                        ) : null
                      }
                    >
                      <TableHeader>
                        <TableColumn>Order ID</TableColumn>
                        <TableColumn>Entry Type</TableColumn>
                        <TableColumn className="text-right">Amount</TableColumn>
                        <TableColumn>Currency</TableColumn>
                        <TableColumn className="text-center">Status</TableColumn>
                        <TableColumn key="effective_date" allowsSorting>Effective Date</TableColumn>
                        <TableColumn key="created_at" allowsSorting>Created At</TableColumn>
                      </TableHeader>
                      <TableBody items={stagingItems}>
                        {(entry) => (
                          <TableRow key={entry.staging_entry_id}>
                            <TableCell className="font-mono text-sm align-middle">
                              {entry.metadata?.order_id || "-"}
                            </TableCell>
                            <TableCell className="align-middle">{entry.entry_type}</TableCell>
                            <TableCell className="text-right align-middle">{entry.amount}</TableCell>
                            <TableCell className="align-middle">{entry.currency}</TableCell>
                            <TableCell className="text-center align-middle">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  entry.status === "PROCESSED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : entry.status === "NEEDS_MANUAL_REVIEW"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : entry.status === "PENDING"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
                            <TableCell className="align-middle">
                              {new Date(entry.effective_date).toLocaleString()}
                            </TableCell>
                            <TableCell className="align-middle">
                              {new Date(entry.created_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            {/* Account Entries Table */}
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mt-10" // Added mt-10 for more spacing
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Processed Entries
              </h2>
              {selectedAccount && (
                <div className="flex gap-2"> {/* Wrapper for two filters */}
                  <Select
                    aria-label="Filter Account Entries by Entry Status"
                    placeholder="Filter Entry Status"
                    selectedKeys={entriesStatusFilter === "all" ? [] : [entriesStatusFilter]}
                    onSelectionChange={(keys) => setEntriesStatusFilter(Array.from(keys)[0] as string || "all")}
                    className="w-56"
                    size="sm"
                  >
                    <SelectItem key="all">All Entry Statuses</SelectItem>
                    <SelectItem key="EXPECTED">Expected</SelectItem>
                    <SelectItem key="POSTED">Posted</SelectItem>
                    <SelectItem key="ARCHIVED">Archived</SelectItem>
                  </Select>
                  <Select
                    aria-label="Filter Account Entries by Recon Status"
                    placeholder="Filter Recon Status"
                    selectedKeys={entriesReconStatusFilter === "all" ? [] : [entriesReconStatusFilter]}
                    onSelectionChange={(keys) => setEntriesReconStatusFilter(Array.from(keys)[0] as string || "all")}
                    className="w-56"
                    size="sm"
                  >
                    <SelectItem key="all">All Recon Statuses</SelectItem>
                    <SelectItem key="EXPECTED">Expected</SelectItem>
                    <SelectItem key="POSTED">Posted</SelectItem>
                    <SelectItem key="MISMATCH">Mismatch</SelectItem>
                    <SelectItem key="ARCHIVED">Archived</SelectItem>
                  </Select>
                </div>
              )}
            </motion.div>
            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full mt-6"> {/* Removed min-height from Card */}
              <AnimatePresence mode="wait">
                {loading && selectedMerchant ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-8 space-y-3 sm:space-y-4 min-h-[33rem] flex flex-col justify-center items-center" // Added min-height & flex
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
                    className="flex flex-col items-center justify-center gap-3 text-center min-h-[33rem]" // Added min-height, removed py-14, h-full
                    data-testid="empty-state"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full"
                    >
                      <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
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
                    className="flex flex-col items-center justify-center gap-3 text-center min-h-[33rem]" // Added min-height, removed py-14, h-full
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
                    className="min-h-[33rem]" // Adjusted min-height to match empty states
                  >
                    <Table
                      aria-label="Account Entries"
                      className="min-w-full"
                      data-testid="account-entries-table"
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
                              onChange={(newPage) => setEntriesPage(newPage)}
                              showControls
                            />
                          </div>
                        ) : null
                      }
                    >
                      <TableHeader>
                        <TableColumn>Order ID</TableColumn>
                        <TableColumn>Entry Type</TableColumn>
                        <TableColumn className="text-right">Amount</TableColumn>
                        <TableColumn>Currency</TableColumn>
                        <TableColumn className="text-center">Entry Status</TableColumn>
                        <TableColumn className="text-center">Recon Status</TableColumn>
                        <TableColumn key="effective_date" allowsSorting>Effective Date</TableColumn>
                        <TableColumn key="created_at" allowsSorting>Created At</TableColumn>
                      </TableHeader>
                      <TableBody items={entriesItems}>
                        {(entry) => (
                          <TableRow key={entry.entry_id}>
                            <TableCell className="font-mono text-sm align-middle">
                              {entry.metadata?.order_id || "-"}
                            </TableCell>
                            <TableCell className="align-middle">{entry.entry_type}</TableCell>
                            <TableCell className="text-right align-middle">{entry.amount}</TableCell>
                            <TableCell className="align-middle">{entry.currency}</TableCell>
                            <TableCell className="text-center align-middle">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  entry.status === "POSTED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : entry.status === "EXPECTED"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : entry.status === "ARCHIVED" 
                                        ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" 
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-center align-middle">
                              {entry.transaction?.status ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                    entry.transaction.status === "POSTED"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : entry.transaction.status === "EXPECTED"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : entry.transaction.status === "ARCHIVED"
                                          ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                                          : entry.transaction.status === "MISMATCH"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                  }`}
                                >
                                  {entry.transaction.status}
                                </span>
                              ) : (
                                "-" 
                              )}
                            </TableCell>
                            <TableCell className="align-middle">
                              {new Date(entry.effective_date).toLocaleString()}
                            </TableCell>
                            <TableCell className="align-middle">
                              {new Date(entry.created_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </main>
        </div>
      </motion.section>
    </>
  );
}
