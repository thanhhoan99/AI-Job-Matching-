export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type PackageType = "basic" | "premium" | "enterprise"

export interface PaymentPackage {
  id: string
  name: string
  type: PackageType
  price: number
  duration_days: number
  features: string[]
  ai_credits: number
  job_posts_limit: number | null
  applications_limit: number | null
  is_active: boolean
}

export interface Transaction {
  id: string
  user_id: string
  package_id: string
  amount: number
  status: PaymentStatus
  payment_method: string
  transaction_date: string
  expires_at: string
  package?: PaymentPackage
}

export interface UserSubscription {
  user_id: string
  package_id: string
  start_date: string
  end_date: string
  is_active: boolean
  package?: PaymentPackage
}
