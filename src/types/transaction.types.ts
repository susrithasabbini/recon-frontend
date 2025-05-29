export interface TransactionEntry {
  entry_id: string;
  account_id: string;
  transaction_id: string;
  entry_type: "DEBIT" | "CREDIT";
  amount: string;
  currency: string;
  status: "POSTED" | "ARCHIVED" | "EXPECTED" | string; // string for flexibility if other statuses exist
  effective_date: string;
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionVersion {
  transaction_id: string;
  logical_transaction_id: string;
  version: number;
  amount: string;
  currency: string;
  merchant_id: string;
  status: "POSTED" | "ARCHIVED" | "MISMATCH" | "EXPECTED" | string; // string for flexibility
  created_at: string;
  updated_at: string;
  discarded_at: string | null;
  metadata: {
    order_id?: string;
    source_file?: string;
    source_staging_entry_id?: string;
    evolved_from_transaction_id?: string;
    fulfilled_expected_entry_id?: string;
    account_scoped?: boolean;
    processing_mode?: string;
    original_order_id?: string;
    derived_from_entry_id?: string;
    recon_rule_id?: string;
    [key: string]: any; // For any other metadata properties
  };
  entries: TransactionEntry[];
}

export interface TransactionAccountInfo {
  account_id: string;
  account_name: string;
  entry_type: "DEBIT" | "CREDIT";
  merchant_id?: string; // Optional as per schema in prompt, but present in from/to_accounts
}

export interface Transaction {
  logical_transaction_id: string;
  current_version: number;
  amount: string;
  currency: string;
  from_accounts: TransactionAccountInfo[];
  to_accounts: TransactionAccountInfo[];
  status: "POSTED" | "MISMATCH" | "EXPECTED" | string; // string for flexibility
  versions: TransactionVersion[];
}
