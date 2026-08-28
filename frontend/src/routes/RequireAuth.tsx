import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"
import type { UserRole } from "@/lib/types"

interface RequireAuthProps {
  children: ReactNode
  roles?: UserRole[]
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
