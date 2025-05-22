// Types for account entities and related details

export interface Account {
  account_id: string;
  merchant_id: string;
  account_name: string;
  account_type: "DEBIT_NORMAL" | "CREDIT_NORMAL";
  currency: string;
  posted_balance: string;
  pending_balance: string;
  available_balance: string;
}

export interface AccountDetails {
  account_id: string;
  account_name: string;
  merchant_id: string;
}
