import DefaultLayout from "@/layouts/default";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { title } from "@/components/primitives";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
// Simple CSV parser (no external dependency)
function parseCSV(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      // Basic CSV split (does not handle quoted commas)
      return line.split(",").map((cell) => cell.trim());
    });
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
  const { selectedMerchant } = useDefaultContext();
  const [selectedType, setSelectedType] = useState("OMS");
  const [omsData, setOmsData] = useState<string[][]>([]);
  const [pspData, setPspData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [omsFilename, setOmsFilename] = useState<string | null>(null);
  const [pspFilename, setPspFilename] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "OMS" | "PSP",
  ) => {
    if (!selectedMerchant) {
      addToast({
        title: "Please select a merchant first",
        variant: "flat",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (type === "OMS") {
        setOmsData(parsed);
        setOmsFilename(file.name);
        addToast({
          title: "OMS file uploaded successfully",
        });
      } else {
        setPspData(parsed);
        setPspFilename(file.name);
        addToast({
          title: "PSP file uploaded successfully",
        });
      }
      setLoading(false);
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const data = selectedType === "OMS" ? omsData : pspData;
  const hasData = data.length > 1;
  const pages = Math.max(1, Math.ceil((data.length - 1) / rowsPerPage));
  const items = data.slice(
    (page - 1) * rowsPerPage + 1,
    page * rowsPerPage + 1,
  );

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
            <ArrowUpTrayIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </span>
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className={clsx(
              title({ size: "md", color: "blue" }),
              "leading-6 py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
            )}
          >
            File Upload
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium"
          >
            Upload OMS and PSP CSV files to start the reconciliation process.
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
                    Upload Files
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form
                    className="space-y-4 sm:space-y-6"
                    aria-label="Upload CSV files"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">OMS CSV</label>
                      <div className="relative block w-full">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileUpload(e, "OMS")}
                          className="sr-only"
                          disabled={loading || !selectedMerchant}
                          id="oms-upload"
                          data-testid="oms-file-input"
                        />
                        <label
                          htmlFor="oms-upload"
                          className={`
                            block w-full cursor-pointer text-sm text-gray-500
                            border border-gray-200 rounded px-4 py-2 bg-white dark:bg-gray-900
                            hover:file:bg-blue-100
                            ${!selectedMerchant ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          data-testid="oms-file-name"
                        >
                          {omsFilename || "No file chosen"}
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">PSP CSV</label>
                      <div className="relative block w-full">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileUpload(e, "PSP")}
                          className="sr-only"
                          disabled={loading || !selectedMerchant}
                          id="psp-upload"
                          data-testid="psp-file-input"
                        />
                        <label
                          htmlFor="psp-upload"
                          className={`
                            block w-full cursor-pointer text-sm text-gray-500
                            border border-gray-200 rounded px-4 py-2 bg-white dark:bg-gray-900
                            hover:file:bg-blue-100
                            ${!selectedMerchant ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          data-testid="psp-file-name"
                        >
                          {pspFilename || "No file chosen"}
                        </label>
                      </div>
                    </div>
                  </form>
                </CardBody>
                {(omsData.length > 1 || pspData.length > 1) && (
                  <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
                    <span data-testid="oms-row-count">
                      OMS rows:{" "}
                      {omsData.length - 1 > 0 ? omsData.length - 1 : 0}
                    </span>{" "}
                    |{" "}
                    <span data-testid="psp-row-count">
                      PSP rows:{" "}
                      {pspData.length - 1 > 0 ? pspData.length - 1 : 0}
                    </span>
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
                Uploaded Data
              </h2>
              <Select
                label="View Data"
                selectedKeys={[selectedType]}
                onSelectionChange={(keys: any) =>
                  setSelectedType(Array.from(keys)[0] as string)
                }
                className="w-40"
                disallowEmptySelection
                data-testid="data-type-select"
              >
                <SelectItem key="OMS">OMS</SelectItem>
                <SelectItem key="PSP">PSP</SelectItem>
              </Select>
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
                ) : !selectedMerchant || !hasData ? (
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
                      {!selectedMerchant
                        ? "Please select a merchant first"
                        : selectedType === "OMS"
                          ? "No OMS file uploaded"
                          : "No PSP file uploaded"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      {!selectedMerchant
                        ? "Select a merchant to upload files"
                        : `Please upload a ${selectedType} CSV file using the form`}
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
                        aria-label="Uploaded CSV Data"
                        className="min-w-full"
                        data-testid="data-table"
                        bottomContent={
                          <div
                            className="flex w-full justify-center gap-2 py-4"
                            data-testid="pagination"
                          >
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => setPage((p) => Math.max(p - 1, 1))}
                              isDisabled={page === 1}
                              className="min-w-[100px]"
                              data-testid="previous-page"
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
                                  data-testid={
                                    p === page ? "current-page" : undefined
                                  }
                                >
                                  {p}
                                </Button>
                              ),
                            )}
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                setPage((p) => Math.min(p + 1, pages))
                              }
                              isDisabled={page === pages}
                              className="min-w-[100px]"
                              data-testid="next-page"
                            >
                              Next
                            </Button>
                          </div>
                        }
                      >
                        <TableHeader>
                          {data[0].map((header, idx) => (
                            <TableColumn key={idx}>{header}</TableColumn>
                          ))}
                        </TableHeader>
                        <TableBody items={items} emptyContent={<></>}>
                          {(row) => (
                            <TableRow key={row.join("-")}>
                              {row.map((cell, cellIdx) => (
                                <TableCell key={cellIdx}>{cell}</TableCell>
                              ))}
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
    </DefaultLayout>
  );
}
