import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { rutaPorRol } from '../../lib/routes'

const links = [
  { to: '/cliente', end: true, label: 'Inicio' },
  { to: '/cliente/agendar', label: 'Agendar' },
  { to: '/cliente/reservas', label: 'Mis reservas' },
  { to: '/cliente/historial', label: 'Historial' },
]

export function ClienteLayout() {
  const { user, logout } = useAuth()

  if (user && user.role !== 'cliente') {
    return <Navigate to={rutaPorRol(user.role)} replace />
  }

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              Cliente
            </p>
            <p className="font-semibold text-slate-800">{user?.name}</p>
            {user?.telefono ? (
              <p className="text-sm text-slate-500">{user.telefono}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <NavLink
              to="/"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Inicio web
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
        <nav className="border-t border-slate-100 bg-violet-50/50">
          <ul className="mx-auto flex max-w-lg flex-wrap gap-1 px-2 py-2">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-3 py-2 text-sm font-medium',
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-violet-900/80 hover:bg-violet-100',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
