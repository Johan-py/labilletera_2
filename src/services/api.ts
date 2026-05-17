import type {
  TokenOut,
  User,
  TransactionSummary,
  SavingsConfig,
  SavingsSummary,
  SavingsLog,
  CreditHistory,
  CreditEvaluation,
  UserCreditRow,
  QrPaymentGenerate,
  QrPaymentStatus,
  QrPaymentPay,
  QrMyInfo,
} from '../types'

const API_BASE = 'http://localhost:8000'

class ApiClient {
  private _token: string | null = null

  get token(): string | null {
    return this._token
  }

  setToken(token: string | null) {
    this._token = token
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = new URL(`${API_BASE}${path}`)
    if (this._token) {
      url.searchParams.set('token', this._token)
    }

    const res = await fetch(url.toString(), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Error de conexión' }))
      throw new Error(err.detail || `Error ${res.status}`)
    }

    return res.json()
  }

  login(name: string, occupation?: string) {
    return this.request<TokenOut>('POST', '/auth/login', { name, occupation })
  }

  register(name: string, occupation?: string) {
    return this.request<TokenOut>('POST', '/auth/register', { name, occupation })
  }

  adminLogin(email: string) {
    return this.request<TokenOut>('POST', '/auth/admin/login', { email })
  }

  getMe() {
    return this.request<User>('GET', '/auth/me')
  }

  createTransaction(data: { type: string; amount: number; description?: string; category?: string }) {
    return this.request<{
      transaction: import('../types').Transaction
      new_balance: number
      savings_applied: { passive_saved: number; active_saved: number }
    }>('POST', '/transactions', data)
  }

  getTransactions() {
    return this.request<import('../types').Transaction[]>('GET', '/transactions')
  }

  getTransactionSummary() {
    return this.request<TransactionSummary>('GET', '/transactions/summary')
  }

  getSavingsConfig() {
    return this.request<SavingsConfig>('GET', '/savings/config')
  }

  toggleSavings(data: { enabled: boolean; custom_amount?: number }) {
    return this.request<SavingsConfig>('POST', '/savings/toggle', data)
  }

  getSavingsSummary() {
    return this.request<SavingsSummary>('GET', '/savings/summary')
  }

  getSavingsLog(limit = 50) {
    return this.request<SavingsLog[]>('GET', `/savings/log?limit=${limit}`)
  }

  getCreditHistory() {
    return this.request<CreditHistory>('GET', '/credit/history')
  }

  evaluateCredit() {
    return this.request<CreditEvaluation>('POST', '/credit/evaluate')
  }

  getAdminUsers(search?: string) {
    const path = search ? `/admin/users?search=${encodeURIComponent(search)}` : '/admin/users'
    return this.request<UserCreditRow[]>('GET', path)
  }

  getUserDetail(userId: string) {
    return this.request<UserCreditRow>('GET', `/admin/users/${userId}`)
  }

  overrideCreditDecision(data: { user_id: string; is_approved: boolean }) {
    return this.request<{ user_id: string; is_approved: boolean; overridden_by: string }>('POST', '/admin/credit/decision', data)
  }

  generateQrPayment(data: { amount: number; description?: string }) {
    return this.request<QrPaymentGenerate>('POST', '/qr/generate', data)
  }

  getQrPaymentStatus(paymentId: string) {
    return this.request<QrPaymentStatus>('GET', `/qr/${paymentId}`)
  }

  payQrPayment(paymentId: string) {
    return this.request<QrPaymentPay>('POST', `/qr/pay/${paymentId}`)
  }

  getQrMyInfo() {
    return this.request<QrMyInfo>('GET', '/qr/my/info')
  }
}

export const api = new ApiClient()
