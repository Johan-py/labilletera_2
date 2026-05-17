import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, wallet, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-borde/50 text-center">
        <div className="w-16 h-16 bg-exito-suave rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-verde">
            {user?.full_name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-lg font-bold text-texto-oscuro">{user?.full_name}</h2>
        <p className="text-sm text-texto-muted">{user?.occupation || 'Sin ocupación'}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-borde/50 divide-y divide-borde/50">
        <div className="px-4 py-3">
          <p className="text-xs text-texto-muted uppercase tracking-wider">Información Personal</p>
        </div>
        <div className="px-4 py-3 flex justify-between">
          <span className="text-sm text-texto-muted">Email</span>
          <span className="text-sm text-texto-oscuro">{user?.email || 'No registrado'}</span>
        </div>
        <div className="px-4 py-3 flex justify-between">
          <span className="text-sm text-texto-muted">Miembro desde</span>
          <span className="text-sm text-texto-oscuro">
            {user?.created_at ? formatDate(user.created_at) : '-'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between">
          <span className="text-sm text-texto-muted">Estado</span>
          <span className={`text-sm font-medium ${user?.is_active ? 'text-verde' : 'text-red-500'}`}>
            {user?.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {wallet && (
        <div className="bg-white rounded-xl shadow-sm border border-borde/50 divide-y divide-borde/50">
          <div className="px-4 py-3">
            <p className="text-xs text-texto-muted uppercase tracking-wider">Wallet</p>
          </div>
          <div className="px-4 py-3 flex justify-between">
            <span className="text-sm text-texto-muted">Balance</span>
            <span className="text-sm font-semibold text-texto-oscuro">
              Bs {wallet.balance.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="px-4 py-3 flex justify-between">
            <span className="text-sm text-texto-muted">Creada</span>
            <span className="text-sm text-texto-oscuro">{formatDate(wallet.created_at)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
      >
        Cerrar Sesión
      </button>

      <div className="text-center pb-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-xs text-texto-muted hover:text-texto-oscuro underline underline-offset-2"
        >
          Panel de Administración
        </button>
      </div>
    </div>
  )
}
