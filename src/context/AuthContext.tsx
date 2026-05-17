import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User, Wallet } from '../types'

interface AuthState {
  user: User | null
  wallet: Wallet | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (name: string, occupation?: string) => Promise<void>
  register: (name: string, occupation?: string) => Promise<void>
  adminLogin: (email: string) => Promise<void>
  logout: () => void
  setWallet: (wallet: Wallet) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function loadAuth(): AuthState {
  try {
    const token = localStorage.getItem('lb_token')
    const user = localStorage.getItem('lb_user')
    const wallet = localStorage.getItem('lb_wallet')
    const isAdmin = localStorage.getItem('lb_admin') === 'true'
    if (token && user) {
      api.setToken(token)
      return {
        token,
        user: JSON.parse(user),
        wallet: wallet ? JSON.parse(wallet) : null,
        isAdmin,
        isLoading: false,
      }
    }
  } catch {}
  return { user: null, wallet: null, token: null, isAdmin: false, isLoading: false }
}

function saveAuth(token: string, user: User, wallet: Wallet | null, isAdmin: boolean) {
  localStorage.setItem('lb_token', token)
  localStorage.setItem('lb_user', JSON.stringify(user))
  localStorage.setItem('lb_admin', String(isAdmin))
  if (wallet) {
    localStorage.setItem('lb_wallet', JSON.stringify(wallet))
  }
}

function clearAuth() {
  localStorage.removeItem('lb_token')
  localStorage.removeItem('lb_user')
  localStorage.removeItem('lb_wallet')
  localStorage.removeItem('lb_admin')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadAuth)

  useEffect(() => {
    const saved = loadAuth()
    if (saved.token && saved.user) {
      setState(saved)
    }
  }, [])

  const login = async (name: string, occupation?: string) => {
    const res = await api.login(name, occupation)
    api.setToken(res.access_token)
    saveAuth(res.access_token, res.user, res.wallet, false)
    setState({ user: res.user, wallet: res.wallet, token: res.access_token, isAdmin: false, isLoading: false })
  }

  const register = async (name: string, occupation?: string) => {
    const res = await api.register(name, occupation)
    api.setToken(res.access_token)
    saveAuth(res.access_token, res.user, res.wallet, false)
    setState({ user: res.user, wallet: res.wallet, token: res.access_token, isAdmin: false, isLoading: false })
  }

  const adminLogin = async (email: string) => {
    const res = await api.adminLogin(email)
    api.setToken(res.access_token)
    saveAuth(res.access_token, res.user, res.wallet, true)
    setState({ user: res.user, wallet: res.wallet, token: res.access_token, isAdmin: true, isLoading: false })
  }

  const logout = () => {
    api.setToken(null)
    clearAuth()
    setState({ user: null, wallet: null, token: null, isAdmin: false, isLoading: false })
  }

  const setWallet = (wallet: Wallet) => {
    localStorage.setItem('lb_wallet', JSON.stringify(wallet))
    setState(s => ({ ...s, wallet }))
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, adminLogin, logout, setWallet }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
