import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import api from "@/config/axios";

interface Merchant {
  merchant_id: string;
  merchant_name: string;
  merchant_code: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

interface Account {
  account_id: string;
  merchant_id: string;
  account_name: string;
  account_type: "DEBIT_NORMAL" | "CREDIT_NORMAL";
  currency: string;
  initial_balance: string;
  posted_balance: string;
  pending_balance: string;
  available_balance: string;
  created_at?: string;
  updated_at?: string;
}

interface DefaultContextType {
  merchants: Merchant[];
  selectedMerchant: string;
  setSelectedMerchant: (id: string) => void;
  createMerchant: (merchantData: {
    merchant_name: string;
    merchant_code: string;
  }) => Promise<Merchant>;
  getMerchants: () => Promise<Merchant[]>;
  deleteMerchant: (merchantId: string) => Promise<void>;
  updateMerchant: (
    merchantId: string,
    payload: {
      merchant_name: string;
      merchant_code: string;
    },
  ) => Promise<Merchant>;
  addMerchant: (name: string) => Promise<void>;
  createAccount: (accountData: {
    account_name: string;
    account_type: "DEBIT_NORMAL" | "CREDIT_NORMAL";
    currency: string;
    initial_balance: number;
  }) => Promise<Account>;
  getAccounts: () => Promise<Account[]>;
  deleteAccount: (accountId: string) => Promise<void>;
  updateAccount: (
    merchantId: string,
    accountId: string,
    payload: { account_name: string },
  ) => Promise<Account>;
  isLoading: boolean;
}

const DefaultContext = createContext<DefaultContextType | undefined>(undefined);

export function DefaultReconProvider({ children }: { children: ReactNode }) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch merchants on mount
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const { data } = await api.get<Merchant[]>("/merchants");

        setMerchants(data);
        // Select the first merchant by default if available
        if (data.length > 0 && !selectedMerchant) {
          setSelectedMerchant(data[0].merchant_id);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const addMerchant = async (name: string) => {
    try {
      const merchantId = Date.now().toString(); // Generate a unique ID
      const { data: newMerchant } = await api.post<Merchant>("/merchants", {
        merchant_id: merchantId,
        merchant_name: name.trim(),
      });

      setMerchants((prev) => [...prev, newMerchant]);
      // Select the newly created merchant
      setSelectedMerchant(newMerchant.merchant_id);
    } catch (error) {
      console.error("Error creating merchant:", error);
      throw error;
    }
  };

  const createAccount = async (accountData: {
    account_name: string;
    account_type: "DEBIT_NORMAL" | "CREDIT_NORMAL";
    currency: string;
    initial_balance: number;
  }) => {
    if (!selectedMerchant) {
      throw new Error("No merchant selected");
    }

    try {
      const { data: newAccount } = await api.post<Account>(
        `/merchants/${selectedMerchant}/accounts`,
        accountData,
      );

      return newAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  const getAccounts = async () => {
    if (!selectedMerchant) {
      throw new Error("No merchant selected");
    }

    try {
      const { data } = await api.get<Account[]>(
        `/merchants/${selectedMerchant}/accounts`,
      );

      return data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    if (!selectedMerchant) {
      throw new Error("No merchant selected");
    }

    try {
      await api.delete(`/merchants/${selectedMerchant}/accounts/${accountId}`);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const updateAccount = async (
    merchantId: string,
    accountId: string,
    payload: { account_name: string },
  ): Promise<Account> => {
    if (!merchantId) {
      throw new Error("No merchant selected for updating account");
    }
    try {
      const { data: updatedAccount } = await api.put<Account>(
        `/merchants/${merchantId}/accounts/${accountId}`,
        payload,
      );

      return updatedAccount;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  };

  const createMerchant = async (merchantData: {
    merchant_name: string;
    merchant_code: string;
  }) => {
    try {
      const { data: newMerchant } = await api.post<Merchant>(
        "/merchants",
        merchantData,
      );

      setMerchants((prev) => [...prev, newMerchant]);

      return newMerchant;
    } catch (error) {
      console.error("Error creating merchant:", error);
      throw error;
    }
  };

  const getMerchants = async () => {
    try {
      const { data } = await api.get<Merchant[]>("/merchants");

      setMerchants(data);

      return data;
    } catch (error) {
      console.error("Error fetching merchants:", error);
      throw error;
    }
  };

  const deleteMerchant = async (merchantId: string) => {
    try {
      await api.delete(`/merchants/${merchantId}`);
      setMerchants((prev) => prev.filter((m) => m.merchant_id !== merchantId));
    } catch (error) {
      console.error("Error deleting merchant:", error);
      throw error;
    }
  };

  const updateMerchant = async (
    merchantId: string,
    payload: {
      merchant_name: string;
      merchant_code: string;
    },
  ) => {
    try {
      const { data: updatedMerchant } = await api.put<Merchant>(
        `/merchants/${merchantId}`,
        payload,
      );

      setMerchants((prev) =>
        prev.map((m) => (m.merchant_id === merchantId ? updatedMerchant : m)),
      );

      return updatedMerchant;
    } catch (error) {
      console.error("Error updating merchant:", error);
      throw error;
    }
  };

  return (
    <DefaultContext.Provider
      value={{
        merchants,
        selectedMerchant,
        setSelectedMerchant,
        createMerchant,
        getMerchants,
        deleteMerchant,
        updateMerchant,
        addMerchant,
        createAccount,
        getAccounts,
        deleteAccount,
        updateAccount,
        isLoading,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  const context = useContext(DefaultContext);

  if (context === undefined) {
    throw new Error(
      "useDefaultContext must be used within a DefaultContextProvider",
    );
  }

  return context;
}
