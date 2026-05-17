import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { CreditHistory, CreditEvaluation } from '../types'

export default function Credit() {
  const [history, setHistory] = useState<CreditHistory | null>(null)
  const [evaluation, setEvaluation] = useState<CreditEvaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState('')

  const loadData = () => {
    setLoading(true)
    api.getCreditHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleEvaluate = async () => {
    setEvaluating(true)
    setError('')
    try {
      const res = await api.evaluateCredit()
      setEvaluation(res)
      loadData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setEvaluating(false)
    }
  }

  const score = history?.credit_score ?? evaluation?.credit_score ?? 0
  const isApproved = history?.is_approved ?? evaluation?.is_approved ?? false

  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-verde'
    if (s >= 40) return 'text-ambar'
    return 'text-red-500'
  }

  const getScoreBg = (s: number) => {
    if (s >= 70) return 'bg-exito-suave border-verde/30'
    if (s >= 40) return 'bg-aviso-suave border-ambar/30'
    return 'bg-red-50 border-red-200'
  }

  const getArcColor = (s: number) => {
    if (s >= 70) return '#4CAF7D'
    if (s >= 40) return '#E8A820'
    return '#ef4444'
  }

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  if (loading) {
    return <div className="text-center py-12 text-texto-muted text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-borde/50 text-center">
        <p className="text-xs text-texto-muted uppercase tracking-wider mb-4">Score de Crédito</p>

        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r={radius}
              fill="none" stroke="#E2E8F0" strokeWidth="12"
            />
            <circle
              cx="80" cy="80" r={radius}
              fill="none" stroke={getArcColor(score)} strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {Math.round(score)}
            </span>
            <span className="text-[10px] text-texto-muted uppercase mt-0.5">/ 100</span>
          </div>
        </div>

        <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getScoreBg(score)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-verde' : 'bg-red-500'}`} />
          {isApproved ? 'Aprobado' : 'No aprobado'}
        </div>
      </div>

      {history && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
          <p className="font-semibold text-texto-oscuro text-sm mb-3">Factores</p>
          <div className="space-y-3">
            <FactorBar label="Transacciones" value={history.total_transactions} max={50} suffix="" />
            <FactorBar label="Volumen total" value={history.total_volume} max={5000} suffix="" />
            <FactorBar label="Trans. promedio" value={history.avg_transaction} max={500} suffix="" />
            <FactorBar label="Estabilidad ingresos" value={history.income_stability_score} max={100} suffix="%" />
            <FactorBar label="Consistencia ahorros" value={history.savings_consistency} max={100} suffix="%" />
          </div>
        </div>
      )}

      {evaluation && (
        <div className="bg-card-claro border border-azul-card/20 rounded-xl p-4">
          <p className="font-semibold text-marino text-sm mb-2">Evaluación Reciente</p>
          <div className="space-y-1">
            {Object.entries(evaluation.factors).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-azul-card capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-marino font-medium">{typeof val === 'number' ? val.toFixed(2) : String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleEvaluate}
        disabled={evaluating}
        className="w-full bg-azul-card text-white py-3 rounded-xl font-semibold text-sm hover:bg-marino transition-colors disabled:opacity-50 shadow-lg shadow-azul-card/20"
      >
        {evaluating ? 'Evaluando...' : 'Evaluar mi Crédito'}
      </button>
    </div>
  )
}

function FactorBar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-texto-muted">{label}</span>
        <span className="text-texto-oscuro font-medium">{typeof value === 'number' ? value.toFixed(2) : value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-borde/50 rounded-full overflow-hidden">
        <div className="h-full bg-azul-card rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
