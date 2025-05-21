import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@heroui/pagination";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
import api from "@/config/axios";

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
  status: "EXPECTED" | "POSTED" | "ARCHIVED";
  effective_date: string;
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
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
  const [entriesPage, setEntriesPage] = useState(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [stagingEntries, setStagingEntries] = useState<StagingEntry[]>([]);
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    successful: number;
    failed: number;
    errors: { row: number; details: string }[];
  } | null>(null);
  const rowsPerPage = 5;

  // Reset state when merchant changes
  useEffect(() => {
    setSelectedAccount("");
    setStagingEntries([]);
    setAccountEntries([]);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAccount) {
      addToast({
        title: "Please select an account first",
        variant: "flat",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith(".csv")) {
      addToast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "flat",
      });
      e.target.value = "";
      return;
    }

    setLoading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post<UploadResponse>(
        `/accounts/${selectedAccount}/staging-entries/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFilename(file.name);
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
          description: `${data.successful_ingestions} entries processed`,
        });
      } else {
        addToast({
          title: "File processed with some errors",
          description: `${data.successful_ingestions} successful, ${data.failed_ingestions} failed`,
          variant: "flat",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to upload file";
      addToast({
        title: "Upload failed",
        description: errorMessage,
        variant: "flat",
      });
      setFilename(null);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // Calculate pagination for staging entries
  const stagingPages = Math.max(
    1,
    Math.ceil(stagingEntries.length / rowsPerPage)
  );
  const stagingItems = stagingEntries.slice(
    (stagingPage - 1) * rowsPerPage,
    stagingPage * rowsPerPage
  );

  // Calculate pagination for account entries
  const entriesPages = Math.max(
    1,
    Math.ceil(accountEntries.length / rowsPerPage)
  );
  const entriesItems = accountEntries.slice(
    (entriesPage - 1) * rowsPerPage,
    entriesPage * rowsPerPage
  );

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
                    <ArrowUpTrayIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Upload Transactions
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form
                    className="space-y-4 sm:space-y-6"
                    aria-label="Upload transaction file"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Select Account</label>
                      <Select
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
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Transaction File</label>
                      <div className="relative block w-full">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="sr-only"
                          disabled={loading || !selectedAccount}
                          id="transaction-upload"
                          data-testid="transaction-file-input"
                        />
                        <label
                          htmlFor="transaction-upload"
                          className={`
                            block w-full cursor-pointer text-sm text-gray-500
                            border border-gray-200 rounded px-4 py-2 bg-white dark:bg-gray-900
                            hover:file:bg-blue-100
                            ${!selectedAccount ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          data-testid="transaction-file-name"
                        >
                          {filename || "No file chosen"}
                        </label>
                      </div>
                    </div>
                  </form>
                </CardBody>
                {filename && (
                  <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span data-testid="file-name">File: {filename}</span>
                        {uploadStatus && (
                          <span
                            className={`font-medium ${
                              uploadStatus.failed === 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {uploadStatus.successful} successful,{" "}
                            {uploadStatus.failed} failed
                          </span>
                        )}
                      </div>
                      {uploadStatus &&
                        uploadStatus.errors &&
                        uploadStatus.errors.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="font-medium text-red-600 dark:text-red-400">
                              Errors:
                            </p>
                            {uploadStatus.errors.map((error, index) => (
                              <p key={index} className="text-xs">
                                Row {error.row}: {error.details}
                              </p>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
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
                ) : !selectedMerchant ? (
                  <motion.div
                    key="empty"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex flex-col items-center gap-3 py-14 text-center"
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
                    className="flex flex-col items-center gap-3 py-14 text-center"
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
                      data-testid="staging-entries-table"
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
                        <TableColumn>Amount</TableColumn>
                        <TableColumn>Currency</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Effective Date</TableColumn>
                        <TableColumn>Created At</TableColumn>
                        <TableColumn>Discarded At</TableColumn>
                      </TableHeader>
                      <TableBody items={stagingItems} emptyContent={<></>}>
                        {(entry) => (
                          <TableRow key={entry.staging_entry_id}>
                            <TableCell className="font-mono text-sm">
                              {entry.metadata?.order_id || "-"}
                            </TableCell>
                            <TableCell>{entry.entry_type}</TableCell>
                            <TableCell>{entry.amount}</TableCell>
                            <TableCell>{entry.currency}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  entry.status === "PROCESSED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : entry.status === "NEEDS_MANUAL_REVIEW"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(entry.effective_date).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(entry.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {entry.discarded_at
                                ? new Date(entry.discarded_at).toLocaleString()
                                : "-"}
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
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Processed Entries
              </h2>
            </motion.div>
            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full mt-6">
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
                ) : !selectedMerchant ? (
                  <motion.div
                    key="empty"
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex flex-col items-center gap-3 py-14 text-center"
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
                    className="flex flex-col items-center gap-3 py-14 text-center"
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
                      data-testid="account-entries-table"
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
                        <TableColumn>Amount</TableColumn>
                        <TableColumn>Currency</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Effective Date</TableColumn>
                        <TableColumn>Created At</TableColumn>
                        <TableColumn>Discarded At</TableColumn>
                      </TableHeader>
                      <TableBody items={entriesItems} emptyContent={<></>}>
                        {(entry) => (
                          <TableRow key={entry.entry_id}>
                            <TableCell className="font-mono text-sm">
                              {entry.metadata?.order_id || "-"}
                            </TableCell>
                            <TableCell>{entry.entry_type}</TableCell>
                            <TableCell>{entry.amount}</TableCell>
                            <TableCell>{entry.currency}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  entry.status === "POSTED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : entry.status === "EXPECTED"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : entry.status === "ARCHIVED"
                                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(entry.effective_date).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(entry.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {entry.discarded_at
                                ? new Date(entry.discarded_at).toLocaleString()
                                : "-"}
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
