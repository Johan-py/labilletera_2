import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await adminLogin(email.trim())
      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-marino to-azul-card flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-marino/20 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-azul-card" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
        <p className="text-texto-muted text-sm mb-8">La Billetera · Administración</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-texto-muted text-xs font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-texto-muted text-white placeholder-texto-muted focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
              placeholder="admin@ejemplo.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-400/20 text-red-300 text-sm px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Acceder'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-texto-muted text-xs hover:text-white/70 transition-colors underline underline-offset-2"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
