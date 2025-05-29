import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { ChevronRightIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useDefaultContext } from "@/contexts/default-context";
import { title as titlePrimitive } from "@/components/primitives";
import { Transaction, TransactionVersion, TransactionEntry } from "@/types";
import api from "@/config/axios";

const PageLoader = () => (
  <div className="flex justify-center items-center h-64">
    <p className="text-xl text-gray-500">Loading...</p>
  </div>
);

const ViewTransactionsPage: React.FC = () => {
  const { selectedMerchant } = useDefaultContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedMerchant) {
        setTransactions([]);
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Transaction[]>(
          `/merchants/${selectedMerchant}/transactions`,
        );
        setTransactions(response.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching transactions.",
        );
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [selectedMerchant]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        className="text-center mb-10"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className={titlePrimitive({ color: "primary", size: "lg" })}>
          Transactions
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Review and manage your merchant transactions.
        </p>
      </motion.div>

      {!selectedMerchant ? (
        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <Card className="mt-8 text-center">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">No Merchant Selected</h2>
            </div>
            <CardBody>
              <p>
                Please select a merchant from the navbar to view transactions.
              </p>
            </CardBody>
          </Card>
        </motion.div>
      ) : isLoading ? (
        <PageLoader />
      ) : error ? (
        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <Card className="mt-8 text-center text-danger-500">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Error Loading Transactions
              </h2>
            </div>
            <CardBody>
              <p>{error}</p>
            </CardBody>
          </Card>
        </motion.div>
      ) : transactions.length === 0 ? (
        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <Card className="mt-8 text-center">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">No Transactions Found</h2>
            </div>
            <CardBody>
              <p>
                There are no transactions to display for the selected merchant.
              </p>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <Card className="shadow-lg border border-gray-100 dark:border-gray-800">
            <CardBody className="p-2 sm:p-4">
              <Accordion selectionMode="multiple">
                {transactions.map((transaction: Transaction) => (
                  <AccordionItem
                    key={transaction.logical_transaction_id}
                    aria-label={`Transaction ${transaction.logical_transaction_id}`}
                    classNames={{
                      indicator: "hidden", // Attempt to hide default indicator
                      trigger: "py-3", // Add padding to trigger
                    }}
                    title={
                      <div className="flex items-center w-full text-sm px-2">
                        <ChevronRightIcon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform ui-open:rotate-90" />
                        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_minmax(0,1.2fr)_minmax(0,1fr)] w-full gap-x-4 items-center">
                          {" "}
                          {/* Increased gap-x-4 */}
                          <span
                            className="font-semibold truncate"
                            title={transaction.logical_transaction_id}
                          >
                            {transaction.logical_transaction_id
                              .split("_")
                              .pop()}
                          </span>
                          <span className="text-right truncate">
                            {transaction.amount} {transaction.currency}
                          </span>
                          <span
                            className="truncate text-right"
                            title={
                              transaction.from_accounts[0]?.account_name ||
                              "N/A"
                            }
                          >
                            {transaction.from_accounts[0]?.account_name ||
                              "N/A"}
                          </span>
                          <ArrowRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span
                            className="truncate text-left"
                            title={
                              transaction.to_accounts[0]?.account_name || "N/A"
                            }
                          >
                            {transaction.to_accounts[0]?.account_name || "N/A"}
                          </span>
                          <span className="text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status === "POSTED"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : transaction.status === "EXPECTED"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : transaction.status === "MISMATCH"
                                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <div className="p-2 space-y-3 rounded-b-md">
                      {transaction.versions
                        .sort((a, b) => b.version - a.version)
                        .map((version: TransactionVersion) => (
                          <div
                            key={version.transaction_id}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                          >
                            <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
                              Version {version.version} &nbsp;
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  version.status === "POSTED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : version.status === "EXPECTED"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : version.status === "ARCHIVED"
                                        ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                                        : version.status === "MISMATCH"
                                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {version.status}
                              </span>
                            </h4>
                            {version.entries.length > 0 ? (
                              <Table
                                aria-label={`Entries for version ${version.version}`}
                              >
                                <TableHeader>
                                  <TableColumn className="text-xs">
                                    Entry ID
                                  </TableColumn>
                                  <TableColumn className="text-xs">
                                    Amount
                                  </TableColumn>
                                  <TableColumn className="text-xs">
                                    Account ID
                                  </TableColumn>
                                  <TableColumn className="text-xs">
                                    Type
                                  </TableColumn>
                                  <TableColumn className="text-xs text-center">
                                    Status
                                  </TableColumn>
                                </TableHeader>
                                <TableBody items={version.entries}>
                                  {(entry: TransactionEntry) => (
                                    <TableRow key={entry.entry_id}>
                                      <TableCell
                                        className="text-xs truncate"
                                        title={entry.entry_id}
                                      >
                                        {entry.entry_id}
                                      </TableCell>
                                      <TableCell className="text-xs">
                                        {entry.amount} {entry.currency}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs truncate"
                                        title={entry.account_id}
                                      >
                                        {entry.account_id}
                                      </TableCell>
                                      <TableCell className="text-xs">
                                        {entry.entry_type}
                                      </TableCell>
                                      <TableCell className="text-xs text-center">
                                        <span
                                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                            entry.status === "POSTED"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                              : entry.status === "EXPECTED"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                : entry.status === "ARCHIVED"
                                                  ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                          }`}
                                        >
                                          {entry.status}
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                No entries for this version.
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ViewTransactionsPage;
