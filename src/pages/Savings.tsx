import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { SavingsSummary, SavingsLog, SavingsConfig } from '../types'

export default function Savings() {
  const [summary, setSummary] = useState<SavingsSummary | null>(null)
  const [config, setConfig] = useState<SavingsConfig | null>(null)
  const [logs, setLogs] = useState<SavingsLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [showConfig, setShowConfig] = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api.getSavingsSummary(),
      api.getSavingsConfig(),
      api.getSavingsLog(10),
    ])
      .then(([s, c, l]) => {
        setSummary(s)
        setConfig(c)
        setLogs(l)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleToggle = async () => {
    if (!config) return
    setSaving(true)
    try {
      const newEnabled = !config.active_savings_enabled
      const data: { enabled: boolean; custom_amount?: number } = { enabled: newEnabled }
      if (newEnabled && customAmount) {
        data.custom_amount = parseFloat(customAmount)
      }
      const newConfig = await api.toggleSavings(data)
      setConfig(newConfig)
      loadData()
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-12 text-texto-muted text-sm">Cargando...</div>
  }

  const totalSaved = summary?.total_saved ?? 0
  const activeTotal = summary?.active_savings_total ?? 0
  const passiveTotal = summary?.passive_savings_total ?? 0
  const enabled = config?.active_savings_enabled ?? false
  const perTx = config?.active_savings_per_tx ?? 0
  const suggested = summary?.suggested_active_amount ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-ambar to-ambar/80 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Total Ahorrado</p>
        <p className="text-4xl font-bold mt-1">
          Bs {totalSaved.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-white/70 text-xs">Ahorro Activo</p>
            <p className="text-white font-semibold text-sm">
              Bs {activeTotal.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Ahorro Pasivo</p>
            <p className="text-white font-semibold text-sm">
              Bs {passiveTotal.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-texto-oscuro">Ahorro Activo</p>
            <p className="text-xs text-texto-muted">
                {enabled ? `Bs ${perTx.toFixed(2)} por transacción` : 'Desactivado'}            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              enabled ? 'bg-verde' : 'bg-borde'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="mt-3 text-xs text-verde font-medium underline underline-offset-2"
          >
            {showConfig ? 'Ocultar' : 'Configurar monto'}
          </button>
        )}

        {showConfig && enabled && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={customAmount || perTx.toString()}
              onChange={e => setCustomAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-off-white border border-borde text-sm focus:outline-none focus:ring-2 focus:ring-azul-card"
            />
            <button
              onClick={handleToggle}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-marino text-white text-sm font-medium"
            >
              {saving ? '...' : 'Actualizar'}
            </button>
          </div>
        )}

        {suggested > 0 && (
          <p className="mt-2 text-xs text-texto-muted">
            Sugerido: <span className="font-medium text-texto-muted">Bs {suggested.toFixed(2)}</span>
          </p>
        )}
      </div>

      {logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-borde/50">
          <div className="px-4 py-3 border-b border-borde/50">
            <p className="font-semibold text-texto-oscuro text-sm">Historial de Ahorro</p>
          </div>
          <div className="divide-y divide-borde/50">
            {logs.map(log => (
              <div key={log.id} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-texto-oscuro capitalize">{log.type}</p>
                  <p className="text-xs text-texto-muted">
                    {new Date(log.created_at).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ambar">
                  +Bs {log.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
