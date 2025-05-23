import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import type { FileUploadFormProps } from "@/types";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "backOut", delay: 0.1 }, // Added a slight delay
  },
};

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  selectedAccount,
  loading,
  processingMode,
  setProcessingMode,
  onFileChange,
  handleUploadClick,
  filename,
  uploadStatus,
  isFileSelected,
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <Card className="shadow-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full">
        <CardHeader className="flex items-center gap-2 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-primary/5 dark:bg-primary/10 rounded-t-xl">
          <div className="p-2 bg-primary/20 rounded-lg">
            <ArrowUpTrayIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">2. Upload File</h2>
        </CardHeader>
        <CardBody className="p-4 sm:p-6">
          <form
            className="space-y-4 sm:space-y-6"
            aria-label="Upload transaction file form"
            onSubmit={(e) => {
              e.preventDefault();
              handleUploadClick();
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="transaction-upload-input" className="font-medium">
                Transaction File
              </label>
              <div className="relative block w-full">
                <input
                  type="file"
                  accept=".csv"
                  onChange={onFileChange}
                  className="sr-only"
                  disabled={loading || !selectedAccount} // File input only depends on account selected initially
                  id="transaction-upload-input"
                  data-testid="transaction-file-input"
                />
                <label
                  htmlFor="transaction-upload-input"
                  className={`
                    block w-full cursor-pointer text-sm text-gray-500
                    border border-gray-200 rounded px-4 py-2 bg-white dark:bg-gray-900
                    hover:border-primary dark:hover:border-primary
                    ${!selectedAccount ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  data-testid="transaction-file-name"
                >
                  {filename || "No file chosen"}
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="processing-mode-select" className="font-medium">
                Processing Mode
              </label>
              <Select
                id="processing-mode-select"
                aria-label="Select Processing Mode"
                placeholder="Select a mode"
                className="w-full"
                isDisabled={loading || !selectedAccount || !filename} // Mode selection depends on account and file selected
                selectedKeys={[processingMode]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setProcessingMode(selected);
                }}
                data-testid="processing-mode-select"
                classNames={{
                  trigger:
                    "focus:ring-2 focus:ring-primary focus:border-primary",
                }}
              >
                <SelectItem key="CONFIRMATION">Confirmation</SelectItem>
                <SelectItem key="TRANSACTION">Transaction</SelectItem>
              </Select>
            </div>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
              isDisabled={
                loading ||
                !isFileSelected ||
                !selectedAccount ||
                !processingMode
              }
              data-testid="upload-file-button"
            >
              Upload File
            </Button>
          </form>
        </CardBody>
        {filename &&
          uploadStatus && ( // Show footer only if a file was chosen and there's an upload status
            <CardFooter className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <span data-testid="file-name-status">File: {filename}</span>
                  <span
                    className={`font-medium ${
                      uploadStatus.failed_ingestions === 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {uploadStatus.successful_ingestions} successful,{" "}
                    {uploadStatus.failed_ingestions} failed
                  </span>
                </div>
                {uploadStatus.errors && uploadStatus.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="font-medium text-red-600 dark:text-red-400">
                      Errors:
                    </p>
                    {uploadStatus.errors.map((error, index) => (
                      <p key={index} className="text-xs">
                        Row {error.row_number}: {error.error_details}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardFooter>
          )}
      </Card>
    </motion.div>
  );
};

export default FileUploadForm;
