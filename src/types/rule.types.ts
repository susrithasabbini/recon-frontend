// Types for reconciliation rules
import type { AccountDetails } from "./account.types";

export interface ReconRule {
  id: string;
  account_one_id: string;
  account_two_id: string;
  created_at: string;
  updated_at: string;
  accountOne: AccountDetails;
  accountTwo: AccountDetails;
}
