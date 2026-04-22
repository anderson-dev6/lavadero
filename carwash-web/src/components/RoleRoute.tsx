import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { rutaPorRol } from '../lib/routes'
import type { UserRole } from '../types/carwash'

export function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[]
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={rutaPorRol(user.role)} replace />
  }

  return <>{children}</>
}
