import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { UserCreditRow } from '../../types'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserCreditRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserCreditRow | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadUsers = (q?: string) => {
    setLoading(true)
    api.getAdminUsers(q)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsers(search)
  }

  const handleOverride = async (userId: string, approved: boolean) => {
    setActionLoading(true)
    try {
      await api.overrideCreditDecision({ user_id: userId, is_approved: approved })
      loadUsers(search)
      setSelectedUser(null)
    } catch {}
    setActionLoading(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const formatCurrency = (n: number) =>
    `Bs {n.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`

  return (
    <div className="min-h-dvh bg-off-white">
      <header className="bg-marino text-white px-4 py-3 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-azul-card rounded-full flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <div className="font-semibold text-sm">Admin Panel</div>
            <div className="text-texto-muted text-xs">{user?.full_name}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-texto-muted hover:text-white text-xs font-medium">
          Salir
        </button>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-borde text-sm focus:outline-none focus:ring-2 focus:ring-azul-card"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-marino text-white text-sm font-medium hover:bg-azul-card"
          >
            Buscar
          </button>
        </form>

        {loading && <div className="text-center py-8 text-texto-muted text-sm">Cargando...</div>}

        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-texto-muted text-sm">No se encontraron usuarios</div>
        )}

        {!loading && users.map(u => (
          <button
            key={u.user_id}
            onClick={() => setSelectedUser(u)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-borde/50 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="font-semibold text-texto-oscuro text-sm truncate">{u.full_name}</p>
                <p className="text-xs text-texto-muted truncate">{u.email || 'Sin email'}</p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                u.is_approved ? 'bg-exito-suave text-verde' : 'bg-red-50 text-red-600'
              }`}>
                {u.is_approved ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-borde/30">
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Balance</p>
                <p className="text-xs font-semibold text-texto-oscuro">{formatCurrency(u.current_balance)}</p>
              </div>
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Score</p>
                <p className={`text-xs font-semibold ${
                  u.credit_score >= 70 ? 'text-verde' : u.credit_score >= 40 ? 'text-ambar' : 'text-red-500'
                }`}>
                  {Math.round(u.credit_score)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Volumen</p>
                <p className="text-xs font-semibold text-texto-oscuro">{formatCurrency(u.total_volume)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Ahorro Act.</p>
                <p className="text-xs font-medium text-texto-muted">{formatCurrency(u.active_savings_total)}</p>
              </div>
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Ahorro Pas.</p>
                <p className="text-xs font-medium text-texto-muted">{formatCurrency(u.passive_savings_total)}</p>
              </div>
              <div>
                <p className="text-[10px] text-texto-muted uppercase">Total Acum.</p>
                <p className="text-xs font-medium text-texto-muted">{formatCurrency(u.total_accumulated)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-texto-oscuro">{selectedUser.full_name}</h2>
              <button onClick={() => setSelectedUser(null)} className="text-texto-muted hover:text-texto-oscuro">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Email" value={selectedUser.email || '—'} />
                <InfoItem label="Balance" value={formatCurrency(selectedUser.current_balance)} />
                <InfoItem label="Score" value={String(Math.round(selectedUser.credit_score))} />
                <InfoItem label="Estado" value={selectedUser.is_approved ? 'Aprobado' : 'Pendiente'} />
                <InfoItem label="Volumen total" value={formatCurrency(selectedUser.total_volume)} />
                <InfoItem label="Transacciones" value={String(selectedUser.total_transactions)} />
                <InfoItem label="Ahorro activo" value={formatCurrency(selectedUser.active_savings_total)} />
                <InfoItem label="Ahorro pasivo" value={formatCurrency(selectedUser.passive_savings_total)} />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleOverride(selectedUser.user_id, true)}
                  disabled={actionLoading || selectedUser.is_approved}
                className="w-full py-3 rounded-xl bg-verde text-white font-semibold text-sm hover:bg-verde/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Procesando...' : 'Aprobar Crédito'}
                </button>
                <button
                  onClick={() => handleOverride(selectedUser.user_id, false)}
                  disabled={actionLoading || !selectedUser.is_approved}
                  className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Denegar Crédito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card-claro rounded-lg p-3">
      <p className="text-[10px] text-texto-muted uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-texto-oscuro mt-0.5">{value}</p>
    </div>
  )
}
