// Types for merchant entities and related component props

export interface Merchant {
  merchant_id: string;
  merchant_name: string;
  merchant_code?: string;
  status?: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at?: string;
}

export interface MerchantSelectProps {
  className?: string;
}
