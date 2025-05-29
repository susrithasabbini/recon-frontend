import { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import clsx from "clsx";
import { title as pageTitleStyle } from "@/components/primitives";
import { useDefaultContext } from "@/contexts/default-context";
import type { Merchant } from "@/types";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 * i, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "backOut" },
  },
};

export default function MerchantManagementPage() {
  const {
    merchants,
    addMerchant,
    isLoading: isMerchantsLoading,
    updateMerchant,
    deleteMerchant,
    selectedMerchant,
    setSelectedMerchant,
  } = useDefaultContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMerchantName, setNewMerchantName] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreatingMerchant, setIsCreatingMerchant] = useState(false);

  const [merchantToEdit, setMerchantToEdit] = useState<Merchant | null>(null);
  const [editName, setEditName] = useState("");
  const [isUpdatingMerchant, setIsUpdatingMerchant] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(
    null,
  );
  const [isDeletingMerchant, setIsDeletingMerchant] = useState(false);

  const filteredMerchants = useMemo(
    () =>
      merchants.filter((merchantItm) =>
        merchantItm.merchant_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    [merchants, searchTerm],
  );

  const handleCreateMerchant = async () => {
    if (!newMerchantName.trim()) {
      setCreateError("Merchant name is required");
      return;
    }
    setIsCreatingMerchant(true);
    setCreateError("");
    try {
      await addMerchant(newMerchantName.trim());
      setNewMerchantName("");
      setIsCreateDialogOpen(false);
      addToast({ title: "Merchant created successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setCreateError(errorMessage);
      addToast({
        title: "Failed to create merchant",
        description: errorMessage,
        variant: "flat",
      });
    } finally {
      setIsCreatingMerchant(false);
    }
  };

  const handleUpdateMerchant = async () => {
    if (!merchantToEdit || !editName.trim()) return;
    setIsUpdatingMerchant(true);
    try {
      await updateMerchant(merchantToEdit.merchant_id, {
        ...merchantToEdit,
        merchant_name: editName.trim(),
      });
      setMerchantToEdit(null);
      addToast({ title: "Merchant updated successfully" });
    } catch (error) {
      addToast({
        title: "Failed to update merchant",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "flat",
      });
    } finally {
      setIsUpdatingMerchant(false);
    }
  };

  const handleDeleteMerchant = async () => {
    if (!merchantToDelete) return;
    setIsDeletingMerchant(true);
    try {
      if (deleteMerchant) {
        await deleteMerchant(merchantToDelete.merchant_id);
        addToast({ title: "Merchant deleted successfully" });
      } else {
        addToast({ title: "Delete function not available", variant: "flat" });
      }
      setIsDeleteConfirmOpen(false);
      setMerchantToDelete(null);
    } catch (error) {
      addToast({
        title: "Failed to delete merchant",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "flat",
      });
    } finally {
      setIsDeletingMerchant(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <h1
          className={clsx(
            pageTitleStyle({ size: "lg", color: "primary" }),
            "mb-2",
          )}
        >
          Merchant Management
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Create and manage your merchants here.
        </p>
      </motion.div>

      <motion.div variants={scaleIn} initial="hidden" animate="visible">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardBody className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select or Create Merchant
              </h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <Input
                    placeholder="Search merchants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                    classNames={{ inputWrapper: "h-10" }}
                  />
                </div>
                <Button
                  color="primary"
                  onPress={() => setIsCreateDialogOpen(true)}
                  className="text-white flex-shrink-0"
                  startContent={<PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />}
                >
                  New Merchant
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {isMerchantsLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading merchants...
                  </p>
                </div>
              )}
              {!isMerchantsLoading && filteredMerchants.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm
                      ? "No merchants match your search."
                      : "No merchants yet."}
                  </p>
                  <Button
                    onPress={() => setIsCreateDialogOpen(true)}
                    variant="light"
                    color="primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Merchant
                  </Button>
                </div>
              )}
              {!isMerchantsLoading &&
                filteredMerchants.map((merchantItm) => (
                  <motion.div
                    key={merchantItm.merchant_id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={clsx(
                      "flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedMerchant === merchantItm.merchant_id
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    )}
                    onClick={() => setSelectedMerchant(merchantItm.merchant_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {selectedMerchant === merchantItm.merchant_id ? (
                          <CheckCircleIcon className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {merchantItm.merchant_name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {merchantItm.merchant_id}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <Modal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader>Create New Merchant</ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateMerchant();
            }}
          >
            <ModalBody>
              <label
                htmlFor="new-merchant-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Merchant Name
              </label>
              <Input
                id="new-merchant-name"
                value={newMerchantName}
                onChange={(e) => setNewMerchantName(e.target.value)}
                className="mt-1"
                placeholder="Enter merchant name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateMerchant();
                }}
              />
              {createError && (
                <p className="text-red-500 text-xs mt-1">{createError}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setIsCreateDialogOpen(false);
                  setNewMerchantName("");
                  setCreateError("");
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isCreatingMerchant}
                disabled={!newMerchantName.trim()}
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {merchantToEdit && (
        <Modal
          isOpen={!!merchantToEdit}
          onClose={() => setMerchantToEdit(null)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>Edit Merchant</ModalHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateMerchant();
              }}
            >
              <ModalBody>
                <label
                  htmlFor="edit-merchant-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Merchant Name
                </label>
                <Input
                  id="edit-merchant-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter merchant name"
                  autoFocus
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => setMerchantToEdit(null)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isUpdatingMerchant}
                  disabled={!editName.trim()}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {merchantToDelete && (
        <Modal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          size="md"
        >
          <ModalContent>
            <ModalHeader>Delete Merchant</ModalHeader>
            <ModalBody>
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete merchant "
                {merchantToDelete.merchant_name}"? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setIsDeleteConfirmOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteMerchant}
                isLoading={isDeletingMerchant}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
