import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { rutaPorRol } from '../lib/routes'

/** Redirige `/panel` al área según el rol (RF-07). */
export function PanelRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={rutaPorRol(user.role)} replace />
}
