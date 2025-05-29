import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody } from "@heroui/card";
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
import {
  ArrowUpTrayIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
import api from "@/config/axios";
import type { Account, UploadResponse } from "@/types";

// Simple CSV parser
function parseCSV(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.2 * i,
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [processingMode, setProcessingMode] = useState<string>("CONFIRMATION");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });
  const rowsPerPage = 10;

  // Reset state when merchant changes
  useEffect(() => {
    setSelectedAccount("");
    setProcessingMode("CONFIRMATION");
    setSelectedFile(null);
    setFilename(null);
    setUploadStatus(null);
    setCsvData([]);
    setPage(1);
  }, [selectedMerchant]);

  // Reset file data when account changes
  useEffect(() => {
    setSelectedFile(null);
    setFilename(null);
    setUploadStatus(null);
    setCsvData([]);
    setPage(1);
  }, [selectedAccount]);

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

      // Read and parse CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setCsvData(parsed);
      };
      reader.readAsText(file);
    } else {
      setSelectedFile(null);
      setFilename(null);
      setCsvData([]);
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

      setUploadStatus(data);

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
    }
  };

  const handleAccountChange = (keys: any) => {
    const selected = Array.from(keys)[0] as string;
    setSelectedAccount(selected);
    // Clear file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const pages = Math.max(1, Math.ceil((csvData.length - 1) / rowsPerPage));
  const items = csvData.slice(
    (page - 1) * rowsPerPage + 1,
    page * rowsPerPage + 1
  );

  return (
    <>
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
              title({ size: "md", color: "primary" }),
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full mt-10">
          <aside className="lg:col-span-4 w-full max-w-full">
            <motion.div variants={scaleIn} initial="hidden" animate="visible">
              <Card className="shadow-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full">
                <CardHeader className="flex items-center gap-2 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-primary/5 dark:bg-primary/10 rounded-t-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    1. Select Account
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="account-select-page"
                        className="font-medium"
                      >
                        Select Account
                      </label>
                      <Select
                        id="account-select-page"
                        aria-label="Select Account"
                        placeholder="Select an account"
                        className="w-full"
                        isDisabled={!selectedMerchant || loading}
                        selectedKeys={[selectedAccount]}
                        onSelectionChange={handleAccountChange}
                        data-testid="account-select"
                        classNames={{
                          trigger:
                            "focus:ring-2 focus:ring-primary focus:border-primary",
                        }}
                      >
                        {accounts.map((account) => (
                          <SelectItem key={account.account_id}>
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Processing Mode</label>
                      <Select
                        selectedKeys={[processingMode]}
                        onSelectionChange={(keys) =>
                          setProcessingMode(Array.from(keys)[0] as string)
                        }
                        className="w-full"
                        data-testid="processing-mode-select"
                      >
                        <SelectItem key="TRANSACTION">Transaction</SelectItem>
                        <SelectItem key="CONFIRMATION">Confirmation</SelectItem>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Upload File</label>
                      <div className="relative block w-full">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="sr-only"
                          disabled={loading || !selectedMerchant}
                          id="file-upload"
                          data-testid="file-input"
                        />
                        <label
                          htmlFor="file-upload"
                          className={`
                            block w-full cursor-pointer text-sm text-gray-500
                            border border-gray-200 rounded px-4 py-2 bg-white dark:bg-gray-900
                            hover:file:bg-blue-100
                            ${!selectedMerchant ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          data-testid="file-name"
                        >
                          {filename || "No file chosen"}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleActualFileUpload}
                        disabled={!selectedFile || !selectedAccount || loading}
                        className={`
                          w-full py-2 px-4 rounded-md text-white
                          ${
                            !selectedFile || !selectedAccount || loading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-primary hover:bg-primary/90"
                          }
                        `}
                      >
                        Upload
                      </button>
                      {uploadStatus && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Upload Status: {uploadStatus.successful_ingestions}{" "}
                          successful, {uploadStatus.failed_ingestions} failed
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </aside>

          <main className="lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full">
            <motion.div
              variants={fadeInUp}
              custom={1}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
            >
              <h2 className="text-lg sm:text-2xl font-semibold">
                Uploaded Data Preview
              </h2>
            </motion.div>
            <Card className="shadow-lg border border-gray-100 dark:border-gray-800 w-full flex flex-col">
              <div className="flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {loading ? (
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
                        <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
                      </motion.div>
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Please select a merchant first
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        Select a merchant to upload files
                      </p>
                    </motion.div>
                  ) : !selectedAccount ? (
                    <motion.div
                      key="empty"
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex flex-col items-center justify-center gap-3 text-center p-10"
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
                        Select an account to upload files
                      </p>
                    </motion.div>
                  ) : !csvData.length ? (
                    <motion.div
                      key="empty"
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex flex-col items-center justify-center gap-3 text-center p-10"
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
                        No file uploaded
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        Upload a CSV file to preview the data
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
                        aria-label="Uploaded CSV Data"
                        className="min-w-full"
                        data-testid="data-table"
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        bottomContent={
                          pages > 1 ? (
                            <div
                              className="flex w-full justify-center gap-2 py-4"
                              data-testid="pagination"
                            >
                              <Pagination
                                total={pages}
                                initialPage={page}
                                onChange={setPage}
                                showControls
                              />
                            </div>
                          ) : null
                        }
                      >
                        <TableHeader>
                          {csvData[0].map((header, idx) => (
                            <TableColumn key={idx}>{header}</TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody items={items}>
                          {(row) => (
                            <TableRow key={row.join("-")}>
                              {row.map((cell, cellIdx) => (
                                <TableCell key={cellIdx}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </main>
        </div>
      </motion.section>
    </>
  );
}
