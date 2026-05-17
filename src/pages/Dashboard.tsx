import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import type { TransactionSummary } from '../types'

export default function Dashboard() {
  const { wallet } = useAuth()
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getTransactionSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const balance = wallet?.balance ?? summary?.balance ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-marino to-azul-card rounded-2xl p-6 text-white shadow-lg">
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Balance Disponible</p>
        <p className="text-4xl font-bold mt-1">
          Bs {balance.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
        </p>
        {summary && (
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/70 text-xs">Ingresos</p>
              <p className="text-verde font-semibold text-sm">
                +Bs {summary.total_income.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs">Gastos</p>
              <p className="text-red-300 font-semibold text-sm">
                -Bs {summary.total_expense.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs">Transacciones</p>
              <p className="text-white font-semibold text-sm">{summary.total_transactions}</p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8 text-texto-muted text-sm">Cargando...</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/transactions')}
          className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-exito-suave rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-verde" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-texto-oscuro">Nueva Transacción</p>
          <p className="text-xs text-texto-muted mt-0.5">Registra ingreso o gasto</p>
        </button>

        <button
          onClick={() => navigate('/savings')}
          className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-aviso-suave rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-ambar" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-texto-oscuro">Mis Ahorros</p>
          <p className="text-xs text-texto-muted mt-0.5">Revisa tu progreso</p>
        </button>

        <button
          onClick={() => navigate('/credit')}
          className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-card-claro rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-azul-card" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-texto-oscuro">Mi Crédito</p>
          <p className="text-xs text-texto-muted mt-0.5">Score y evaluación</p>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 text-left hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-card-claro rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-azul-card" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-texto-oscuro">Mi Perfil</p>
          <p className="text-xs text-texto-muted mt-0.5">Datos personales</p>
        </button>
      </div>
    </div>
  )
}
