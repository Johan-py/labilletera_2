export interface User {
  id: string
  email: string | null
  full_name: string
  occupation: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  created_at: string
}

export interface TokenOut {
  access_token: string
  token_type: string
  user: User
  wallet: Wallet
}

export interface Transaction {
  id: string
  user_id: string
  type: string
  amount: number
  description: string
  category: string
  reference_id: string | null
  created_at: string
}

export interface TransactionSummary {
  total_income: number
  total_expense: number
  total_transactions: number
  balance: number
}

export interface SavingsConfig {
  id: string
  user_id: string
  active_savings_enabled: boolean
  active_savings_per_tx: number
  active_savings_total: number
  passive_savings_total: number
  last_weekly_spend: number
  suggested_active_amount: number
  created_at: string
  updated_at: string
}

export interface SavingsSummary {
  total_saved: number
  active_savings_total: number
  passive_savings_total: number
  active_savings_enabled: boolean
  active_savings_per_tx: number
  suggested_active_amount: number
}

export interface SavingsLog {
  id: string
  user_id: string
  type: string
  amount: number
  source_transaction_id: string | null
  created_at: string
}

export interface CreditHistory {
  id: string
  user_id: string
  total_transactions: number
  total_volume: number
  avg_transaction: number
  income_stability_score: number
  savings_consistency: number
  credit_score: number
  is_approved: boolean
  approved_by: string | null
  approved_at: string | null
  last_evaluated_at: string
  created_at: string
  updated_at: string
}

export interface CreditEvaluation {
  user_id: string
  credit_score: number
  is_approved: boolean
  factors: Record<string, number>
}

export interface UserCreditRow {
  user_id: string
  email: string | null
  full_name: string
  total_transactions: number
  total_volume: number
  current_balance: number
  active_savings_total: number
  passive_savings_total: number
  total_accumulated: number
  credit_score: number
  is_approved: boolean
}

export interface QrPaymentGenerate {
  id: string
  amount: number
  description: string
  status: string
  to_user: { id: string; full_name: string }
  expires_at: string
}

export interface QrPaymentStatus {
  id: string
  amount: number
  description: string
  status: string
  to_user_name: string
  to_user_id: string
  expires_at: string
}

export interface QrPaymentPay {
  transaction: {
    id: string
    type: string
    amount: number
    description: string
  }
  new_balance: number
  to_user: string
  savings_applied: {
    passive_saved: number
    active_saved: number
  }
}

export interface QrMyInfo {
  id: string
  full_name: string
  balance: number
}
