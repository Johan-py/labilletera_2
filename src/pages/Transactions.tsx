import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { TransactionSummary, Transaction } from '../types'

const CATEGORIES = ['Alimentación', 'Transporte', 'Salud', 'Entretenimiento', 'Vivienda', 'Educación', 'Otros']

export default function Transactions() {
  const { setWallet } = useAuth()
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [lastTx, setLastTx] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx] = useState(true)

  const loadSummary = () => {
    api.getTransactionSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const loadTransactions = () => {
    api.getTransactions()
      .then(setTransactions)
      .catch(() => {})
      .finally(() => setLoadingTx(false))
  }

  useEffect(() => { loadSummary(); loadTransactions() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return
    setSubmitting(true)
    setError('')
    try {
      const res = await api.createTransaction({
        type,
        amount: amt,
        description: description || undefined,
        category: category || undefined,
      })
      setLastTx(res.transaction)
      setWallet({ ...res.transaction, balance: res.new_balance } as any)
      setShowForm(false)
      setAmount('')
      setDescription('')
      setCategory('')
      loadSummary()
      loadTransactions()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-texto-muted text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
          <p className="text-xs text-texto-muted uppercase tracking-wider">Ingresos</p>
          <p className="text-lg font-bold text-verde mt-1">
            +Bs {(summary?.total_income ?? 0).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
          <p className="text-xs text-texto-muted uppercase tracking-wider">Gastos</p>
          <p className="text-lg font-bold text-red-500 mt-1">
            -Bs {(summary?.total_expense ?? 0).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
          <p className="text-xs text-texto-muted uppercase tracking-wider">Balance</p>
          <p className="text-lg font-bold text-texto-oscuro mt-1">
            Bs {(summary?.balance ?? 0).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
          <p className="text-xs text-texto-muted uppercase tracking-wider">Total</p>
          <p className="text-lg font-bold text-texto-oscuro mt-1">{summary?.total_transactions ?? 0}</p>
        </div>
      </div>

      {lastTx && (
        <div className="bg-exito-suave border border-verde/30 rounded-xl p-4">
          <p className="text-verde text-xs font-semibold uppercase">Última transacción</p>
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className="font-semibold text-texto-oscuro capitalize">{lastTx.type}</p>
              <p className="text-xs text-texto-muted">{lastTx.description || lastTx.category || 'Sin descripción'}</p>
            </div>
            <p className={`font-bold text-lg ${lastTx.type === 'expense' ? 'text-red-500' : 'text-verde'}`}>
              {lastTx.type === 'expense' ? '-' : '+'}Bs {lastTx.amount.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {loadingTx ? (
        <div className="text-center py-8 text-texto-muted text-sm">Cargando movimientos...</div>
      ) : transactions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-borde/50">
          <div className="px-4 py-3 border-b border-borde/50">
            <p className="font-semibold text-texto-oscuro text-sm">Historial de Movimientos</p>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-borde/60" />
            {transactions.map((tx, i) => {
              const isExpense = tx.type === 'expense'
              const isIncome = tx.type === 'income'
              const dotColor = isExpense ? 'bg-red-500' : isIncome ? 'bg-verde' : 'bg-azul-card'
              return (
                <div key={tx.id} className="relative flex items-start gap-3 px-4 py-3">
                  <div className={`relative z-10 w-[10px] h-[10px] rounded-full mt-1.5 ring-2 ring-white ${dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-texto-oscuro capitalize">{tx.description || tx.category || tx.type}</p>
                        <p className="text-xs text-texto-muted">
                          {new Date(tx.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className={`text-sm font-semibold whitespace-nowrap ml-2 ${isExpense ? 'text-red-500' : 'text-verde'}`}>
                        {isExpense ? '-' : '+'}Bs {tx.amount.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-texto-muted text-sm">No hay movimientos aún</div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-marino text-white py-3 rounded-xl font-semibold text-sm hover:bg-azul-card transition-colors shadow-lg shadow-marino/20"
      >
        + Nueva Transacción
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-texto-oscuro">Nueva Transacción</h2>
              <button onClick={() => setShowForm(false)} className="text-texto-muted hover:text-texto-oscuro">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-texto-muted mb-1">Tipo</label>
                <div className="flex gap-2">
                  {(['income', 'expense', 'transfer'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        type === t
                          ? t === 'income'
                            ? 'bg-exito-suave border-verde/40 text-verde'
                            : t === 'expense'
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-card-claro border-azul-card/30 text-azul-card'
                          : 'bg-off-white border-borde text-texto-muted'
                      }`}
                    >
                      {t === 'income' ? 'Ingreso' : t === 'expense' ? 'Gasto' : 'Transferencia'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-texto-muted mb-1">Monto</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-muted font-medium">Bs</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-texto-muted mb-1">Descripción</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-texto-muted mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
                >
                  <option value="">Sin categoría</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !amount || parseFloat(amount) <= 0}
                className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Procesando...' : 'Confirmar Transacción'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
