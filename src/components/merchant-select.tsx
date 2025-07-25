import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDefaultContext } from "@/contexts/default-context";
import type { MerchantSelectProps } from "@/types";

export default function MerchantSelect({ className }: MerchantSelectProps) {
  const {
    merchants,
    selectedMerchant,
    setSelectedMerchant,
    addMerchant,
    isLoading,
  } = useDefaultContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMerchantName, setNewMerchantName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName.trim()) return;

    setIsCreating(true);
    try {
      await addMerchant(newMerchantName);
      setNewMerchantName("");
      setIsModalOpen(false);
      addToast({
        title: "Merchant created successfully",
      });
    } catch (error) {
      addToast({
        title: "Failed to create merchant",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Select
        aria-label="Select Merchant"
        selectedKeys={selectedMerchant ? [selectedMerchant] : []}
        onChange={(e) => setSelectedMerchant(e.target.value)}
        className={className}
        data-testid="merchant-select"
        placeholder="Select Merchant"
        isLoading={isLoading}
        isDisabled={isLoading}
        disallowEmptySelection
      >
        {merchants.map((merchant) => (
          <SelectItem
            key={merchant.merchant_id}
            aria-disabled={merchant.merchant_id === selectedMerchant}
          >
            {merchant.merchant_name}
          </SelectItem>
        ))}
      </Select>
      {/* <Button
        isIconOnly
        color="primary"
        variant="flat"
        onPress={() => setIsModalOpen(true)}
        data-testid="create-merchant-button"
        isDisabled={isLoading}
      >
        <PlusIcon className="h-5 w-5" />
      </Button> */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="sm"
        aria-label="Create new merchant"
      >
        <ModalContent as="form" onSubmit={handleCreateMerchant}>
          <ModalHeader>Create New Merchant</ModalHeader>
          <ModalBody>
            <Input
              label="Merchant Name"
              placeholder="Enter merchant name"
              value={newMerchantName}
              onChange={(e) => setNewMerchantName(e.target.value)}
              autoFocus
              data-testid="merchant-name-input"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsModalOpen(false)}
              type="button"
              isDisabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              data-testid="save-merchant-button"
              isLoading={isCreating}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
