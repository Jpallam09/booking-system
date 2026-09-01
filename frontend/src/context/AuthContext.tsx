import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"

import { login as loginApi, logout as logoutApi } from "@/api/auth"
import { clearAuth, getToken, getUser, setAuth } from "@/lib/auth"
import type { LoginPayload, User } from "@/lib/types"

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<User>
  logout: () => Promise<void>
  setUser: (user: User) => void
  handleOAuthLogin: (token: string, user: User) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => getUser())
  const [token, setToken] = useState<string | null>(() => getToken())

  useEffect(() => {
    if (token && !user) {
      setToken(null)
      clearAuth()
    }
  }, [token, user])

  const login = useCallback(async (payload: LoginPayload) => {
    const { data, token: newToken } = await loginApi(payload)
    setAuth(newToken, data)
    setUserState(data)
    setToken(newToken)
    return data
  }, [])

  const setUser = useCallback((next: User) => {
    setUserState(next)
    const current = getToken()
    if (current) setAuth(current, next)
  }, [])

  const handleOAuthLogin = useCallback((token: string, user: User) => {
    setAuth(token, user)
    setUserState(user)
    setToken(token)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (token) await logoutApi()
    } catch {
      // ignore network errors on logout; clear local state regardless
    }
    clearAuth()
    setUserState(null)
    setToken(null)
  }, [token])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      setUser,
      handleOAuthLogin,
    }),
    [user, token, login, logout, setUser, handleOAuthLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
