import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { rutaPorRol } from '../../lib/routes'

export function EmpleadoLayout() {
  const { user, logout } = useAuth()

  if (user && user.role !== 'empleado') {
    return <Navigate to={rutaPorRol(user.role)} replace />
  }

  return (
    <div className="min-h-svh bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Empleado
            </p>
            <p className="font-semibold text-slate-800">{user?.name}</p>
          </div>
          <div className="flex gap-2">
            <NavLink
              to="/empleado"
              end
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-1.5 text-sm font-medium',
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')
              }
            >
              Mis servicios
            </NavLink>
            <NavLink
              to="/"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Inicio
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
