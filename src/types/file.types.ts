// Types for file uploads, staging entries, account entries, and related component props

export interface StagingEntry {
  staging_entry_id: string;
  account_id: string;
  entry_type: "DEBIT" | "CREDIT";
  amount: string; // Kept as string as per original
  currency: string;
  status: string; // Consider a union type if statuses are fixed, e.g., "NEEDS_MANUAL_REVIEW" | "PROCESSED" | "PENDING"
  effective_date: string; // ISO date string
  metadata: Record<string, any>;
  discarded_at: string | null; // ISO date string or null
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  account: {
    // Simplified account details for staging context
    account_name: string;
    merchant_id: string;
  };
}

export interface AccountEntryTransaction {
  transaction_id: string;
  status: "EXPECTED" | "POSTED" | "MISMATCH" | "ARCHIVED";
  logical_transaction_id?: string;
  version?: number;
}

export interface AccountEntry {
  entry_id: string;
  account_id: string;
  transaction_id: string; // Or null if it can be unlinked initially
  entry_type: "DEBIT" | "CREDIT";
  amount: number;
  currency: string;
  status: "EXPECTED" | "POSTED" | "ARCHIVED";
  effective_date: string; // ISO date string
  metadata: Record<string, any>;
  discarded_at: string | null; // ISO date string or null
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  transaction?: AccountEntryTransaction;
}

export interface UploadError {
  row_number: number;
  error_details: string;
  row_data: Record<string, any>;
}

export interface UploadResponse {
  message: string;
  successful_ingestions: number;
  failed_ingestions: number;
  errors: UploadError[];
}

export interface FileUploadFormProps {
  selectedAccount: string; // account_id
  loading: boolean;
  processingMode: string;
  setProcessingMode: (mode: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadClick: () => void;
  filename: string | null;
  uploadStatus: UploadResponse | null; // Using the more detailed UploadResponse, nullable
  isFileSelected: boolean;
}
