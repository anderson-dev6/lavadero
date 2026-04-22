import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { rutaPorRol } from '../../lib/routes'

const nav = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/servicios', label: 'Servicios' },
  { to: '/admin/reservas', label: 'Reservas' },
  { to: '/admin/finanzas', label: 'Finanzas' },
  { to: '/admin/empleados', label: 'Empleados' },
  { to: '/admin/inventario', label: 'Inventario' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  if (user && user.role !== 'admin') {
    return <Navigate to={rutaPorRol(user.role)} replace />
  }

  return (
    <div className="min-h-svh bg-[#f4f6f9] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white shadow-sm shadow-slate-900/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md"
              aria-hidden
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 28c0-6 4-10 12-10s12 4 12 10v6H12v-6z" />
                <path d="M16 22l2-8h12l2 8M10 34h28" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                Panel administrativo
              </p>
              <p className="text-base font-semibold text-slate-900">
                Car-Wash Cereté
              </p>
              <p className="text-xs text-slate-500">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sitio público
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="border-t border-slate-100 bg-slate-50/90">
          <ul className="mx-auto flex max-w-7xl flex-wrap gap-0.5 px-2 py-2 sm:gap-1 sm:px-4">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900',
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
