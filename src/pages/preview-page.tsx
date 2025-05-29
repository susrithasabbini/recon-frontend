import { useState, useEffect, useMemo } from "react";
import PSPPreviewPage from "./psp-preview";
import BankPreviewPage from "./bank-preview";
import { useDefaultContext } from "@/contexts/default-context";
import type { Account } from "@/types";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import api from "@/config/axios";

export const PreviewPage = () => {
  const { selectedMerchant, getAccounts } = useDefaultContext();
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [selectedAccount1, setSelectedAccount1] = useState<string>("");
  const [selectedAccount2, setSelectedAccount2] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [runningRecon, setRunningRecon] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedMerchant) {
        setAllAccounts([]);
        setSelectedAccount1("");
        setSelectedAccount2("");
        return;
      }
      setLoading(true);
      try {
        const data = await getAccounts();
        setAllAccounts(data);
      } catch (error) {
        addToast({
          title: "Failed to fetch accounts for Preview",
          variant: "flat",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [selectedMerchant, getAccounts]);

  const accountsForFileUpload1 = useMemo(() => {
    return allAccounts.filter((acc) => acc.account_id !== selectedAccount2);
  }, [allAccounts, selectedAccount2]);

  const accountsForFileUpload2 = useMemo(() => {
    return allAccounts.filter((acc) => acc.account_id !== selectedAccount1);
  }, [allAccounts, selectedAccount1]);

  const handleRunRecon = async () => {
    if (!selectedMerchant) {
      addToast({
        title: "Error",
        description: "Please select a merchant first",
        variant: "flat",
      });
      return;
    }

    setRunningRecon(true);
    try {
      const { data } = await api.post("/recon-engine/trigger", {
        timeoutMs: 300000,
      });

      const { processed, succeeded, failed, duration, error } = data;

      if (error) {
        addToast({
          title: "Recon Engine Error",
          description: error,
          variant: "flat",
        });
      } else {
        addToast({
          title: "Recon Engine Completed",
          description: `Processed: ${processed}, Succeeded: ${succeeded}, Failed: ${failed}, Duration: ${duration}ms`,
          variant: "flat",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to trigger recon engine";
      addToast({
        title: "Error",
        description: errorMessage,
        variant: "flat",
      });
    } finally {
      setRunningRecon(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-10 max-w-[2000px] mx-auto">
        <div className="w-full lg:w-1/2">
          <PSPPreviewPage
            accounts={accountsForFileUpload1}
            selectedAccount={selectedAccount1}
            onAccountChange={setSelectedAccount1}
            componentId="fileUpload1"
            isLoading={loading}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <BankPreviewPage
            accounts={accountsForFileUpload2}
            selectedAccount={selectedAccount2}
            onAccountChange={setSelectedAccount2}
            componentId="fileUpload2"
            isLoading={loading}
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          onPress={handleRunRecon}
          isLoading={runningRecon}
          disabled={runningRecon || !selectedMerchant}
          variant="solid"
          size="lg"
        >
          Run Recon
        </Button>
      </div>
    </div>
  );
};
